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

// Smart fetch: dev = direct, prod = Vercel proxy → corsproxy.io fallback
const mangaFetch = async (path, params = {}) => {
    if (isDev) {
        const res = await axios.get(buildDirectUrl(path, params));
        return res.data;
    }
    // Try 1: Our Vercel serverless proxy
    try {
        const proxyQs = buildQS({ path, ...params });
        const res = await axios.get(`/api/mangadex?${proxyQs}`, { timeout: 8000 });
        return res.data;
    } catch (e1) {
        console.warn('[mangas] Vercel proxy failed, fallback to corsproxy.io:', e1.message);
    }
    // Try 2: Public corsproxy.io
    const directUrl = buildDirectUrl(path, params);
    const res = await axios.get(`https://corsproxy.io/?${encodeURIComponent(directUrl)}`, { timeout: 10000 });
    return res.data;
};


// Helper to extract the title from the manga object
const getTitle = (manga) => {
    return manga.attributes.title.en || Object.values(manga.attributes.title)[0] || "Unknown Title";
};

// Helper to find the cover filename from relationships
const getCoverUrl = (manga) => {
    const coverRel = manga.relationships.find(rel => rel.type === 'cover_art');
    if (coverRel && coverRel.attributes) {
        return `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes.fileName}`;
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
                limit: 100, offset,
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
}

export default Mangas;