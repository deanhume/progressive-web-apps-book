const webpush = require('web-push');
const express = require('express');
var bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Set CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// VAPID keys should only be generated only once.
//const vapidKeys = webpush.generateVAPIDKeys();

webpush.setVapidDetails(
  'mailto:contact@deanhume.com',
  'BAyb_WgaR0L0pODaR7wWkxJi__tWbM1MPBymyRDFEGjtDCWeRYS9EF7yGoCHLdHJi6hikYdg4MuYaK0XoD0qnoY',
  'p6YVD7t8HkABoez1CvVJ5bl7BnEdKUu5bSyVjyxMBh0'
);

app.get('/', function (req, res) {
  res.send('success');
});

// Send a message
app.post('/sendMessage', function (req, res) {
  // This is the same output of calling JSON.stringify on a PushSubscription
  // This information comes from the server

});

// Register the user
app.post('/register', function (req, res) {

  var endpoint = req.body.endpoint;

  const pushSubscription = {
    endpoint: req.body.endpoint,
    keys: {
      auth: req.body.authSecret,
      p256dh: req.body.key
    }
  };

  webpush.sendNotification(pushSubscription, 'Thank you for registering')
          .then(result => { 
            console.log(result);
            res.sendStatus(201);
          })
          .catch(err => {
            console.log(err);  
          });

});

// The server
app.listen(3111, function () {
  console.log('Example app listening on port 3111!')
});
