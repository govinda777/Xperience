/**
 * Service Worker Cleanup Script
 * Este script garante que service workers antigos sejam sempre removidos
 * IMPORTANTE: Incluído automaticamente em todos os builds
 */
(function() {
  'use strict';
  
  const CLEANUP_VERSION = '2026.02.05.2104'; // Atualizar a cada mudança significativa
  const CLEANUP_KEY = 'sw_cleanup_version';
  
  // Verifica se já executou esta versão da limpeza
  const lastCleanup = localStorage.getItem(CLEANUP_KEY);
  
  if (lastCleanup === CLEANUP_VERSION) {
    console.debug('✅ Limpeza já executada para esta versão');
    return;
  }
  
  console.debug('🧹 Executando limpeza de Service Workers...');
  
  // Remove todos os service workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
      .then(function(registrations) {
        if (registrations.length > 0) {
          console.debug('🗑️ Removendo ' + registrations.length + ' service worker(s)');
          return Promise.all(
            registrations.map(function(reg) {
              return reg.unregister().then(function() {
                console.debug('✅ SW removido:', reg.scope);
              });
            })
          );
        }
      })
      .then(function() {
        // Remove todos os caches
        if ('caches' in window) {
          return caches.keys().then(function(names) {
            if (names.length > 0) {
              console.debug('🗑️ Limpando ' + names.length + ' cache(s)');
              return Promise.all(
                names.map(function(name) {
                  return caches.delete(name).then(function() {
                    console.debug('✅ Cache removido:', name);
                  });
                })
              );
            }
          });
        }
      })
      .then(function() {
        // Marca como executado
        localStorage.setItem(CLEANUP_KEY, CLEANUP_VERSION);
        console.debug('✨ Limpeza concluída com sucesso!');
      })
      .catch(function(err) {
        console.error('❌ Erro durante limpeza:', err);
      });
  }
})();