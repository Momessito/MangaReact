// Vercel Serverless Function - proxies all MangaDex API requests
// Deployed at /api/mangadex

export default async function handler(req, res) {
    // Allow CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // The path after /api/mangadex is passed as query param ?path=...
    const { path, ...queryParams } = req.query;

    if (!path) {
        return res.status(400).json({ error: 'Missing path parameter' });
    }

    // Build the MangaDex URL
    const mangaDexBase = 'https://api.mangadex.org';
    const queryString = new URLSearchParams(queryParams).toString();
    const targetUrl = `${mangaDexBase}/${path}${queryString ? '?' + queryString : ''}`;

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'MangaReact/1.0'
            }
        });

        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return res.status(500).json({ error: 'Proxy request failed', details: error.message });
    }
}
