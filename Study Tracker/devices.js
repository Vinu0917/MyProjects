// devices.js - Handles device management functionality

// Register current device
async function registerDevice() {
  const user = auth.currentUser;
  if (!user) return;
  
  try {
    // Get device information
    const deviceInfo = {
      deviceId: generateDeviceId(),
      deviceName: getDeviceName(),
      platform: getPlatform(),
      browser: getBrowser(),
      lastActive: firebase.firestore.FieldValue.serverTimestamp(),
      fcmToken: localStorage.getItem('fcmToken') || null
    };
    
    // Add to user's devices collection
    await db.collection('users').doc(user.uid)
      .collection('devices').doc(deviceInfo.deviceId).set(deviceInfo, { merge: true });
      
    // Store device ID locally
    localStorage.setItem('deviceId', deviceInfo.deviceId);
    
    return deviceInfo;
  } catch (error) {
    console.error("Error registering device:", error);
    return null;
  }
}

// Generate a unique device ID
function generateDeviceId() {
  // Use existing ID if available
  const existingId = localStorage.getItem('deviceId');
  if (existingId) return existingId;
  
  // Generate new ID
  return 'dev_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Get device name (OS + Browser)
function getDeviceName() {
  const platform = getPlatform();
  const browser = getBrowser();
  return `${platform} - ${browser}`;
}

// Get platform/OS name
function getPlatform() {
  const userAgent = navigator.userAgent;
  
  if (/Windows/.test(userAgent)) return 'Windows';
  if (/Macintosh|Mac OS X/.test(userAgent)) return 'macOS';
  if (/Android/.test(userAgent)) return 'Android';
  if (/iPhone|iPad|iPod/.test(userAgent)) return 'iOS';
  if (/Linux/.test(userAgent)) return 'Linux';
  
  return 'Unknown OS';
}

// Get browser name
function getBrowser() {
  const userAgent = navigator.userAgent;
  
  if (/Edge/.test(userAgent)) return 'Microsoft Edge';
  if (/Chrome/.test(userAgent)) return 'Chrome';
  if (/Firefox/.test(userAgent)) return 'Firefox';
  if (/Safari/.test(userAgent)) return 'Safari';
  if (/Opera|OPR/.test(userAgent)) return 'Opera';
  if (/MSIE|Trident/.test(userAgent)) return 'Internet Explorer';
  
  return 'Unknown Browser';
}

// Get all devices for current user
async function getUserDevices() {
  const user = auth.currentUser;
  if (!user) return [];
  
  try {
    const snapshot = await db.collection('users').doc(user.uid)
      .collection('devices').get();
      
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Error getting devices:", error);
    return [];
  }
}

// Remove a device
async function removeDevice(deviceId) {
  const user = auth.currentUser;
  if (!user) return false;
  
  try {
    await db.collection('users').doc(user.uid)
      .collection('devices').doc(deviceId).delete();
    return true;
  } catch (error) {
    console.error("Error removing device:", error);
    return false;
  }
}

// Update device last active timestamp
async function updateDeviceActivity() {
  const deviceId = localStorage.getItem('deviceId');
  const user = auth.currentUser;
  
  if (!deviceId || !user) return;
  
  try {
    await db.collection('users').doc(user.uid)
      .collection('devices').doc(deviceId)
      .update({
        lastActive: firebase.firestore.FieldValue.serverTimestamp()
      });
  } catch (error) {
    console.error("Error updating device activity:", error);
  }
}

// Initialize device tracking
function initDeviceTracking() {
  // Register device on login
  auth.onAuthStateChanged(user => {
    if (user) {
      registerDevice();
      // Update activity periodically
      setInterval(updateDeviceActivity, 5 * 60 * 1000); // Every 5 minutes
    }
  });
}