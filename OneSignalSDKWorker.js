importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js');

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TEST') {
    const title = event.data.title || 'Test local';
    const body = event.data.message || 'Notification instantanée';
    self.registration.showNotification(title, {
      body: body,
      icon: './icon.png',
      vibrate: [200, 100, 200],
      badge: './icon.png'
    });
  }
});
