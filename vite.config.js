import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
            workbox: {
                // Cache all JS, CSS, HTML, and images for offline use
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
                            cacheableResponse: { statuses: [0, 200] }
                        }
                    }
                ]
            },
            manifest: {
                name: 'Yusha - MangaReact',
                short_name: 'Yusha',
                description: 'Leitor de Mangás e Animes',
                theme_color: '#1e1e1e',
                background_color: '#1e1e1e',
                display: 'standalone',
                icons: [
                    {
                        src: '/vite.svg', // Falback icon using Vite default if custom isn't found
                        sizes: '192x192',
                        type: 'image/svg+xml'
                    },
                    {
                        src: '/vite.svg',
                        sizes: '512x512',
                        type: 'image/svg+xml'
                    }
                ]
            }
        })
    ],
    server: {
        port: 3000,
        host: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true
            }
        }
    },
    build: {
        outDir: 'dist'
    }
})
