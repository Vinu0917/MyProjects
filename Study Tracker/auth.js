// auth.js - Handles user authentication (signup, login, logout)

// Helper: show alerts with fade-out animation
function showAlert(message, type = "success") {
  const alertBox = document.getElementById("alert-box");
  if (!alertBox) return;
  
  alertBox.innerHTML = `<div class="alert ${type}">${message}</div>`;
  
  // Auto-dismiss after 3 seconds
  setTimeout(() => {
    const alert = alertBox.querySelector('.alert');
    if (alert) {
      alert.classList.add("fade-out");
      setTimeout(() => {
        alertBox.innerHTML = '';
      }, 500);
    }
  }, 3000);
}

// Default avatar if none provided
const DEFAULT_AVATAR = "icons/icon-192.png";

// Generate avatar URL using DiceBear API (updated to v9) with positive expressions
function generateAvatarUrl(seed) {
  // Cache avatars to improve performance
  if (!generateAvatarUrl.cache) {
    generateAvatarUrl.cache = new Map();
  }
  
  // Return cached avatar if available
  if (generateAvatarUrl.cache.has(seed)) {
    return generateAvatarUrl.cache.get(seed);
  }
  
  // Use updated DiceBear API v9 with simpler parameters
  const styles = ['adventurer', 'avataaars', 'big-smile', 'bottts', 'fun-emoji', 'lorelei', 'micah', 'miniavs', 'notionists', 'open-peeps', 'personas', 'pixel-art'];
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  
  // Generate new avatar URL with updated API
  const url = `https://api.dicebear.com/9.x/${randomStyle}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&radius=50`;
  
  // Cache the URL
  generateAvatarUrl.cache.set(seed, url);
  
  return url;
}

