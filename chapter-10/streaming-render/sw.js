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
      './article-header.html',
      './article-footer.html',
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

    promises = promises.map(p => Promise.resolve(p));

    promises.forEach(p => p.then(resolve));

    promises.reduce((a, b) => a.catch(() => b))
    .catch(() => reject(Error("All failed")));
  });
};

function streamArticle(url) {
  try {
    new ReadableStream({});
  }
  catch (e) {
    return new Response("Streams not supported");
  }
  const stream = new ReadableStream({
    start(controller) {
      // const contentURL = new URL(url);
      // contentURL.pathname += '.middle.inc';
      const startFetch = caches.match('./article-header.html');
      const bodyData = fetch(`./data/${url}.html`).catch(() => new Response('Body fetch failed'));
      const endFetch = caches.match('./article-footer.html');

      function pushStream(stream) {
        const reader = stream.getReader();
        function read() {
          return reader.read().then(result => {
            if (result.done) return;
            controller.enqueue(result.value);
            return read();
          });
        }
        return read();
      }

      startFetch
      .then(response => pushStream(response.body))
      .then(() => bodyData)
      .then(response => pushStream(response.body))
      .then(() => endFetch)
      .then(response => pushStream(response.body))
      .then(() => controller.close());
    }
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/html' }
  })
}

// Get a value from the querystring
function findGetParameter(parameterName) {
  var result = null,
  tmp = [];
  var items = location.search.substr(1).split("&");
  for (var index = 0; index < items.length; index++) {
    tmp = items[index].split("=");
    if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
  }
  return result;
}


self.addEventListener('fetch', function (event) {

  // Check for the json file
  if (/article.html/.test(event.request.url)) {

    event.respondWith(streamArticle('data-1'));

  } else if (/googleapis/.test(event.request.url)) {

    // Check for the googleapis domain
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

  }
});
