// tracker.js - Core functionality for the Study Tracker app

// Check if user is logged in for protected pages
function checkAuth() {
  const user = auth.currentUser;
  const isProfilePage = window.location.pathname.includes('profile.html');
  
  if (!user && isProfilePage) {
    window.location.href = 'login.html';
  }
  
  return user;
}

// Show alert messages
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

// Format date for display
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Get user data from Firestore
async function getUserData() {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    const doc = await db.collection('users').doc(user.uid).get();
    if (doc.exists) {
      return doc.data();
    } else {
      // Create user document if it doesn't exist
      const userData = {
        username: user.displayName || user.email.split('@')[0],
        avatar: user.photoURL || 'icons/icon-192.png',
        studyLogs: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      await db.collection('users').doc(user.uid).set(userData);
      return userData;
    }
  } catch (error) {
    console.error("Error getting user data:", error);
    showAlert("Error loading user data", "error");
    return null;
  }
}

// Update user data in Firestore
async function updateUserData(userData) {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    await db.collection('users').doc(user.uid).update(userData);
    return userData;
  } catch (error) {
    console.error("Error updating user data:", error);
    showAlert("Error saving data", "error");
    return null;
  }
}

// Add study log
async function addStudyLog(subject, hours, date) {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    const userData = await getUserData();
    if (!userData) return null;
    
    const newLog = { 
      id: Date.now().toString(), 
      subject: subject.trim(), 
      hours: parseFloat(hours), 
      date,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    // Add to user's logs
    userData.studyLogs = userData.studyLogs || [];
    userData.studyLogs.push(newLog);
    
    // Update storage
    await updateUserData({ studyLogs: userData.studyLogs });
    
    return newLog;
  } catch (error) {
    console.error("Error adding study log:", error);
    showAlert("Error saving study log", "error");
    return null;
  }
}

// Delete study log
async function deleteStudyLog(logId) {
  const user = auth.currentUser;
  if (!user) return false;
  
  try {
    const userData = await getUserData();
    if (!userData || !userData.studyLogs) return false;
    
    // Filter out the log to delete
    userData.studyLogs = userData.studyLogs.filter(log => log.id !== logId);
    
    // Update storage
    await updateUserData({ studyLogs: userData.studyLogs });
    
    return true;
  } catch (error) {
    console.error("Error deleting study log:", error);
    showAlert("Error deleting study log", "error");
    return false;
  }
}

