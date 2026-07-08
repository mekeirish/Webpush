// Service Worker POUR LE TEST LOCAL UNIQUEMENT
// OneSignal utilise son propre Service Worker (OneSignalSDKWorker.js)
// Celui-ci ne sert qu’à recevoir les messages de la page (test local)

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

// Écouteur pour les messages venant de la page (test local)
self.addEventListener('message', (event) => {
  console.log('[SW] Message reçu:', event.data);
  if (event.data && event.data.type === 'TEST') {
    const title = event.data.title || 'Test local';
    const body = event.data.message || 'Notification instantanée';
    self.registration.showNotification(title, {
      body: body,
      icon: './icon.png',
      vibrate: [100, 50, 100],
    });
  }
});

// ⚠️ IMPORTANT : On ne met PAS d'écouteur 'push' ici.
// C'est OneSignalSDKWorker.js qui gère les push OneSignal.