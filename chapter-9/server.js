const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Express setup
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


// Home page
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// Article page
app.get('/article', function (req, res) {
  res.sendFile(path.join(__dirname + '/article.html'));
});

// Article page
app.get('/contact', function (req, res) {
  res.sendFile(path.join(__dirname + '/contact.html'));
});

// Offline page
app.get('/offline', function (req, res) {
  res.sendFile(path.join(__dirname + '/offline-page.html'));
});

// Send a message
app.post('/sendMessage', function (req, res) {
  res.json(`Message sent to ${req.body.email}`);
});

// The server
app.listen(3111, function () {
  console.log('Example app listening on port 3111!')
});
