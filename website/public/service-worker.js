// Service Worker for Frontend Resources PWA
// Cache core assets during install
const CACHE_NAME = 'frontend-resources-v3';
const BASE_PATH = '/frontend-resources';
const CORE_ASSETS = [
    `${BASE_PATH}/`,
    `${BASE_PATH}/favicon.svg`,
    `${BASE_PATH}/manifest.json`,
    `${BASE_PATH}/index.html`,
    `${BASE_PATH}/icon-192.png`,
    `${BASE_PATH}/icon-512.png`
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
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(request).then((networkResponse) => {
                // Clone before caching
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
                return networkResponse;
            });
        })
    );
});
