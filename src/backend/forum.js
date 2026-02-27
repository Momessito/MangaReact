import { db, auth } from '../firebase';
import {
    collection, addDoc, query, orderBy, limit,
    onSnapshot, serverTimestamp, doc, updateDoc,
    arrayUnion, arrayRemove, getDoc, getDocs, where
} from 'firebase/firestore';

class Forum {
    static getUid() {
        if (auth.currentUser) return auth.currentUser.uid;
        return localStorage.getItem('firebase_uid');
    }

    // Create a new forum post
    static async createPost(title, body, tags = []) {
        try {
            const uid = this.getUid();
            if (!uid) return null;

            const userSnap = await getDoc(doc(db, 'users', uid));
            const userData = userSnap.exists() ? userSnap.data() : {};

            const ref = await addDoc(collection(db, 'forum_posts'), {
                uid,
                nickname: userData.nickname || 'Anónimo',
                avatar: userData.img || '',
                title,
                body,
                tags,
                likes: [],
                replyCount: 0,
                timestamp: serverTimestamp()
            });
            return ref.id;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    // Listen to posts (latest N)
    static listenToPosts(callback, limitCount = 20) {
        const q = query(
            collection(db, 'forum_posts'),
            orderBy('timestamp', 'desc'),
            limit(limitCount)
        );
        return onSnapshot(q, (snap) => {
            const posts = [];
            snap.forEach(d => posts.push({ id: d.id, ...d.data() }));
            callback(posts);
        });
    }

    // Toggle like on a post
    static async toggleLike(postId) {
        try {
            const uid = this.getUid();
            if (!uid) return;
            const postRef = doc(db, 'forum_posts', postId);
            const snap = await getDoc(postRef);
            if (!snap.exists()) return;
            const likes = snap.data().likes || [];
            if (likes.includes(uid)) {
                await updateDoc(postRef, { likes: arrayRemove(uid) });
            } else {
                await updateDoc(postRef, { likes: arrayUnion(uid) });
            }
        } catch (err) {
            console.error(err);
        }
    }

    // Add a reply to a post
    static async addReply(postId, body) {
        try {
            const uid = this.getUid();
            if (!uid) return false;
            const userSnap = await getDoc(doc(db, 'users', uid));
            const userData = userSnap.exists() ? userSnap.data() : {};

            await addDoc(collection(db, 'forum_posts', postId, 'replies'), {
                uid,
                nickname: userData.nickname || 'Anónimo',
                avatar: userData.img || '',
                body,
                timestamp: serverTimestamp()
            });

            // Increment reply count
            await updateDoc(doc(db, 'forum_posts', postId), {
                replyCount: (await getDoc(doc(db, 'forum_posts', postId))).data().replyCount + 1
            });
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    // Listen to replies for a post
    static listenToReplies(postId, callback) {
        const q = query(
            collection(db, 'forum_posts', postId, 'replies'),
            orderBy('timestamp', 'asc')
        );
        return onSnapshot(q, (snap) => {
            const replies = [];
            snap.forEach(d => replies.push({ id: d.id, ...d.data() }));
            callback(replies);
        });
    }

    // Fetch global activity feed (latest reviews from community)
    static async getActivityFeed(limitCount = 15) {
        try {
            const q = query(
                collection(db, 'reviews'),
                orderBy('timestamp', 'desc'),
                limit(limitCount)
            );
            const snap = await getDocs(q);
            const items = [];
            snap.forEach(d => items.push({ id: d.id, ...d.data() }));
            return items;
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    // Get top rated mangas by community
    static async getTopRatedMangas(limitCount = 10) {
        try {
            const q = query(collection(db, 'reviews'), orderBy('rating', 'desc'), limit(50));
            const snap = await getDocs(q);
            const mangaMap = {};
            snap.forEach(d => {
                const data = d.data();
                if (!mangaMap[data.mangaId]) {
                    mangaMap[data.mangaId] = { mangaId: data.mangaId, mangaTitle: data.mangaTitle, mangaImage: data.mangaImage, totalRating: 0, count: 0 };
                }
                mangaMap[data.mangaId].totalRating += data.rating;
                mangaMap[data.mangaId].count += 1;
            });
            return Object.values(mangaMap)
                .map(m => ({ ...m, avg: (m.totalRating / m.count).toFixed(1) }))
                .sort((a, b) => b.avg - a.avg)
                .slice(0, limitCount);
        } catch (err) {
            console.error(err);
            return [];
        }
    }
}

export default Forum;
