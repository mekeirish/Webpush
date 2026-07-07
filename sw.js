// Service Worker LB Push Tester

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

// Écouteur pour les notifications push (ntfy)
self.addEventListener('push', (event) => {
  console.log('[SW] Push reçu');
  if (!event.data) {
    console.warn('[SW] Pas de données');
    return;
  }
  try {
    const payload = event.data.json();
    console.log('[SW] Payload:', payload);
    const options = {
      body: payload.message || 'Signal d\'arrière-plan reçu',
      icon: './icon.png',
      vibrate: [200, 100, 200],
      data: { url: payload.click || self.location.origin }
    };
    event.waitUntil(
      self.registration.showNotification(payload.title || 'Notification Native', options)
    );
  } catch (err) {
    console.error('[SW] Erreur parsing JSON:', err);
    // Fallback si le payload n'est pas du JSON
    event.waitUntil(
      self.registration.showNotification('Alerte Kool', {
        body: event.data.text(),
        vibrate: [100, 50, 100]
      })
    );
  }
});

// Gestion du clic sur une notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || self.location.origin;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Écouteur pour les messages de la page (test local)
self.addEventListener('message', (event) => {
  if (event.data.type === 'TEST') {
    const title = event.data.title || 'Test local';
    const body = event.data.message || 'Notification instantanée';
    self.registration.showNotification(title, {
      body,
      icon: './icon.png',
      vibrate: [100, 50, 100]
    });
  }
});