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
      './article.html',
      './index.html'
    ]))
  );
});

self.addEventListener('push', function(event) {  
	debugger;
  console.log('Received a push message', event);

  var title = 'Notification';  
  var body = 'There is newly updated content available on the site. Click to see more.';  
  var icon = 'https://raw.githubusercontent.com/deanhume/typography/gh-pages/icons/typography.png';  
  var tag = 'simple-push-demo-notification-tag';
  
  event.waitUntil(  
    self.registration.showNotification(title, {  
       body: body,  
       icon: icon,  
       tag: tag  
     })  
   );  
});

self.addEventListener('notificationclick', function(event) {  
  console.log('On notification click: ', event.notification.tag);  
  // Android doesn't close the notification when you click on it  
  // See: http://crbug.com/463146  
  event.notification.close();

  // This looks to see if the current is already open and  
  // focuses if it is  
  event.waitUntil(
    clients.matchAll({  
      type: "window"  
    })
    .then(function(clientList) {  
      for (var i = 0; i < clientList.length; i++) {  
        var client = clientList[i];  
        if (client.url == '/' && 'focus' in client)  
          return client.focus();  
      }  
      if (clients.openWindow) {
        return clients.openWindow('https://deanhume.github.io/typography');  
      }
    })
  );
});

// Cache any new resources as they are fetched
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true })
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
      );
    })
  );
});
