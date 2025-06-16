const CACHE_NAME = 'chat-pwa-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // Adicione mais arquivos se usar CSS, JS externos
];

// Instalando service worker e cacheando arquivos
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Arquivos em cache');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativando service worker e limpando caches antigos
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if(key !== CACHE_NAME) {
            console.log('[ServiceWorker] Cache removido:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptando requisições para entregar do cache ou da rede
self.addEventListener('fetch', (evt) => {
  if(evt.request.mode !== 'navigate') {
    evt.respondWith(
      caches.match(evt.request).then((response) => {
        return response || fetch(evt.request);
      })
    );
  } else {
    evt.respondWith(
      fetch(evt.request).catch(() => caches.match('/'))
    );
  }
});
