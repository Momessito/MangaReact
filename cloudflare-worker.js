// Cloudflare Worker - MangaDex Proxy com Autenticação Oficial
// 
// CONFIGURAÇÃO (Cloudflare Dashboard → Worker → Settings → Variables → Add Secret):
//   MANGADEX_USERNAME    = o teu username do MangaDex
//   MANGADEX_PASSWORD    = a tua password do MangaDex
//   MANGADEX_CLIENT_ID   = personal-client-xxxxx (vai ao MangaDex Settings → API Clients)
//   MANGADEX_CLIENT_SECRET = o secret do cliente (botão "Get Secret")

const AUTH_URL = 'https://auth.mangadex.org/realms/mangadex/protocol/openid-connect/token';
const API_URL = 'https://api.mangadex.org';

// Cache tokens em memória (persiste entre requests enquanto o worker está "quente")
let cachedAccessToken = null;
let cachedRefreshToken = null;
let tokenExpiresAt = 0;

// ─── Obter token de acesso (com refresh automático) ───────────────────────────
async function getAccessToken(env) {
    const now = Date.now();

    // Token ainda é válido (margem de 60s)
    if (cachedAccessToken && now < tokenExpiresAt - 60_000) {
        return cachedAccessToken;
    }

    // Tentar refresh se temos refresh_token
    if (cachedRefreshToken) {
        try {
            const body = new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: cachedRefreshToken,
                client_id: env.MANGADEX_CLIENT_ID,
                client_secret: env.MANGADEX_CLIENT_SECRET,
            });
            const res = await fetch(AUTH_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body,
            });
            if (res.ok) {
                const data = await res.json();
                cachedAccessToken = data.access_token;
                // refresh_token pode vir renovado ou pode não vir — mantemos o anterior se necessário
                if (data.refresh_token) cachedRefreshToken = data.refresh_token;
                tokenExpiresAt = now + 14 * 60 * 1000; // 14 minutos (token dura 15)
                return cachedAccessToken;
            }
        } catch (_) { /* cai no login completo abaixo */ }
    }

    // Login completo com username/password
    const body = new URLSearchParams({
        grant_type: 'password',
        username: env.MANGADEX_USERNAME,
        password: env.MANGADEX_PASSWORD,
        client_id: env.MANGADEX_CLIENT_ID,
        client_secret: env.MANGADEX_CLIENT_SECRET,
    });

    const res = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`MangaDex auth failed: ${res.status} ${err}`);
    }

    const data = await res.json();
    cachedAccessToken = data.access_token;
    cachedRefreshToken = data.refresh_token;
    tokenExpiresAt = now + 14 * 60 * 1000;
    return cachedAccessToken;
}

// ─── Build query string (mantém [] literais) ──────────────────────────────────
function buildQueryString(params) {
    return Object.entries(params)
        .flatMap(([key, value]) =>
            Array.isArray(value)
                ? value.map(v => `${key}=${encodeURIComponent(v)}`)
                : [`${key}=${encodeURIComponent(value)}`]
        )
        .join('&');
}

// ─── Handler principal ────────────────────────────────────────────────────────
export default {
    async fetch(request, env) {
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        const url = new URL(request.url);
        const path = url.searchParams.get('path');

        if (!path) {
            return new Response(JSON.stringify({ error: 'Missing ?path=' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

        url.searchParams.delete('path');
        const qs = url.searchParams.toString();
        const targetUrl = `${API_URL}/${path}${qs ? '?' + qs : ''}`;

        try {
            const token = await getAccessToken(env);

            const apiRes = await fetch(targetUrl, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                // Cloudflare edge cache por 5 minutos
                cf: { cacheTtl: 300, cacheEverything: true },
            });

            const data = await apiRes.text();
            return new Response(data, {
                status: apiRes.status,
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=300',
                },
            });
        } catch (err) {
            console.error('Worker error:', err.message);
            return new Response(JSON.stringify({ error: err.message }), {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }
    },
};
