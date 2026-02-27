// Cloudflare Worker - MangaDex CORS Proxy
// Deploy em: https://workers.cloudflare.com
// Substitui a URL no mangas.js pelo URL do teu worker

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }

    const url = new URL(request.url);
    // Get the MangaDex path from query param ?path=manga/xxx&...
    const path = url.searchParams.get('path');
    if (!path) {
        return new Response(JSON.stringify({ error: 'Missing path' }), { status: 400 });
    }

    // Rebuild query string (remove 'path', keep the rest)
    url.searchParams.delete('path');
    const qs = url.searchParams.toString();
    const targetUrl = `https://api.mangadex.org/${path}${qs ? '?' + qs : ''}`;

    const response = await fetch(targetUrl, {
        headers: {
            'Accept': 'application/json',
            'Origin': 'https://mangadex.org',
            'Referer': 'https://mangadex.org/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        cf: { cacheEverything: true, cacheTtl: 300 } // Cache 5 min na edge
    });

    const data = await response.text();
    return new Response(data, {
        status: response.status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=300',
        }
    });
}
