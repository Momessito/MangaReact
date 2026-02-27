// Vercel Serverless Function - proxies all MangaDex API requests
// Deployed at /api/mangadex

// Build query string preserving literal [] brackets (MangaDex requires them unencoded)
function buildQueryString(params) {
    return Object.entries(params)
        .flatMap(([key, value]) => {
            if (Array.isArray(value)) {
                return value.map(v => `${key}=${encodeURIComponent(v)}`);
            }
            return [`${key}=${encodeURIComponent(value)}`];
        })
        .join('&');
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { path, ...queryParams } = req.query;

    if (!path) {
        return res.status(400).json({ error: 'Missing path parameter' });
    }

    // Build query string keeping [] brackets literal (not percent-encoded)
    const queryString = buildQueryString(queryParams);
    const targetUrl = `https://api.mangadex.org/${path}${queryString ? '?' + queryString : ''}`;

    console.log('[proxy] →', targetUrl);

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'Accept': 'application/json',
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
