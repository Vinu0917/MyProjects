// notifications.js - Handles push notifications

// Request notification permission
async function requestNotificationPermission() {
  try {
    if (!messaging) {
      showAlert("Push notifications are not supported in this browser", "error");
      return false;
    }
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Get FCM token
      const token = await messaging.getToken({
        vapidKey: null // Notifications disabled for now - get VAPID key from Firebase Console
      });
      
      // Save token to user's profile
      await saveTokenToDatabase(token);
      return true;
    } else {
      showAlert("Notification permission denied", "error");
      return false;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    showAlert("Error setting up notifications", "error");
    return false;
  }
}

// Save FCM token to database
async function saveTokenToDatabase(token) {
  const user = auth.currentUser;
  if (!user) return;
  
  try {
    // Save token to user's profile
    await db.collection('users').doc(user.uid).update({
      fcmTokens: firebase.firestore.FieldValue.arrayUnion(token)
    });
    
    // Save token to current device
    const deviceId = localStorage.getItem('deviceId');
    if (deviceId) {
      await db.collection('users').doc(user.uid)
        .collection('devices').doc(deviceId)
        .update({ fcmToken: token });
    }
    
    // Store token locally
    localStorage.setItem('fcmToken', token);
  } catch (error) {
    console.error("Error saving token:", error);
  }
}

// Set up notification listeners
function setupNotificationListeners() {
  if (!messaging) return;
  
  // Handle background messages via service worker
  messaging.onBackgroundMessage(payload => {
    console.log('Background message received:', payload);
    
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/icons/icon-192.png'
    };
    
    self.registration.showNotification(notificationTitle, notificationOptions);
  });
  
  // Handle foreground messages
  messaging.onMessage(payload => {
    console.log('Foreground message received:', payload);
    
    // Display custom notification
    const title = payload.notification.title;
    const options = {
      body: payload.notification.body,
      icon: '/icons/icon-192.png'
    };
    
    new Notification(title, options);
  });
}

// Schedule a study reminder
async function scheduleReminder(subject, date, time) {
  const user = auth.currentUser;
  if (!user) return false;
  
  try {
    // Create reminder document
    const reminder = {
      userId: user.uid,
      subject,
      scheduledFor: new Date(`${date}T${time}`),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      status: 'scheduled'
    };
    
    // Add to reminders collection
    await db.collection('reminders').add(reminder);
    return true;
  } catch (error) {
    console.error("Error scheduling reminder:", error);
    return false;
  }
}

// Initialize notifications
function initNotifications() {
  // Check if notifications are supported
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return;
  }
  
  // Set up notification button
  const notificationBtn = document.getElementById('enable-notifications');
  if (notificationBtn) {
    notificationBtn.addEventListener('click', async () => {
      const success = await requestNotificationPermission();
      if (success) {
        showAlert("Notifications enabled!", "success");
        notificationBtn.textContent = "Notifications Enabled";
        notificationBtn.disabled = true;
      }
    });
  }
  
  // Set up listeners if permission already granted
  if (Notification.permission === 'granted' && messaging) {
    setupNotificationListeners();
    
    // Get token if not stored locally
    if (!localStorage.getItem('fcmToken')) {
      messaging.getToken({
        vapidKey: 'YOUR_VAPID_KEY' // Replace with your VAPID key
      }).then(token => {
        saveTokenToDatabase(token);
      }).catch(err => {
        console.error('Error getting token:', err);
      });
    }
  }
}