// Export logs as CSV
async function exportLogsAsCSV() {
  const user = auth.currentUser;
  if (!user) return;
  
  try {
    const userData = await getUserData();
    if (!userData || !userData.studyLogs || userData.studyLogs.length === 0) {
      showAlert("No logs to export", "error");
      return;
    }
    
    // Create CSV content
    const headers = ["Date", "Subject", "Hours"];
    const rows = userData.studyLogs.map(log => [
      log.date,
      log.subject,
      log.hours
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `study-logs-${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
    
    showAlert("Logs exported successfully", "success");
  } catch (error) {
    console.error("Error exporting logs:", error);
    showAlert("Error exporting logs", "error");
  }
}

// Calculate hours between two time strings (HH:MM format)
function calculateHours(startTime, endTime) {
  // Parse the time strings
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  // Calculate total minutes
  let totalMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
  
  // Handle overnight studies (when end time is earlier than start time)
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60; // Add a full day of minutes
  }
  
  // Convert to hours with 2 decimal places
  return parseFloat((totalMinutes / 60).toFixed(2));
}

// Add event listeners for time inputs
const startTimeInput = document.getElementById("start-time");
const endTimeInput = document.getElementById("end-time");
const calculatedHours = document.getElementById("calculated-hours");

if (startTimeInput && endTimeInput && calculatedHours) {
  const updateCalculatedHours = () => {
    if (startTimeInput.value && endTimeInput.value) {
      const hours = calculateHours(startTimeInput.value, endTimeInput.value);
      calculatedHours.textContent = `Calculated hours: ${hours}`;
    }
  };
  
  startTimeInput.addEventListener("change", updateCalculatedHours);
  endTimeInput.addEventListener("change", updateCalculatedHours);
}

// Handle study log form submission
const logForm = document.getElementById("log-form");
if (logForm) {
  logForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const subject = document.getElementById("subject").value;
    const date = document.getElementById("date").value;
    
    // Get hours from time inputs if they exist
    let hours;
    const startTimeInput = document.getElementById("start-time");
    const endTimeInput = document.getElementById("end-time");
    
    if (startTimeInput && endTimeInput && startTimeInput.value && endTimeInput.value) {
      hours = calculateHours(startTimeInput.value, endTimeInput.value);
    } else {
      // Fallback to direct hours input if it exists
      const hoursInput = document.getElementById("hours");
      hours = hoursInput ? hoursInput.value : 0;
    }
    
    if (addStudyLog(subject, hours, date)) {
      showAlert("Study log added successfully!", "success");
      logForm.reset();
      
      // Update UI
      if (typeof displayLogs === "function") displayLogs();
      if (typeof updateProfile === "function") updateProfile();
      if (typeof updateChart === "function") updateChart();
    }
  });
}

// Handle CSV export
document.addEventListener("DOMContentLoaded", () => {
  // Check authentication for protected pages
  const currentUser = checkAuth();
  
  // Handle time inputs for automatic hour calculation
  const startTimeInput = document.getElementById("start-time");
  const endTimeInput = document.getElementById("end-time");
  const calculatedHours = document.getElementById("calculated-hours");
  
  if (startTimeInput && endTimeInput && calculatedHours) {
    const updateCalculatedHours = () => {
      if (startTimeInput.value && endTimeInput.value) {
        const hours = calculateHours(startTimeInput.value, endTimeInput.value);
        calculatedHours.textContent = `Calculated hours: ${hours}`;
      }
    };
    
    startTimeInput.addEventListener("change", updateCalculatedHours);
    endTimeInput.addEventListener("change", updateCalculatedHours);
  }
  
  // Handle study log form submission
  const logForm = document.getElementById("log-form");
  if (logForm) {
    logForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const subject = document.getElementById("subject").value;
      const hours = document.getElementById("hours").value;
      const date = document.getElementById("date").value;
      
      if (addStudyLog(subject, hours, date)) {
        showAlert("Study log added successfully!", "success");
        logForm.reset();
        
        // Update UI
        if (typeof displayLogs === "function") displayLogs();
        if (typeof updateProfile === "function") updateProfile();
        if (typeof updateChart === "function") updateChart();
      }
    });
  }
  
  // Handle CSV export
  const exportBtn = document.getElementById("export-csv");
  if (exportBtn) {
    exportBtn.addEventListener("click", exportLogsAsCSV);
  }
  
  // Set today's date as default in the date input
  const dateInput = document.getElementById("date");
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  }
});

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker registered'))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}


// Set up real-time listeners for user data
function setupRealTimeListeners() {
  const user = auth.currentUser;
  if (!user) return;
  
  // Listen for changes to user document
  const userListener = db.collection('users').doc(user.uid)
    .onSnapshot(doc => {
      if (doc.exists) {
        const userData = doc.data();
        // Update UI with new user data
        updateProfileUI(userData);
      }
    }, error => {
      console.error("Error in user listener:", error);
    });
  
  // Listen for changes to study logs
  const logsListener = db.collection('users').doc(user.uid)
    .collection('studyLogs')
    .orderBy('date', 'desc')
    .onSnapshot(snapshot => {
      const logs = [];
      snapshot.forEach(doc => {
        logs.push({ id: doc.id, ...doc.data() });
      });
      
      // Update UI with new logs
      updateLogsUI(logs);
      updateChart(logs);
    }, error => {
      console.error("Error in logs listener:", error);
    });
  
  // Store listeners to detach later
  window.firestoreListeners = {
    user: userListener,
    logs: logsListener
  };
}

// Detach listeners when leaving page
function detachListeners() {
  if (window.firestoreListeners) {
    if (window.firestoreListeners.user) {
      window.firestoreListeners.user();
    }
    if (window.firestoreListeners.logs) {
      window.firestoreListeners.logs();
    }
  }
}

// Update profile UI with new data
function updateProfileUI(userData) {
  // Update username
  const usernameDisplay = document.getElementById('username-display');
  if (usernameDisplay && userData.username) {
    usernameDisplay.textContent = userData.username;
  }
  
  // Update avatar
  const avatarImg = document.getElementById('avatar-img');
  if (avatarImg && userData.avatar) {
    avatarImg.src = userData.avatar;
  }
  
  // Update total hours if available
  if (userData.totalHours !== undefined) {
    const totalHoursElement = document.getElementById('total-hours');
    if (totalHoursElement) {
      totalHoursElement.textContent = userData.totalHours.toFixed(2);
    }
  }
  
  // Update streak if available
  if (userData.currentStreak !== undefined) {
    const streakElement = document.getElementById('streak-count');
    if (streakElement) {
      streakElement.textContent = userData.currentStreak;
    }
  }
}

// Update logs UI with new data
function updateLogsUI(logs) {
  const tbody = document.getElementById('logs-tbody');
  if (!tbody) return;
  
  // Clear existing rows
  tbody.innerHTML = '';
  
  // Add new rows
  logs.forEach(log => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${formatDate(log.date)}</td>
      <td>${log.subject}</td>
      <td>${log.hours.toFixed(2)} hrs</td>
      <td>
        <button class="btn-icon delete-log" data-id="${log.id}">
          <span class="sr-only">Delete</span>
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
          </svg>
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });
  
  // Add event listeners to delete buttons
  document.querySelectorAll('.delete-log').forEach(btn => {
    btn.addEventListener('click', () => {
      const logId = btn.getAttribute('data-id');
      deleteStudyLog(logId);
    });
  });
}
