self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('push', (event) => {
  console.log('[SW] Push reçu');
  if (!event.data) return;
  try {
    const payload = event.data.json();
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
    event.waitUntil(
      self.registration.showNotification('Alerte Kool', {
        body: event.data.text(),
        vibrate: [100, 50, 100]
      })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || self.location.origin;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data.type === 'TEST') {
    self.registration.showNotification(event.data.title || 'Test local', {
      body: event.data.message || 'Notification instantanée',
      icon: './icon.png',
      vibrate: [100, 50, 100]
    });
  }
});