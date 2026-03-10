// api/proxy-image.js
// Vercel Serverless Function to proxy MangaDex images (avoids hotlink blocking)
import axios from 'axios';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();

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
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
        return res.send(Buffer.from(response.data));
    } catch (error) {
        console.error('[Image Proxy] Error:', error.message);
        return res.status(500).json({ error: 'Image proxy failed' });
    }
}
