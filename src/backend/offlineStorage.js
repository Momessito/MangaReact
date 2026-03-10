// src/backend/offlineStorage.js
// IndexedDB helper for saving manga chapters offline

const DB_NAME = 'YushaOffline';
const DB_VERSION = 1;
const STORE_CHAPTERS = 'chapters';
const STORE_PAGES = 'pages';

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_CHAPTERS)) {
                db.createObjectStore(STORE_CHAPTERS, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(STORE_PAGES)) {
                db.createObjectStore(STORE_PAGES, { keyPath: 'id' });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

const OfflineStorage = {
    // Save a chapter with all its page images as blobs
    async saveChapter(chapterData) {
        // chapterData: { mangaId, mangaTitle, mangaImage, chapterId, chapterNum, chapterTitle, pages: [{ index, blob }] }
        const db = await openDB();

        // Save chapter metadata
        const txChap = db.transaction(STORE_CHAPTERS, 'readwrite');
        const chapStore = txChap.objectStore(STORE_CHAPTERS);
        chapStore.put({
            id: chapterData.chapterId,
            mangaId: chapterData.mangaId,
            mangaTitle: chapterData.mangaTitle,
            mangaImage: chapterData.mangaImage,
            chapterNum: chapterData.chapterNum,
            chapterTitle: chapterData.chapterTitle,
            pageCount: chapterData.pages.length,
            savedAt: Date.now(),
        });
        await new Promise((res, rej) => { txChap.oncomplete = res; txChap.onerror = rej; });

        // Save each page image as a separate entry
        const txPages = db.transaction(STORE_PAGES, 'readwrite');
        const pageStore = txPages.objectStore(STORE_PAGES);
        for (const page of chapterData.pages) {
            pageStore.put({
                id: `${chapterData.chapterId}_${page.index}`,
                chapterId: chapterData.chapterId,
                index: page.index,
                blob: page.blob,
                type: page.type || 'image/jpeg',
            });
        }
        await new Promise((res, rej) => { txPages.oncomplete = res; txPages.onerror = rej; });
    },

    // Get all saved chapters
    async getSavedChapters() {
        const db = await openDB();
        const tx = db.transaction(STORE_CHAPTERS, 'readonly');
        const store = tx.objectStore(STORE_CHAPTERS);
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result.sort((a, b) => b.savedAt - a.savedAt));
            request.onerror = () => reject(request.error);
        });
    },

    // Get pages for a chapter
    async getChapterPages(chapterId) {
        const db = await openDB();
        const tx = db.transaction(STORE_PAGES, 'readonly');
        const store = tx.objectStore(STORE_PAGES);
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => {
                const pages = request.result
                    .filter(p => p.chapterId === chapterId)
                    .sort((a, b) => a.index - b.index);
                resolve(pages);
            };
            request.onerror = () => reject(request.error);
        });
    },

    // Check if a chapter is saved
    async isChapterSaved(chapterId) {
        const db = await openDB();
        const tx = db.transaction(STORE_CHAPTERS, 'readonly');
        const store = tx.objectStore(STORE_CHAPTERS);
        return new Promise((resolve, reject) => {
            const request = store.get(chapterId);
            request.onsuccess = () => resolve(!!request.result);
            request.onerror = () => reject(request.error);
        });
    },

    // Delete a saved chapter
    async deleteChapter(chapterId) {
        const db = await openDB();

        // Delete chapter metadata
        const txChap = db.transaction(STORE_CHAPTERS, 'readwrite');
        txChap.objectStore(STORE_CHAPTERS).delete(chapterId);
        await new Promise((res, rej) => { txChap.oncomplete = res; txChap.onerror = rej; });

        // Delete all pages for this chapter
        const txPages = db.transaction(STORE_PAGES, 'readwrite');
        const pageStore = txPages.objectStore(STORE_PAGES);
        const allPages = await new Promise((res, rej) => {
            const req = pageStore.getAll();
            req.onsuccess = () => res(req.result);
            req.onerror = () => rej(req.error);
        });

        const tx2 = db.transaction(STORE_PAGES, 'readwrite');
        const store2 = tx2.objectStore(STORE_PAGES);
        for (const page of allPages.filter(p => p.chapterId === chapterId)) {
            store2.delete(page.id);
        }
        await new Promise((res, rej) => { tx2.oncomplete = res; tx2.onerror = rej; });
    },

    // Get storage usage estimate
    async getStorageUsage() {
        if (navigator.storage && navigator.storage.estimate) {
            const est = await navigator.storage.estimate();
            return {
                used: est.usage,
                total: est.quota,
                usedMB: (est.usage / 1024 / 1024).toFixed(1),
                totalMB: (est.quota / 1024 / 1024).toFixed(0),
            };
        }
        return null;
    }
};

export default OfflineStorage;
