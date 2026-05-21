const CACHE_NAME = 'uniform-trends-cache-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/images/logo.svg',
  '/manifest.json'
];

// Clean redirect response to avoid browser security issues when redirect mode is not 'follow'
function cleanResponse(response) {
  if (!response || !response.redirected) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}

// Install event - precache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - cache strategies
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // HTML Navigation request - Serve precached index.html (SPA fallback)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(cleanResponse)
        .catch(() => {
          return caches.match('/index.html').then(cleanResponse);
        })
    );
    return;
  }

  // Static Assets (JS, CSS, local images, fonts) - Stale-While-Revalidate
  if (
    event.request.destination === 'script' ||
    event.request.destination === 'style' ||
    event.request.destination === 'image' ||
    event.request.destination === 'font' ||
    url.pathname.startsWith('/src/')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const cleanedResponse = cleanResponse(networkResponse);
            const responseToCache = cleanedResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            return cleanedResponse;
          }
          return networkResponse;
        }).catch((err) => {
          console.log('Network fetch failed for asset, using cache fallback:', err);
        });

        return (cachedResponse ? cleanResponse(cachedResponse) : null) || fetchPromise;
      })
    );
    return;
  }

  // Default network-first falling back to cache
  event.respondWith(
    fetch(event.request)
      .then(cleanResponse)
      .catch(() => {
        return caches.match(event.request).then(cleanResponse);
      })
  );
});
