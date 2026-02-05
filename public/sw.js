/**
 * Service Worker Xperience
 * Estratégia Híbrida: Cache-First para estáticos, Network-Only para o resto
 * Versão: 2026.02.04
 */

const VERSION = '2026.02.04';
const CACHE_NAME = 'xperience-cache-' + VERSION;

// Assets estáticos conhecidos que devem ser cacheados
const STATIC_ASSETS = [
  '/logo.svg',
  '/manifest.webmanifest',
  '/vite.svg',
  '/bunner.jpeg',
  '/business_model_canvas.jpeg',
  '/logo-ia-do-empreendedor.png',
  '/tonconnect-manifest.json'
];

// Instalação: força ativação imediata
self.addEventListener('install', function(event) {
  console.log('[SW] Instalando versão:', VERSION);
  self.skipWaiting();
});

// Ativação: limpa caches antigos (exceto o atual)
self.addEventListener('activate', function(event) {
  console.log('[SW] Ativando e limpando caches antigos...');
  
  event.waitUntil(
    caches.keys()
      .then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deletando cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(function() {
        console.log('[SW] Assumindo controle de todas as páginas');
        return self.clients.claim();
      })
  );
});

// Fetch: Cache-First para estáticos/assets, Network-Only para o resto
self.addEventListener('fetch', function(event) {
  const url = new URL(event.request.url);

  // Verifica se é asset estático conhecido ou build asset (hash)
  const isStaticAsset = STATIC_ASSETS.includes(url.pathname);
  const isBuildAsset = url.pathname.startsWith('/assets/');

  if (isStaticAsset || isBuildAsset) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }

          // Cache miss - fetch network
          return fetch(event.request).then(function(networkResponse) {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response because it's a stream and can only be consumed once
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          });
        })
    );
  } else {
    // Network-only para todo o resto (API, HTML, etc)
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
  }
});
