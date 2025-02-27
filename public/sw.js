self.addEventListener('push', (event) => {
    const payload = event.data ? event.data.text() : 'No payload';
    const title = 'New Notification';
  
    const options = {
      body: payload,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
    };
  
    event.waitUntil(self.registration.showNotification(title, options));
  });