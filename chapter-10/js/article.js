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

// Update the online status icon based on connectivity
window.addEventListener('online',  hideIndicator);
window.addEventListener('offline', showIndicator);
