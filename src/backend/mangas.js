import axios from 'axios';
import User from './users';

const isDev = import.meta.env.DEV;
const mangaDexBase = 'https://api.mangadex.org';

// Build query string keeping [] literal (MangaDex needs them unencoded)
function buildQS(params) {
    return Object.entries(params)
        .flatMap(([key, value]) => {
            if (Array.isArray(value)) {
                return value.map(v => `${key}=${encodeURIComponent(v)}`);
            }
            return [`${key}=${encodeURIComponent(value)}`];
        })
        .join('&');
}

const buildDirectUrl = (path, params = {}) => {
    const qs = buildQS(params);
    return `${mangaDexBase}/${path}${qs ? '?' + qs : ''}`;
};

// ⬇️ Depois de criares o Cloudflare Worker, substitui pelo teu URL
// Ex: 'https://mangadex-proxy.SEU-USER.workers.dev'
const CLOUDFLARE_WORKER_URL = 'https://shy-cell-4a30.pinhoes1000.workers.dev/'; // Deixa vazio para usar Vercel proxy

// Smart fetch: dev = local proxy (via Vite proxy → Express on 3001), prod = CF Worker → Vercel → corsproxy.io
const mangaFetch = async (path, params = {}) => {
    const proxyQs = buildQS({ path, ...params });

    // In dev mode, try local Express proxy first (through Vite's proxy), then fallback to direct
    if (isDev) {
        try {
            const res = await axios.get(`/api/mangadex?${proxyQs}`, { timeout: 8000 });
            return res.data;
        } catch (e) {
            console.warn('[mangas] Local proxy failed, trying direct:', e.message);
            const res = await axios.get(buildDirectUrl(path, params));
            return res.data;
        }
    }

    // Try 1: Cloudflare Worker (IPs nao bloqueados)
    if (CLOUDFLARE_WORKER_URL) {
        try {
            const res = await axios.get(`${CLOUDFLARE_WORKER_URL}?${proxyQs}`, { timeout: 8000 });
            return res.data;
        } catch (e) { console.warn('[mangas] CF Worker failed:', e.message); }
    }
    // Try 2: Vercel serverless proxy
    try {
        const res = await axios.get(`/api/mangadex?${proxyQs}`, { timeout: 8000 });
        return res.data;
    } catch (e) { console.warn('[mangas] Vercel proxy failed:', e.message); }

    // Try 3: corsproxy.io (publico, ultimo recurso)
    const directUrl = buildDirectUrl(path, params);
    const res = await axios.get(`https://corsproxy.io/?${encodeURIComponent(directUrl)}`, { timeout: 12000 });
    return res.data;
};


// Helper to extract the title from the manga object
const getTitle = (manga) => {
    return manga.attributes.title.en || Object.values(manga.attributes.title)[0] || "Unknown Title";
};

// Helper to find the cover filename from relationships
// Images are proxied through /api/proxy-image to avoid MangaDex hotlink blocking
const getCoverUrl = (manga) => {
    const coverRel = manga.relationships.find(rel => rel.type === 'cover_art');
    if (coverRel && coverRel.attributes) {
        const directUrl = `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}`;
        return `/api/proxy-image?url=${encodeURIComponent(directUrl)}`;
    }
    return "/static/media/Logo.10d9b2ebed4705df7759.png";
};

// Helper to extract the description from the manga object
const getDescription = (manga) => {
    if (!manga.attributes.description) return "";
    return manga.attributes.description['pt-br'] || manga.attributes.description.en || Object.values(manga.attributes.description)[0] || "";
};

// Helper to map MangaDex manga to the format expected by the frontend
const mapManga = (manga) => {
    const title = getTitle(manga);
    const coverUrl = getCoverUrl(manga);
    const description = getDescription(manga);
    return {
        id: manga.id,
        title: title,
        image: coverUrl,
        description: description,
        author: "MangaDex",
        score: (Math.random() * (10 - 7) + 7).toFixed(1),
        chapters_count: manga.attributes.lastChapter || "?",
        categories: manga.attributes.tags.map(t => t.attributes.name.en).slice(0, 3)
    };
};

class Mangas {

    constructor() { }

    static async getMangaById(id) {
        try {
            const data = await mangaFetch(`manga/${id}`, { 'includes[]': 'cover_art' });
            return mapManga(data.data);
        } catch (err) {
            console.log(err);
        }
    }

    static async getChapters(id, offset = 0) {
        try {
            const data = await mangaFetch(`manga/${id}/feed`, {
                limit: 500, offset,
                'translatedLanguage[]': 'pt-br',
                'order[chapter]': 'desc'
            });
            return data;
        } catch (err) {
            console.log(err);
        }
    }

    static async search(manga_name) {
        try {
            const data = await mangaFetch('manga', {
                title: manga_name,
                'includes[]': 'cover_art',
                limit: 20,
                'availableTranslatedLanguage[]': 'pt-br'
            });
            return data.data.map(mapManga);
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    static async getRecents() {
        try {
            const data = await mangaFetch('manga', {
                limit: 20,
                'order[createdAt]': 'desc',
                'includes[]': 'cover_art',
                'availableTranslatedLanguage[]': 'pt-br'
            });
            return data.data.map(mapManga);
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    static async getMostRead() {
        try {
            const data = await mangaFetch('manga', {
                limit: 20,
                'order[followedCount]': 'desc',
                'includes[]': 'cover_art',
                'availableTranslatedLanguage[]': 'pt-br'
            });
            return data.data.map(mapManga);
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    static async getFavorites() {
        try {
            const resFav = await User.getFavorites();
            if (resFav && resFav.data && resFav.data.data) {
                const mangas = resFav.data.data;
                const result = [];
                for (let manga of mangas) {
                    const mapped = await this.getMangaById(manga.id);
                    result.push(mapped);
                }
                return result;
            }
            return [];
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    // Get the image server + chapter hash + file list for reading a chapter
    static async getChapterServer(chapterId) {
        try {
            const data = await mangaFetch(`at-home/server/${chapterId}`);
            return data;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    // Get chapter metadata (title, chapter number, etc.)
    static async getChapterInfo(chapterId) {
        try {
            const data = await mangaFetch(`chapter/${chapterId}`);
            return data;
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}

export default Mangas;