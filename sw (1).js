// sw.js - Service Worker da Barbearia Estilo Premium
const CACHE = 'barbearia-v1';
const ARQUIVOS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instala: salva os arquivos do site no cache
self.addEventListener('install', evento => {
  evento.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ARQUIVOS))
  );
  self.skipWaiting();
});

// Ativa: limpa caches antigos
self.addEventListener('activate', evento => {
  evento.waitUntil(
    caches.keys().then(chaves =>
      Promise.all(chaves.filter(chave => chave !== CACHE).map(chave => caches.delete(chave)))
    )
  );
  self.clients.claim();
});

// Intercepta as requisições: responde do cache primeiro (funciona offline!)
self.addEventListener('fetch', evento => {
  evento.respondWith(
    caches.match(evento.request).then(resposta => {
      return resposta || fetch(evento.request).catch(() => caches.match('./index.html'));
    })
  );
});
