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

function timeout(delay) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(new Response('', {
        status: 408,
        statusText: 'Request timed out.'
      }));
    }, delay);
  });
}

function resolveFirstPromise(promises) {
  return new Promise((resolve, reject) => {
    // make sure promises are all promises
    promises = promises.map(p => Promise.resolve(p));
    // resolve this promise as soon as one resolves
    promises.forEach(p => p.then(resolve));
    // reject if all promises reject
    promises.reduce((a, b) => a.catch(() => b))
      .catch(() => reject(Error("All failed")));
  });
};


// Cache any new resources as they are fetched
self.addEventListener('fetch', function (event) {

  // Parse the URL:
  var requestURL = new URL(event.request.url);

  if (requestURL.hostname == 'api.example.com') {
    // Check if the current request is for an external resources
    event.respondWith(
      resolveFirstPromise([
        timeout(event.request),
        fetch(event.request)
      ])
    );

  } else {
    // Else, continue as normal
    event.respondWith(
      caches.match(event.request)
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
          ).catch(error => {
            // Check if the user is offline first and is trying to navigate to a web page
            if (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html')) {
              // Return the offline page
              return caches.match(offlineUrl);
            }
          });
        })
    );
  }
});
