// server.js - Local Express server for running MangaReact API endpoints
// Run with: node server.js
// This serves both the MangaDex proxy and the Anime scraper API locally on port 3001

import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ==========================================
// MangaDex Proxy (from api/mangadex.js)
// ==========================================
app.get('/api/mangadex', async (req, res) => {
    const { path, ...params } = req.query;
    if (!path) return res.status(400).json({ error: 'Missing path parameter' });

    const qs = Object.entries(params)
        .flatMap(([k, v]) => Array.isArray(v) ? v.map(x => `${k}=${encodeURIComponent(x)}`) : [`${k}=${encodeURIComponent(v)}`])
        .join('&');

    const url = `https://api.mangadex.org/${path}${qs ? '?' + qs : ''}`;

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept': 'application/json',
            },
            timeout: 15000,
        });

        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
        return res.status(200).json(response.data);
    } catch (error) {
        console.error('[MangaDex Proxy] Error:', error.message);
        return res.status(error.response?.status || 500).json({
            error: 'MangaDex proxy failed',
            details: error.message,
        });
    }
});

// ==========================================
// Chapter Download Proxy (for downloading images)
// ==========================================
app.get('/api/proxy-image', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'Missing url parameter' });

    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://mangadex.org/',
            },
            timeout: 30000,
        });

        res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.send(response.data);
    } catch (error) {
        console.error('[Image Proxy] Error:', error.message);
        return res.status(500).json({ error: 'Image proxy failed' });
    }
});

// ==========================================
// Anime API (from api/anime.js)
// ==========================================
const ANIME_FIRE_BASE = 'https://animefire.plus';

async function fetchHomeAnimes() {
    const { data } = await axios.get(`${ANIME_FIRE_BASE}/animes-atualizados`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const $ = cheerio.load(data);
    const results = [];

    $("div.divCardUltimosEps").each((i, el) => {
        const linkTag = $(el).find('a').first();
        const imgTag = $(el).find('img').first();
        const titleTag = $(el).find('h3.animeTitle').first();
        const href = linkTag.attr('href');
        if (href) {
            const match = href.match(/\/animes\/([^/]+)/);
            const slug = match ? match[1] : '';
            results.push({
                url: `${ANIME_FIRE_BASE}${href}`,
                slug,
                image: imgTag.attr('data-src') || imgTag.attr('src'),
                title: titleTag.text().trim(),
            });
        }
    });
    return results;
}

async function searchAnimes(query) {
    const { data } = await axios.get(`${ANIME_FIRE_BASE}/pesquisar/${encodeURIComponent(query)}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const $ = cheerio.load(data);
    const results = [];

    $("div.divCardUltimosEps, div.row.ml-1.mr-1 div.col-6").each((i, el) => {
        const linkTag = $(el).find('a').first();
        const imgTag = $(el).find('img').first();
        const titleTag = $(el).find('h3.animeTitle').first();
        const href = linkTag.attr('href');
        if (href) {
            const match = href.match(/\/animes\/([^/]+)/);
            const slug = match ? match[1] : '';
            results.push({
                url: `${ANIME_FIRE_BASE}${href}`,
                slug,
                image: imgTag.attr('data-src') || imgTag.attr('src'),
                title: titleTag.text().trim(),
            });
        }
    });
    return results;
}

async function fetchAnimeDetails(slug) {
    const url = `${ANIME_FIRE_BASE}/animes/${slug}-todos-os-episodios`;
    const { data } = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const $ = cheerio.load(data);

    const title = $("h1.quicksand400").first().text().trim() || $("h6.text-gray").first().text().trim();
    const img = $("div.sub_animepage_img img").first().attr('data-src');
    const synopsis = $("div.divSinopse span.spanAnimeInfo").first().text().trim();

    let infoTexts = [];
    $("div.animeInfo a").each((i, el) => {
        infoTexts.push($(el).text().trim());
    });

    const score = $("h4#anime_score").first().text().trim();
    const episodes = [];
    $("div.div_video_list a").each((i, el) => {
        const epHref = $(el).attr('href');
        const epText = $(el).text().trim();
        if (epHref) {
            episodes.push({ url: epHref, label: epText });
        }
    });

    return {
        title, image: img, synopsis,
        info: infoTexts.join(", "), score, slug,
        episodes: episodes.reverse()
    };
}

async function fetchEpisodeVideo(episodeUrl) {
    const match = episodeUrl.match(/\/animes\/([^/]+)\/(\d+)/);
    if (!match) throw new Error("Invalid episode URL format");
    const slug = match[1];
    const epNum = match[2];

    const videoApiUrl = `${ANIME_FIRE_BASE}/video/${slug}/${epNum}`;
    const { data } = await axios.get(videoApiUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });

    const videos = [];
    if (data && data.data) {
        data.data.forEach(item => {
            let src = item.src.replace(/\\\//g, '/').replace(/\\/g, '/');
            videos.push({ url: src, quality: item.label });
        });
    }
    return videos;
}

app.get('/api/anime', async (req, res) => {
    const { action, query, slug, epUrl } = req.query;

    try {
        if (action === 'latest') {
            const result = await fetchHomeAnimes();
            res.setHeader('Cache-Control', 's-maxage=300');
            return res.json(result);
        }
        else if (action === 'search' && query) {
            return res.json(await searchAnimes(query));
        }
        else if (action === 'details' && slug) {
            res.setHeader('Cache-Control', 's-maxage=300');
            return res.json(await fetchAnimeDetails(slug));
        }
        else if (action === 'video' && epUrl) {
            return res.json(await fetchEpisodeVideo(epUrl));
        }

        return res.status(400).json({ error: 'Invalid action or missing parameters' });
    } catch (error) {
        console.error('[Anime API] Error:', error.message);
        return res.status(500).json({ error: 'Anime scraping failed', details: error.message });
    }
});

// ==========================================
// Start Server
// ==========================================
app.listen(PORT, () => {
    console.log(`\n🚀 MangaReact Local API Server running!`);
    console.log(`   MangaDex Proxy: http://localhost:${PORT}/api/mangadex`);
    console.log(`   Anime API:      http://localhost:${PORT}/api/anime`);
    console.log(`   Image Proxy:    http://localhost:${PORT}/api/proxy-image`);
    console.log(`\n   Frontend (Vite): http://localhost:3000`);
    console.log(`   Make sure to run 'npm run dev' in another terminal!\n`);
});
