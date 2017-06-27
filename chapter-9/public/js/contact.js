var offlineNotification = document.getElementById('offline');

// Show an offline notification if the user if offline
function showIndicator() {
  offlineNotification.innerHTML = 'You are currently offline.';
  offlineNotification.className = 'showOfflineNotification';
}

// Hide the offline notification when the user comes back online
function hideIndicator() {
  offlineNotification.className = 'hideOfflineNotification';
}

// Notify the user that the message is either queued or sent
function displayMessageNotification(notificationText){
  var messageNotification = document.getElementById('message');
  messageNotification.innerHTML = notificationText;
  messageNotification.className = 'showMessageNotification';
}

// Send the actual message
function sendMessage(){
  console.log('sendMessage');

  var payload = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value,
  };

  // Send the POST request to the server
  return fetch('/sendMessage/', {
    method: 'post',
    headers: new Headers({
      'content-type': 'application/json'
    }),
    body: JSON.stringify(payload)
  });
}

// Queue the message till the sync takes place
function queueMessage(){
  console.log('Message queued');

  var payload = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value,
  };

  // Save to indexdb
  idbKeyval.set('sendMessage', payload);
}

// Update the online status icon based on connectivity
window.addEventListener('online',  hideIndicator);
window.addEventListener('offline', showIndicator);
