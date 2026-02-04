/**
 * Service Worker Neutro
 * Este SW não cacheia nada e serve apenas para substituir SWs antigos
 * Versão: 2026.02.03
 */

const VERSION = '2026.02.03';
const CACHE_NAME = 'no-cache-' + VERSION;

// Instalação: força ativação imediata
self.addEventListener('install', function(event) {
  console.log('[SW] Instalando versão:', VERSION);
  self.skipWaiting();
});

// Ativação: limpa TODOS os caches antigos
self.addEventListener('activate', function(event) {
  console.log('[SW] Ativando e limpando caches antigos...');
  
  event.waitUntil(
    caches.keys()
      .then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            console.log('[SW] Deletando cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
      .then(function() {
        console.log('[SW] Assumindo controle de todas as páginas');
        return self.clients.claim();
      })
  );
});

// Fetch: NUNCA cacheia, sempre vai para a rede
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request, {
      cache: 'no-store'
    }).catch(function(error) {
      console.error('[SW] Fetch falhou:', error);
      return new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable'
      });
    })
  );
});