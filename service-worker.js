// Service Worker for Frontend Resources PWA
// Cache version is auto-updated during build via generate-sw-version.js
const CACHE_NAME = 'frontend-resources-v1765429872253';
const BASE_PATH = '/frontend-resources';
const CORE_ASSETS = [
    `${BASE_PATH}/`,
    `${BASE_PATH}/favicon.svg`,
    `${BASE_PATH}/manifest.json`,
    `${BASE_PATH}/android-launchericon-192-192.png`,
    `${BASE_PATH}/android-launchericon-512-512.png`
];

self.addEventListener('install', (event) => {
    // Skip waiting to activate new service worker immediately
    self.skipWaiting();
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
        }).then(() => {
            // Take control of all clients immediately
            return self.clients.claim();
        })
    );
});

// Fetch handler
self.addEventListener('fetch', (event) => {
    const request = event.request;

    // Ignore non-GET requests
    if (request.method !== 'GET') return;

    // For navigation requests (HTML pages) - network first with cache fallback
    if (request.mode === 'navigate' || request.destination === 'document') {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
                    return networkResponse;
                })
                .catch(() => caches.match(request).then((cached) => cached || caches.match(`${BASE_PATH}/`)))
        );
        return;
    }

    // For JS/CSS assets - stale-while-revalidate strategy
    // Serve from cache immediately, update cache in background
    if (request.destination === 'script' || request.destination === 'style') {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                const fetchPromise = fetch(request).then((networkResponse) => {
                    if (networkResponse.ok) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
                    }
                    return networkResponse;
                }).catch(() => cachedResponse);

                return cachedResponse || fetchPromise;
            })
        );
        return;
    }

    // For other assets (images, fonts, etc.) - cache first, network fallback
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(request).then((networkResponse) => {
                if (networkResponse.ok) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
                }
                return networkResponse;
            });
        })
    );
});
