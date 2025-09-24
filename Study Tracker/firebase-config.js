// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbUr--ux27dIPMs22FWROV7a6C94BrHhE",
  authDomain: "study-tracker-a7c4a.firebaseapp.com",
  projectId: "study-tracker-a7c4a",
  storageBucket: "study-tracker-a7c4a.appspot.com",
  messagingSenderId: "749927935598",
  appId: "1:749927935598:web:61dae1f011a7e0c08a007f",
  measurementId: "G-CM1TF7T31Y"
};

// Initialize Firebase
let app;
try {
  app = firebase.initializeApp(firebaseConfig);
} catch (e) {
  // Handle initialization errors
  if (e.code === 'app/duplicate-app') {
    // App already initialized
    app = firebase.app();
  } else if (e.code === 'app/no-app') {
    // No app found, try initializing again
    app = firebase.initializeApp(firebaseConfig);
  } else {
    // Log other errors but continue
    console.error('Firebase initialization error:', e);
    app = firebase.app();
  }
}
const auth = firebase.auth();
const db = firebase.firestore();
const analytics = firebase.analytics();
let messaging = null;

// Initialize Firebase Messaging if supported
try {
  if (firebase.messaging && firebase.messaging.isSupported()) {
    messaging = firebase.messaging();
  }
} catch (err) {
  console.log('Firebase messaging not supported in this browser');
}

// Enable offline persistence
db.enablePersistence()
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.log('Persistence failed');
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the features required to enable persistence
      console.log('Persistence is not available');
    }
  });

// Enable real-time updates
db.enableNetwork().catch(err => {
  console.error('Failed to enable network:', err);
});

// Make services available globally instead of using export
// (since we're using script tags, not modules)
window.db = db;
window.auth = auth;
window.messaging = messaging;