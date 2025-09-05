// Firebase SDK imports (ES module style)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

// ✅ Step 1: Your Firebase configuration (replace with YOUR project’s values)
const firebaseConfig = {
  apiKey: "AIzaSyBCREleAC_fql2zxMUFxHFtX0QUGnrMw-Y",
  authDomain: "moodreadsapp-204bb.firebaseapp.com",
  projectId: "moodreadsapp-204bb",
  storageBucket: "moodreadsapp-204bb.firebasestorage.app",
  messagingSenderId: "535999783749",
  appId: "1:535999783749:web:d6b7793fe489b66e03942c",
  measurementId: "G-CBFL21WWD2"
};

// ✅ Step 2: Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Step 3: Sign Up function
window.signUp = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      alert("Signup successful!");
      console.log(userCredential.user);
    })
    .catch(error => {
      alert("Signup failed: " + error.message);
    });
};

// ✅ Step 4: Log In function
window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      alert("Login successful!");
      console.log(userCredential.user);
    })
    .catch(error => {
      alert("Login failed: " + error.message);
    });
};
