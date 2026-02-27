import axios from 'axios';
import User from './users';

// In production (Vercel), use our serverless proxy to bypass CORS.
// In development (localhost), hit MangaDex directly.
const isDev = import.meta.env.DEV;
const baseUrl = isDev
    ? "https://api.mangadex.org"
    : ""; // Empty base - proxy URL is built dynamically

// Build a request URL: in production routes via /api/mangadex?path=...
const buildUrl = (path, params = {}) => {
    if (isDev) {
        const qs = new URLSearchParams(params).toString();
        return `${baseUrl}/${path}${qs ? '?' + qs : ''}`;
    } else {
        // Proxy format: /api/mangadex?path=manga/xxx&limit=20&...
        const qs = new URLSearchParams({ path, ...params }).toString();
        return `/api/mangadex?${qs}`;
    }
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
            const url = buildUrl(`manga/${id}`, {
                'includes[]': 'cover_art',
            });
            const response = await axios.get(url);
            return mapManga(response.data.data);
        } catch (Error) {
            console.log(Error);
        }
    }

    static async getChapters(id, offset = 0) {
        try {
            // Chapter feed is called directly — no proxy needed, no CORS issues on this endpoint
            const url = `https://api.mangadex.org/manga/${id}/feed?limit=100&offset=${offset}&translatedLanguage[]=pt-br&translatedLanguage[]=en&order[chapter]=desc`;
            const response = await axios.get(url, { headers: User.getHeaders() });
            return response.data;
        } catch (err) {
            console.log(err);
        }
    }

    static async search(manga_name) {
        try {
            const url = buildUrl('manga', {
                title: manga_name,
                'includes[]': 'cover_art',
                limit: 20,
                'availableTranslatedLanguage[]': 'pt-br'
            });
            const response = await axios.get(url);
            return response.data.data.map(mapManga);
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    static async getRecents() {
        try {
            const url = buildUrl('manga', {
                limit: 20,
                'order[createdAt]': 'desc',
                'includes[]': 'cover_art',
                'availableTranslatedLanguage[]': 'pt-br'
            });
            const response = await axios.get(url);
            return response.data.data.map(mapManga);
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    static async getMostRead() {
        try {
            const url = buildUrl('manga', {
                limit: 20,
                'order[followedCount]': 'desc',
                'includes[]': 'cover_art',
                'availableTranslatedLanguage[]': 'pt-br'
            });
            const response = await axios.get(url);
            return response.data.data.map(mapManga);
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