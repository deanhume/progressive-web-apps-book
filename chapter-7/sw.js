const cacheName = 'latestNews-v1';
const offlineUrl = 'offline-page.html';

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
      './article.html',
      './index.html',
      offlineUrl
    ]))
  );
});

// Cache any new resources as they are fetched
self.addEventListener('fetch', function(event) {

    event.respondWith(
      caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            if(!response || response.status !== 200) {
              return response;
            }

            var responseToCache = response.clone();
            caches.open(cacheName)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });

            return response;
          }
        ).catch(error => {
          // Check if the user is offline first and is trying to navigate to a web page
          if (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html')) {
          // Return the offline page
          return caches.match(offlineUrl);
        }
        });
      })
    );

});
