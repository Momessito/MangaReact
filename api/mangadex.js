// Vercel Serverless Function - proxies all MangaDex API requests
// Makes requests appear to come from mangadex.org to avoid blocks

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
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { path, ...queryParams } = req.query;
    if (!path) return res.status(400).json({ error: 'Missing path' });

    const queryString = buildQueryString(queryParams);
    const targetUrl = `https://api.mangadex.org/${path}${queryString ? '?' + queryString : ''}`;

    console.log('[proxy] →', targetUrl);

    // Headers that make the request look like it's coming from an App
    const requestHeaders = {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'User-Agent': 'YushaApp/1.0 (contact@yusha.app)',
    };

    try {
        const response = await fetch(targetUrl, { headers: requestHeaders });

        if (!response.ok) {
            console.error('[proxy] MangaDex returned', response.status);
            return res.status(response.status).json({ error: `MangaDex returned ${response.status}` });
        }

        const data = await response.json();
        // Cache for 5 minutes on Vercel edge
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
        return res.status(200).json(data);
    } catch (error) {
        console.error('[proxy] Error:', error.message);
        return res.status(500).json({ error: 'Proxy failed', details: error.message });
    }
}
