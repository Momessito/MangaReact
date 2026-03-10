// api/anime.js
// Vercel Serverless Function to scrape animefire.plus (Ported from AnFireAPI)
import axios from 'axios';
import * as cheerio from 'cheerio';

const ANIME_FIRE_BASE = 'https://animefire.plus';

// --- Scraper Functions ---

async function fetchHomeAnimes() {
    try {
        const { data } = await axios.get(`${ANIME_FIRE_BASE}/animes-atualizados`);
        const $ = cheerio.load(data);
        const results = [];

        $("div.divCardUltimosEps").each((i, el) => {
            const linkTag = $(el).find('a').first();
            const imgTag = $(el).find('img').first();
            const titleTag = $(el).find('h3.animeTitle').first();

            const href = linkTag.attr('href');
            if (href) {
                // Extract slug: /animes/nome-do-anime-dublado/1
                // Actually animes-atualizados link goes to episode: /animes/dandadan-dublado/9
                // Let's get the anime detail URL. We can infer it by removing the episode number or doing a search string.
                // Usually animes-atualizados points to the episode. But let's return it as an episode link or anime link.
                // It's better to extract just the anime slug if possible: /animes/slug/ep -> slug
                const match = href.match(/\/animes\/([^/]+)/);
                const slug = match ? match[1] : '';

                results.push({
                    url: `${ANIME_FIRE_BASE}${href}`,
                    slug: slug,
                    image: imgTag.attr('data-src') || imgTag.attr('src'),
                    title: titleTag.text().trim(),
                });
            }
        });
        return results;
    } catch (error) {
        console.error('Error fetching latest animes:', error.message);
        throw error;
    }
}

async function searchAnimes(query) {
    try {
        const { data } = await axios.get(`${ANIME_FIRE_BASE}/pesquisar/${encodeURIComponent(query)}`);
        const $ = cheerio.load(data);
        const results = [];

        // Note: The structure in the PHP script says divCardUltimosEps for search as well.
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
                    slug: slug,
                    image: imgTag.attr('data-src') || imgTag.attr('src'),
                    title: titleTag.text().trim(),
                });
            }
        });
        return results;
    } catch (error) {
        console.error('Error searching animes:', error.message);
        throw error;
    }
}

async function fetchAnimeDetails(slug) {
    const url = `${ANIME_FIRE_BASE}/animes/${slug}-todos-os-episodios`;
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const title = $("h1.quicksand400").first().text().trim() || $("h6.text-gray").first().text().trim();
        const img = $("div.sub_animepage_img img").first().attr('data-src');
        const synopsis = $("div.divSinopse span.spanAnimeInfo").first().text().trim();

        let infoTexts = [];
        $("div.animeInfo a").each((i, el) => {
            infoTexts.push($(el).text().trim());
        });

        const score = $("h4#anime_score").first().text().trim();

        // Let's try to get episodes. AnFire API checks sequentially until 500. We can do differently by looking for the episodes list container in the page.
        const episodes = [];
        $("div.div_video_list a").each((i, el) => {
            const epHref = $(el).attr('href');
            const epText = $(el).text().trim(); // "Episódio 1"
            if (epHref) {
                episodes.push({
                    url: epHref,
                    label: epText
                });
            }
        });

        // If the page contains episodes directly (it usually does based on their script `fetchAnimeSlug` finding links)
        return {
            title,
            image: img,
            synopsis,
            info: infoTexts.join(", "),
            score,
            slug,
            episodes: episodes.reverse() // usually listed most recent first, so we reverse it to natural ascending order
        };

    } catch (error) {
        console.error('Error fetching anime details:', error.message);
        throw error;
    }
}

async function fetchEpisodeVideo(episodeUrl) {
    // episodeUrl is like: https://animefire.plus/animes/boku-no-hero-academia-6-temporada-dublado/3
    // We need to fetch it and find the video data URL, which is usually in a <video> tag's data-video-src or fetched via another API like /video/:slug/:ep
    try {
        // As per the NodeJS app: url = `https://animefire.plus/video/${animeSlug}/${episode}`
        const match = episodeUrl.match(/\/animes\/([^/]+)\/(\d+)/);
        if (!match) throw new Error("Invalid episode URL format");
        const slug = match[1];
        const epNum = match[2];

        const videoApiUrl = `${ANIME_FIRE_BASE}/video/${slug}/${epNum}`;
        const { data } = await axios.get(videoApiUrl);
        // Returns JSON: { data: [ { src: '...', label: '720p' }, ... ] }

        const videos = [];
        if (data && data.data) {
            data.data.forEach(item => {
                // Check if it's blogger or something, usually it's direct MP4 link escaping slashes
                let src = item.src.replace(/\\\//g, '/').replace(/\\/g, '/');
                videos.push({
                    url: src,
                    quality: item.label
                });
            });
        }
        return videos;
    } catch (error) {
        console.error('Error fetching episode video:', error.message);
        throw error;
    }
}

// --- Next.js / Vercel Serverless Handler ---

export default async function handler(req, res) {
    // CORS configuration
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { action, query, slug, epUrl } = req.query;

    try {
        if (action === 'latest') {
            const result = await fetchHomeAnimes();
            res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60'); // cache 5 min
            return res.status(200).json(result);
        }
        else if (action === 'search' && query) {
            const result = await searchAnimes(query);
            return res.status(200).json(result);
        }
        else if (action === 'details' && slug) {
            const result = await fetchAnimeDetails(slug);
            res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
            return res.status(200).json(result);
        }
        else if (action === 'video' && epUrl) {
            const result = await fetchEpisodeVideo(epUrl);
            return res.status(200).json(result);
        }

        return res.status(400).json({ error: 'Invalid action or missing parameters' });
    } catch (error) {
        return res.status(500).json({ error: 'Anime scraping failed', details: error.message });
    }
}
