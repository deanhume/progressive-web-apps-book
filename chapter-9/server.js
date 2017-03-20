const webpush = require('web-push');
const express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
const app = express();

// Express setup
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

function saveRegistrationDetails(endpoint, key, authSecret) {
  // Save the users details in a DB
}

webpush.setVapidDetails(
  'mailto:contact@deanhume.com',
  'BAyb_WgaR0L0pODaR7wWkxJi__tWbM1MPBymyRDFEGjtDCWeRYS9EF7yGoCHLdHJi6hikYdg4MuYaK0XoD0qnoY',
  'p6YVD7t8HkABoez1CvVJ5bl7BnEdKUu5bSyVjyxMBh0'
);

// Home page
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// Article page
app.get('/article', function (req, res) {
  res.sendFile(path.join(__dirname + '/article.html'));
});

// Send a message
app.post('/sendMessage', function (req, res) {

  var endpoint = req.body.endpoint;
  var authSecret = req.body.authSecret;
  var key = req.body.key;

  const pushSubscription = {
    endpoint: req.body.endpoint,
    keys: {
      auth: authSecret,
      p256dh: key
    }
  };

  var body = 'Breaking News: Nose picking ban for Manila police';
  var iconUrl = 'https://raw.githubusercontent.com/deanhume/progressive-web-apps-book/master/chapter-6/push-notifications/public/images/homescreen.png';

  webpush.sendNotification(pushSubscription,
    JSON.stringify({
      msg: body,
      url: 'http://localhost:3111/article?id=1',
      icon: iconUrl,
      type: 'actionMessage'
    }))
    .then(result => {
      console.log(result);
      res.sendStatus(201);
    })
    .catch(err => {
      console.log(err);
    });
});

// Register the user
app.post('/register', function (req, res) {

  var endpoint = req.body.endpoint;
  var authSecret = req.body.authSecret;
  var key = req.body.key;

  // Store the users registration details
  saveRegistrationDetails(endpoint, key, authSecret);

  const pushSubscription = {
    endpoint: req.body.endpoint,
    keys: {
      auth: authSecret,
      p256dh: key
    }
  };

  var body = 'Thank you for registering';
  var iconUrl = 'https://raw.githubusercontent.com/deanhume/progressive-web-apps-book/master/chapter-6/push-notifications/public/images/homescreen.png';

  webpush.sendNotification(pushSubscription,
    JSON.stringify({
      msg: body,
      url: 'https://localhost:3111',
      icon: iconUrl,
      type: 'register'
    }))
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
