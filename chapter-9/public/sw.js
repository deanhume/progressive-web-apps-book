// Load the sw-toolbox library.
importScripts('./js/idb-keyval.js');

const cacheName = 'latestNews-v1';
const offlineUrl = '/offline';

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
      './',
      offlineUrl
    ]))
  );
});

// Handle network delays
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

    promises = promises.map(p => Promise.resolve(p));

    promises.forEach(p => p.then(resolve));

    promises.reduce((a, b) => a.catch(() => b))
    .catch(() => reject(Error("All failed")));
  });
};


self.addEventListener('fetch', function(event) {

  // Check for the googleapis domain
  if (/googleapis/.test(event.request.url)) {
    event.respondWith(
      resolveFirstPromise([
        timeout(500),
        fetch(event.request)
      ])
    );
  } else {

    // Else process all other requests as expected
    event.respondWith(
      caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        var fetchRequest = event.request.clone();

        fetch(fetchRequest).then(
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
            caches.match(offlineUrl);
          }
        });
      })
    )}
  });

// The sync event for the contact form
self.addEventListener('sync', function (event) {
  if (event.tag === 'contact-email') {
    event.waitUntil(
      idbKeyval.get('sendMessage').then(value =>
        fetch('/sendMessage/', {
          method: 'POST',
          headers: new Headers({ 'content-type': 'application/json' }),
          body: JSON.stringify(value)
        })));

        // Remove the value from the DB
        idbKeyval.delete('sendMessage');
    }
});
