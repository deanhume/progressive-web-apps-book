var cacheName = 'latestNews-v1';

// Cache our known resources during install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll([
        './js/main.js',
        './js/article.js',
        './images/newspaper.svg',
        './css/site.css',
        './data/latest.json',
        './data/data-1.json',
        './article',
        './'
      ]))
  );
});

self.addEventListener('push', function (event) {

  var payload = event.data ? JSON.parse(event.data.text()) : 'no payload';

  var title = 'Progressive Times';

  // Determine the type of notification to display
  if (payload.type === 'register') {
    event.waitUntil(
      self.registration.showNotification(title, {
        body: payload.msg,
        url: payload.url,
        icon: payload.icon
      })
    );
  } else if (payload.type === 'actionMessage') {
    event.waitUntil(
      self.registration.showNotification(title, {
        body: payload.msg,
        url: payload.url,
        icon: payload.icon,
        actions: [
          { action: 'voteup', title: '👍 Vote Up' },
          { action: 'votedown', title: '👎 Vote Down' }]
      })
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  // Check if any actions were added
  if (event.action === 'voteup') {
    clients.openWindow('http://localhost:3111/voteup');
  }
  else if (event.action === 'voteup') {
    clients.openWindow('http://localhost:3111/votedown');
  }
  else {
    clients.openWindow('http://localhost:3111');
  }
}, false);

// Cache any new resources as they are fetched
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true })
      .then(function (response) {
        if (response) {
          return response;
        }
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function (response) {
            if (!response || response.status !== 200) {
              return response;
            }

            var responseToCache = response.clone();
            caches.open(cacheName)
              .then(function (cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});
