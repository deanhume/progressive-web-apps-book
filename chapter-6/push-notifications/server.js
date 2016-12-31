const webpush = require('web-push');
const express = require('express')
const app = express();

// VAPID keys should only be generated only once. 
const vapidKeys = webpush.generateVAPIDKeys();

webpush.setVapidDetails(
  'mailto:contact@deanhume.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Send a message
app.get('/sendMessage', function (req, res) {
  // This is the same output of calling JSON.stringify on a PushSubscription 
  // This information comes from the server
  const pushSubscription = {
    endpoint: '.....',
    keys: {
      auth: '.....',
      p256dh: '.....'
    }
  };

  webpush.sendNotification(pushSubscription, 'Your Push Payload Text');
});

// Register the user
app.get('/register', function (req, res) {

});

// The server
app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});



