const CACHE_NAME = 'maues-turismo-v2';
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
  // Ignora requisições externas e rotas de proxy do Gateway
  if (!e.request.url.startsWith(self.location.origin)) return;
  
  // Ignora requisições que não sejam GET (ex: POST do Socket.io)
  if (e.request.method !== 'GET') return;

  // Só faz cache de arquivos estáticos conhecidos
  const url = new URL(e.request.url);
  const isValidExtension = /\.(html|css|js|json|png|jpg|jpeg|svg|webp|ico)$/.test(url.pathname);
  
  if (!isValidExtension) return;

  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Só faz cache se a resposta for válida (status 200)
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});