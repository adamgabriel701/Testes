const CACHE_NAME = 'maues-turismo-v1';
const ASSETS = [
  'index.html',
  'guarana.html',
  'satere-mawe.html',
  'onde-ficar.html',
  'onde-comer.html',
  'pesca-esportiva.html',
  'noticias-e-eventos.html',
  'contato-e-suporte.html',
  'css/styles.css',
  'js/tailwind.config.js',
  'js/nav-data.js',
  'js/app.js',
  'js/search.js',
  'js/accessibility.js',
  'data/hospedagens.json',
  'data/eventos.json',
  'js/search-data.json',
  'manifest.json'
];

// Install
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(() => {
        // Falha silenciosa para recursos externos (CDN)
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — Network first, fallback to cache
self.addEventListener('fetch', e => {
  // Ignora requisições externas (CDN, picsum, etc.)
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(e.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
