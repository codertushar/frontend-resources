// Service Worker for CrackFrontend PWA
// Cache version is auto-updated during build via generate-sw-version.js
const CACHE_NAME = 'frontend-resources-v1766914989226';
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

// Check for new content and show notification
let lastContentCheck = 0;
const CONTENT_CHECK_THROTTLE = 5 * 60 * 1000; // Only check every 5 minutes max

async function checkForNewContent() {
    // Throttle content checks to avoid excessive API calls
    const now = Date.now();
    if (now - lastContentCheck < CONTENT_CHECK_THROTTLE) {
        console.log('[SW] Content check throttled, last check was recent');
        return;
    }
    lastContentCheck = now;

    try {
        console.log('[SW] Checking for new content...');

        // Try BASE_PATH first (production), fall back to root (development)
        let response = await fetch(`${BASE_PATH}/content.json`);

        // If not ok or not JSON, try root path for development
        if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
            response = await fetch('/content.json');
        }

        if (!response.ok) {
            console.warn('[SW] Failed to fetch content.json:', response.status, response.statusText);
            return;
        }

        // Verify response is actually JSON before parsing
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.warn('[SW] content.json returned non-JSON response:', contentType);
            return;
        }

        const content = await response.json();
        const currentCount = content.length;
        console.log('[SW] Current article count:', currentCount);
        
        // Get stored count from IndexedDB or default to current
        const storedData = await getStoredContentData();
        const storedCount = storedData?.count || 0;
        console.log('[SW] Stored article count:', storedCount);
        
        // Store current count
        await storeContentData({ count: currentCount, lastChecked: Date.now() });
        
        // If there are new articles and this isn't the first visit
        if (currentCount > storedCount && storedCount > 0) {
            const newArticles = currentCount - storedCount;
            console.log('[SW] New articles detected:', newArticles);
            // Find the newest article by createdAt date (content[0] is alphabetically first, not newest)
            const latestArticle = content.reduce((newest, article) => {
                const newestDate = newest.createdAt ? new Date(newest.createdAt) : new Date(0);
                const articleDate = article.createdAt ? new Date(article.createdAt) : new Date(0);
                return articleDate > newestDate ? article : newest;
            }, content[0]);
            await showNewArticleNotification(newArticles, latestArticle);
        } else if (storedCount === 0) {
            console.log('[SW] First visit, storing baseline count');
        } else {
            console.log('[SW] No new articles');
        }
    } catch (error) {
        console.error('[SW] Error checking for new content:', error);
    }
}

// Show notification for new articles
async function showNewArticleNotification(count, latestArticle) {
    console.log('[SW] Showing notification for', count, 'new article(s)');
    try {
        await self.registration.showNotification('New Articles Published! 🎉', {
            body: count === 1 
                ? `Check out: ${latestArticle?.title || 'New article available'}` 
                : `${count} new articles available to explore!`,
            icon: `${BASE_PATH}/android-launchericon-192-192.png`,
            badge: `${BASE_PATH}/android-launchericon-192-192.png`,
            tag: 'new-articles',
            requireInteraction: false,
            data: {
                url: `${BASE_PATH}/library`,
                timestamp: Date.now()
            }
        });
        console.log('[SW] Notification displayed successfully');
    } catch (error) {
        console.error('[SW] Error showing notification:', error);
    }
}

// IndexedDB helper functions for storing content metadata
async function getStoredContentData() {
    return new Promise((resolve) => {
        const request = indexedDB.open('frontend-resources-db', 1);
        
        request.onerror = (err) => {
            console.error('IndexedDB error:', err);
            resolve(null);
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('metadata')) {
                db.createObjectStore('metadata');
            }
        };
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            try {
                const transaction = db.transaction(['metadata'], 'readonly');
                const store = transaction.objectStore('metadata');
                const getRequest = store.get('contentData');
                
                getRequest.onsuccess = () => resolve(getRequest.result);
                getRequest.onerror = (err) => {
                    console.error('Error reading from IndexedDB:', err);
                    resolve(null);
                };
            } catch (err) {
                console.error('Transaction error:', err);
                resolve(null);
            }
        };
    });
}

async function storeContentData(data) {
    return new Promise((resolve) => {
        const request = indexedDB.open('frontend-resources-db', 1);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('metadata')) {
                db.createObjectStore('metadata');
            }
        };
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            try {
                const transaction = db.transaction(['metadata'], 'readwrite');
                const store = transaction.objectStore('metadata');
                store.put(data, 'contentData');
                transaction.oncomplete = () => resolve();
                transaction.onerror = (err) => {
                    console.error('Error writing to IndexedDB:', err);
                    resolve();
                };
            } catch (err) {
                console.error('Transaction error:', err);
                resolve();
            }
        };
        
        request.onerror = (err) => {
            console.error('IndexedDB error:', err);
            resolve();
        };
    });
}

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    const urlToOpen = event.notification.data?.url || BASE_PATH;
    
    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Check if there's already a window open
                for (const client of clientList) {
                    if (client.url.includes(BASE_PATH) && 'focus' in client) {
                        return client.focus().then(() => client.navigate(urlToOpen));
                    }
                }
                // Open new window if none exists
                if (self.clients.openWindow) {
                    return self.clients.openWindow(urlToOpen);
                }
            })
    );
});

// Periodic background sync to check for new content
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'check-new-content') {
        event.waitUntil(checkForNewContent());
    }
});

// Message handler for manual content check
self.addEventListener('message', (event) => {
    if (event.data?.type === 'CHECK_NEW_CONTENT') {
        event.waitUntil(checkForNewContent());
    }
});

// Fetch handler
self.addEventListener('fetch', (event) => {
    const request = event.request;

    // Ignore non-GET requests
    if (request.method !== 'GET') return;

    // NEVER cache API requests - always fetch from network
    // This prevents stale data issues with auth, user progress, etc.
    const noCachePatterns = [
        'supabase.co',           // Supabase API (auth, database)
        '/api/',                 // Any API routes
        '/rest/',                // REST API endpoints
        '/auth/',                // Auth endpoints
        'googleapis.com',        // Google APIs (auth, etc.)
        'accounts.google.com',   // Google OAuth
        '/graphql',              // GraphQL endpoints
    ];

    if (noCachePatterns.some(pattern => request.url.includes(pattern))) {
        return; // Let the browser handle it normally without SW intervention
    }

    // For navigation requests (HTML pages) - network first with cache fallback
    if (request.mode === 'navigate' || request.destination === 'document') {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
                    // Check for new content on page load
                    checkForNewContent();
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
