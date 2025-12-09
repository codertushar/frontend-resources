// Service Worker for Frontend Resources PWA
// Cache core assets during install
const CACHE_NAME = 'frontend-resources-v2';
const CORE_ASSETS = [
    '/',
    '/favicon.svg',
    '/manifest.json',
    '/index.html',
    '/src/assets/hero.css'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
    );
});

// Activate and clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
});

// Fetch handler – cache‑first for core assets, network‑first for HTML pages
self.addEventListener('fetch', (event) => {
    const request = event.request;

    // Ignore non‑GET requests
    if (request.method !== 'GET') return;

    // For navigation requests (HTML pages)
    if (request.mode === 'navigate' || request.destination === 'document') {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    // Clone and store in cache
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
                    return networkResponse;
                })
                .catch(() => caches.match(request).then((cached) => cached || caches.match('/index.html')))
        );
        return;
    }

    // For other assets – cache‑first strategy
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            return cachedResponse || fetch(request).then((networkResponse) => {
                // Optionally cache the new asset
                caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse.clone()));
                return networkResponse;
            });
        })
    );
});