// Initialize avatar selection grid
function initAvatarGrid() {
  const avatarGrid = document.getElementById('avatar-grid');
  if (!avatarGrid) return;
  
  // Clear any existing content
  avatarGrid.innerHTML = '';
  
  // Show loading indicator
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'avatar-loading';
  loadingDiv.textContent = 'Loading avatars...';
  avatarGrid.appendChild(loadingDiv);
  
  // Generate 20 random avatars with diverse seeds
  const avatars = Array.from({ length: 20 }, (_, i) => {
    // Use more diverse seeds for better variety
    const seed = `user${i}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    return generateAvatarUrl(seed);
  });
  
  // Remove loading indicator and populate avatar grid
  setTimeout(() => {
    avatarGrid.innerHTML = avatars.map(url => `
      <div class="avatar-option" data-avatar="${url}">
        <img src="${url}" alt="Avatar option" loading="lazy" onerror="this.src='${DEFAULT_AVATAR}'" />
      </div>
    `).join('');
    
    // Pre-select the first avatar
    const firstAvatar = avatarGrid.querySelector('.avatar-option');
    if (firstAvatar) {
      firstAvatar.classList.add('selected');
      const avatarUrl = firstAvatar.getAttribute('data-avatar');
      document.getElementById('selected-avatar').value = avatarUrl;
    }
    
    // Handle avatar selection
    avatarGrid.addEventListener('click', (e) => {
      const option = e.target.closest('.avatar-option');
      if (!option) return;
      
      // Remove previous selection
      document.querySelectorAll('.avatar-option').forEach(opt => 
        opt.classList.remove('selected'));
      
      // Add selection to clicked avatar
      option.classList.add('selected');
      
      // Show visual feedback
      option.style.transform = 'scale(1.05)';
      setTimeout(() => {
        option.style.transform = '';
      }, 200);
      
      // Update hidden input with selected avatar URL
      const avatarUrl = option.getAttribute('data-avatar');
      document.getElementById('selected-avatar').value = avatarUrl;
      
      // Show selection confirmation
      showAlert('Avatar selected!', 'success');
    });
  }, 300); // Short delay to ensure DOM is ready
}

// Signup logic with Firebase
function handleSignup(event) {
  event.preventDefault();

  const username = document.getElementById("signup-username").value.trim();
  const password = document.getElementById("signup-password").value;
  const selectedAvatar = document.getElementById("selected-avatar").value;

  if (!username || !password) {
    showAlert("Username and password required", "error");
    return;
  }

  // Create user with email authentication (using username as email for simplicity)
  const email = `${username}@studytracker.app`; // Create a pseudo-email
  
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Add user profile information
      return userCredential.user.updateProfile({
        displayName: username,
        photoURL: selectedAvatar || DEFAULT_AVATAR
      });
    })
    .then(() => {
      // Create user document in Firestore
      const user = auth.currentUser;
      return db.collection('users').doc(user.uid).set({
        username: username,
        avatar: selectedAvatar || DEFAULT_AVATAR,
        studyLogs: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      showAlert("Signup successful!", "success");
      setTimeout(() => (window.location.href = "profile.html"), 1500);
    })
    .catch((error) => {
      showAlert(`Error: ${error.message}`, "error");
    });
}

// Combined Login/Signup logic with Firebase
function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;
  const selectedAvatar = document.getElementById("selected-avatar").value;
  
  if (!username || !password) {
    showAlert("Username and password required", "error");
    return;
  }
  
  // Check if avatar is selected
  if (!selectedAvatar) {
    showAlert("Please select an avatar", "error");
    return;
  }
  
  // Convert username to email format
  const email = `${username}@studytracker.app`;

  // Try to login first
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      showAlert("Login successful!", "success");
      setTimeout(() => (window.location.href = "profile.html"), 1000);
    })
    .catch((error) => {
      // If user doesn't exist, create a new account
      if (error.code === 'auth/user-not-found') {
        // Create new user
        auth.createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // Add user profile information
            return userCredential.user.updateProfile({
              displayName: username,
              photoURL: selectedAvatar || DEFAULT_AVATAR
            });
          })
          .then(() => {
            // Create user document in Firestore
            const user = auth.currentUser;
            return db.collection('users').doc(user.uid).set({
              username: username,
              avatar: selectedAvatar || DEFAULT_AVATAR,
              studyLogs: [],
              createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
          })
          .then(() => {
            showAlert("Account created successfully!", "success");
            setTimeout(() => (window.location.href = "profile.html"), 1500);
          })
          .catch((error) => {
            showAlert(`Error creating account: ${error.message}`, "error");
          });
      } else {
        showAlert(`Error: ${error.message}`, "error");
      }
    });
}

// Logout with Firebase
function handleLogout() {
  auth.signOut()
    .then(() => {
      window.location.href = "login.html";
    })
    .catch((error) => {
      showAlert(`Error: ${error.message}`, "error");
    });
}

// Check authentication state
function checkAuthState() {
  auth.onAuthStateChanged((user) => {
    // Get current page path
    const currentPath = window.location.pathname;
    const isProfilePage = currentPath.includes('profile.html') || currentPath.endsWith('profile');
    const isLoginPage = currentPath.includes('login.html') || currentPath.endsWith('login');
    const isSignupPage = currentPath.includes('signup.html') || currentPath.endsWith('signup');
    const isIndexPage = currentPath.includes('index.html') || currentPath.endsWith('/') || currentPath.endsWith('index');
    
    if (user) {
      // User is signed in
      if (isLoginPage || isSignupPage) {
        // Redirect to profile page with a small delay to allow for state update
        setTimeout(() => {
          window.location.href = "profile.html";
        }, 300);
      }
    } else {
      // User is signed out
      if (isProfilePage) {
        // Redirect to login page
        window.location.href = "login.html";
      }
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Check authentication state
  checkAuthState();
  
  // Initialize avatar grid on signup page
  if (window.location.pathname.includes('signup.html')) {
    initAvatarGrid();
    
    // Add event listener for signup form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', handleSignup);
    }
  }
  
  // Initialize avatar grid on login page
  if (window.location.pathname.includes('login.html')) {
    initAvatarGrid();
  }
  
  // Add event listener for login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Add event listener for logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
});
