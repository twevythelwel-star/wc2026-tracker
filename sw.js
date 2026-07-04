const CACHE_NAME = 'wc26-tracker-v4';
const ASSETS_TO_CACHE = [
  'index.html',
  'style.css',
  'app.js',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// Install Event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Pre-caching offline assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // API fetches: Always go network-only (never cache live scores to avoid stale data)
  if (
    url.hostname.includes('espn.com') || 
    url.hostname.includes('vercel.app') || 
    url.hostname.includes('githubusercontent.com') ||
    url.hostname.includes('allorigins.win') ||
    url.hostname.includes('corsproxy.io')
  ) {
    event.respondWith(
      fetch(req).catch(() => {
        return new Response(JSON.stringify({ offline: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Network-First strategy for HTML, CSS, JS to ensure latest updates if online, falling back to cache when offline
  if (
    req.mode === 'navigate' || 
    (req.headers.get('accept') && req.headers.get('accept').includes('text/html')) ||
    url.pathname.endsWith('.js') || 
    url.pathname.endsWith('.css')
  ) {
    event.respondWith(
      fetch(req)
        .then(res => {
          if (res.status === 200) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, resClone));
          }
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Cache-First strategy for other static assets (Google Fonts, images)
  event.respondWith(
    caches.match(req).then(cachedRes => {
      if (cachedRes) return cachedRes;
      return fetch(req).then(res => {
        if (!res || res.status !== 200 || res.type !== 'basic') return res;
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, resClone));
        return res;
      });
    })
  );
});
