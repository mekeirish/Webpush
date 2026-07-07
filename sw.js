// Listener interceptant le signal Push réseau envoyé via ntfy
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const payload = event.data.json();

    const options = {
      body: payload.message || 'Signal d\'arrière-plan reçu',
      icon: './icon.png', 
      badge: './badge.png',
      vibrate: [200, 100, 200],
      data: {
        url: payload.click || self.location.origin
      }
    };

    event.waitUntil(
      self.registration.showNotification(payload.title || 'Notification Native', options)
    );
  } catch (err) {
    // Si ntfy envoie du texte brut au lieu du JSON structuré Web Push
    event.waitUntil(
      self.registration.showNotification('Alerte Kool', {
        body: event.data.text(),
        vibrate: [100, 50, 100]
      })
    );
  }
});

// Gère le clic sur la notification pour focus ou ouvrir la PWA
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const targetUrl = event.notification.data ? event.notification.data.url : self.location.origin;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Si la PWA est déjà ouverte, on se contente de la focus
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // Sinon on ouvre un nouvel onglet/fenêtre PWA
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
