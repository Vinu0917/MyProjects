// profile.js - Handles profile page functionality and chart visualization

// Global chart instance
let chart;

// Initialize profile page
async function initProfile() {
  const user = auth.currentUser;
  if (!user) {
    window.location.href = 'login.html';
    return;
  }
  
  // Set max date for date input to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('max', today);
    dateInput.value = today; // Set default to today
  }
  
  // Initialize time inputs
  initTimeTracking();
  
  // Update profile information
  await updateProfile();
  
  // Display logs in table
  await displayLogs();
  
  // Initialize chart
  await updateChart();
  
  // Set up event listeners
  setupEventListeners();
  
  // Initialize new components
  try {
    // Register current device
    await registerDevice();
    
    // Request notification permission
    await requestNotificationPermission();
    
    // Initialize categories
    await initCategories();
    
    // Initialize goals and achievements
    await initGoals();
    
    // Initialize enhanced visualizations
    initCharts();
    
    // Set up real-time listeners
    setupRealtimeListeners();
  } catch (error) {
    console.error("Error initializing components:", error);
  }
}

// Calculate and display study streak
async function calculateStreak() {
  try {
    const userData = await getUserData();
    if (!userData || !userData.studyLogs || userData.studyLogs.length === 0) return 0;
    
    // Sort logs by date (newest first)
    const sortedDates = [...userData.studyLogs]
      .map(log => log.date)
      .sort((a, b) => new Date(b) - new Date(a));
    
    // Remove duplicate dates
    const uniqueDates = [...new Set(sortedDates)];
    
    // Get today's date without time
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if studied today
    const latestDate = new Date(uniqueDates[0]);
    latestDate.setHours(0, 0, 0, 0);
    
    // If latest study date is before yesterday, no current streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (latestDate < yesterday) return 0;
    
    // Count consecutive days
    let streak = 0;
    let currentDate = new Date(today);
    let checkDate = new Date(currentDate);
    
    // Check if studied today
    if (uniqueDates.some(date => {
      const logDate = new Date(date);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime();
    })) {
      streak = 1;
    }
    
    // Go back day by day to check for consecutive study days
    for (let i = 0; i < 365; i++) { // Limit to a year of history
      checkDate.setDate(checkDate.getDate() - 1);
      
      const hasStudyLog = uniqueDates.some(date => {
        const logDate = new Date(date);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === checkDate.getTime();
      });
      
      if (hasStudyLog) {
        streak++;
      } else if (streak > 0) {
        // Break the streak if a day is missed
        break;
      }
    }
    
    return streak;
  } catch (error) {
    console.error("Error calculating streak:", error);
    return 0;
  }
}

// Update profile information
async function updateProfile() {
  const user = auth.currentUser;
  if (!user) return;
  
  try {
    const userData = await getUserData();
    if (!userData) return;
    
    // Update username display
    const usernameDisplay = document.getElementById('username-display');
    if (usernameDisplay) {
      usernameDisplay.textContent = userData.username || user.displayName || user.email.split('@')[0];
    }
    
    // Update avatar
    const avatarImg = document.getElementById('avatar-img');
    if (avatarImg) {
      avatarImg.src = userData.avatar || user.photoURL || 'icons/icon-192.png';
    }
    
    // Calculate and display total hours
    const totalHours = document.getElementById('total-hours');
    if (totalHours && userData.studyLogs) {
      const total = userData.studyLogs.reduce((sum, log) => sum + parseFloat(log.hours), 0);
      totalHours.textContent = total.toFixed(2);
    }
    
    // Calculate and display streak
    const streakElement = document.getElementById('streak-count');
    if (streakElement) {
      const streak = await calculateStreak();
      streakElement.textContent = streak;
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    showAlert("Error loading profile data", "error");
  }
}

// Display logs in table
async function displayLogs() {
  try {
    const userData = await getUserData();
    if (!userData || !userData.studyLogs) return;
    
    const tbody = document.getElementById('logs-tbody');
    if (!tbody) return;
    
    // Sort logs by date (newest first)
    const sortedLogs = [...userData.studyLogs].sort((a, b) => 
      new Date(b.date) - new Date(a.date));
    
    // Generate table rows
    tbody.innerHTML = sortedLogs.map(log => `
      <tr data-id="${log.id}">
        <td>${formatDate(log.date)}</td>
        <td>${log.subject}</td>
        <td>${parseFloat(log.hours).toFixed(2)}</td>
        <td>
          <button class="btn-icon delete-log" aria-label="Delete log">
            <svg viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
            </svg>
          </button>
        </td>
      </tr>
    `).join('');
    
    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-log').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const row = e.target.closest('tr');
        const logId = row.getAttribute('data-id');
        
        if (await deleteStudyLog(logId)) {
          row.remove();
          updateProfile();
          updateChart();
          showAlert("Log deleted successfully");
        }
      });
    });
  } catch (error) {
    console.error("Error displaying logs:", error);
    showAlert("Error loading study logs", "error");
  }
}

// Calculate hours between start and end time
function calculateHours(startTime, endTime) {
  if (!startTime || !endTime) return 0;
  
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  let hours = endHour - startHour;
  let minutes = endMinute - startMinute;
  
  if (minutes < 0) {
    hours--;
    minutes += 60;
  }
  
  // Handle overnight sessions
  if (hours < 0) {
    hours += 24;
  }
  
  return hours + (minutes / 60);
}

// Initialize time tracking inputs
function initTimeTracking() {
  const startTimeInput = document.getElementById('start-time');
  const endTimeInput = document.getElementById('end-time');
  const calculatedHours = document.getElementById('calculated-hours');
  
  if (!startTimeInput || !endTimeInput || !calculatedHours) return;
  
  // Set default start time to current hour
  const now = new Date();
  const currentHour = now.getHours().toString().padStart(2, '0');
  const currentMinute = now.getMinutes().toString().padStart(2, '0');
  startTimeInput.value = `${currentHour}:${currentMinute}`;
  
  // Set default end time to one hour later
  const laterHour = (now.getHours() + 1) % 24;
  endTimeInput.value = `${laterHour.toString().padStart(2, '0')}:${currentMinute}`;
  
  // Update calculated hours when inputs change
  function updateCalculatedHours() {
    const hours = calculateHours(startTimeInput.value, endTimeInput.value);
    calculatedHours.textContent = `Calculated hours: ${hours.toFixed(2)}`;
    
    // Validate that end time is after start time
    if (hours < 0 || hours > 24) {
      calculatedHours.classList.add('error');
    } else {
      calculatedHours.classList.remove('error');
    }
  }
  
  startTimeInput.addEventListener('change', updateCalculatedHours);
  endTimeInput.addEventListener('change', updateCalculatedHours);
  
  // Initial calculation
  updateCalculatedHours();
}

// Update chart with study data
async function updateChart() {
  try {
    const userData = await getUserData();
    if (!userData || !userData.studyLogs || userData.studyLogs.length === 0) return;
    
    const chartCanvas = document.getElementById('hours-chart');
    if (!chartCanvas) return;
    
    const viewSelect = document.getElementById('view-select');
    const viewType = viewSelect ? viewSelect.value : 'daily';
    
    // Prepare data based on view type
    const { labels, data } = prepareChartData(userData.studyLogs, viewType);
    
    // Create or update chart
    if (chart) {
      chart.data.labels = labels;
      chart.data.datasets[0].data = data;
      chart.update();
    } else {
      chart = new Chart(chartCanvas, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Study Hours',
            data,
            backgroundColor: '#4f46e5',
            borderColor: '#4338ca',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Hours'
              }
            }
          }
        }
      });
    }
  } catch (error) {
    console.error("Error updating chart:", error);
    showAlert("Error loading chart data", "error");
  }
}

// Prepare data for chart based on view type
function prepareChartData(logs, viewType) {
  // Sort logs by date (oldest first)
  const sortedLogs = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Group data based on view type
  const groupedData = {};
  
  sortedLogs.forEach(log => {
    const date = new Date(log.date);
    let key;
    
    switch (viewType) {
      case 'daily':
        key = log.date;
        break;
      case 'weekly':
        // Get week number and year
        const weekNumber = getWeekNumber(date);
        key = `Week ${weekNumber[1]}, ${weekNumber[0]}`;
        break;
      case 'monthly':
        key = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        break;
      case 'yearly':
        key = date.getFullYear().toString();
        break;
      default:
        key = log.date;
    }
    
    if (!groupedData[key]) {
      groupedData[key] = 0;
    }
    groupedData[key] += parseFloat(log.hours);
  });
  
  // Convert to arrays for chart
  const labels = Object.keys(groupedData);
  const data = Object.values(groupedData);
  
  return { labels, data };
}

// Helper function to get week number
function getWeekNumber(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNumber = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return [d.getFullYear(), weekNumber];
}

// Set up event listeners
function setupEventListeners() {
  // Log form submission
  const logForm = document.getElementById('log-form');
  if (logForm) {
    logForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const subject = document.getElementById('subject').value;
      const date = document.getElementById('date').value;
      const startTime = document.getElementById('start-time').value;
      const endTime = document.getElementById('end-time').value;
      
      const hours = calculateHours(startTime, endTime);
      
      if (hours <= 0 || hours > 24) {
        showAlert("Invalid time range", "error");
        return;
      }
      
      const newLog = await addStudyLog(subject, hours, date);
      if (newLog) {
        showAlert("Study log added successfully");
        logForm.reset();
        initTimeTracking(); // Reset time inputs
        await updateProfile();
        await displayLogs();
        await updateChart();
      }
    });
  }
  
  // View type change
  const viewSelect = document.getElementById('view-select');
  if (viewSelect) {
    viewSelect.addEventListener('change', updateChart);
  }
  
  // Export CSV button
  const exportBtn = document.getElementById('export-csv');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportLogsAsCSV);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on the profile page
  if (window.location.pathname.includes('profile.html')) {
    // Wait for Firebase auth to initialize
    auth.onAuthStateChanged(user => {
      if (user) {
        initProfile();
      } else {
        window.location.href = 'login.html';
      }
    });
  }
});

// Initialize filters
function initFilters() {
  // Set up date range inputs
  const today = new Date().toISOString().split('T')[0];
  const dateFrom = document.getElementById('date-from');
  const dateTo = document.getElementById('date-to');
  
  if (dateFrom && dateTo) {
    // Default to last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    dateFrom.value = thirtyDaysAgo.toISOString().split('T')[0];
    dateTo.value = today;
    
    // Set max date to today
    dateFrom.setAttribute('max', today);
    dateTo.setAttribute('max', today);
  }
  
  // Populate subject filter
  populateSubjectFilter();
  
  // Set up event listeners
  const applyBtn = document.getElementById('apply-filters');
  const resetBtn = document.getElementById('reset-filters');
  
  if (applyBtn) {
    applyBtn.addEventListener('click', applyFilters);
  }
  
  if (resetBtn) {
    resetBtn.addEventListener('click', resetFilters);
  }
}

// Populate subject filter dropdown
async function populateSubjectFilter() {
  const subjectFilter = document.getElementById('subject-filter');
  if (!subjectFilter) return;
  
  try {
    const userData = await getUserData();
    if (!userData || !userData.studyLogs) return;
    
    // Get unique subjects
    const subjects = [...new Set(userData.studyLogs.map(log => log.subject))];
    subjects.sort();
    
    // Add options to dropdown
    let options = '<option value="">All Subjects</option>';
    subjects.forEach(subject => {
      options += `<option value="${subject}">${subject}</option>`;
    });
    
    subjectFilter.innerHTML = options;
  } catch (error) {
    console.error("Error populating subject filter:", error);
  }
}

// Apply filters to logs
async function applyFilters() {
  const subjectFilter = document.getElementById('subject-filter').value;
  const dateFrom = document.getElementById('date-from').value;
  const dateTo = document.getElementById('date-to').value;
  
  try {
    const userData = await getUserData();
    if (!userData || !userData.studyLogs) return;
    
    // Apply filters
    let filteredLogs = userData.studyLogs;
    
    // Filter by subject
    if (subjectFilter) {
      filteredLogs = filteredLogs.filter(log => log.subject === subjectFilter);
    }
    
    // Filter by date range
    if (dateFrom) {
      filteredLogs = filteredLogs.filter(log => log.date >= dateFrom);
    }
    
    if (dateTo) {
      filteredLogs = filteredLogs.filter(log => log.date <= dateTo);
    }
    
    // Update UI with filtered logs
    updateLogsUI(filteredLogs);
    updateChart(filteredLogs);
    
    // Show filter status
    showAlert(`Showing ${filteredLogs.length} filtered results`, "info");
  } catch (error) {
    console.error("Error applying filters:", error);
    showAlert("Error applying filters", "error");
  }
}

// Reset filters
async function resetFilters() {
  // Reset form values
  document.getElementById('subject-filter').value = '';
  
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  document.getElementById('date-from').value = thirtyDaysAgo.toISOString().split('T')[0];
  document.getElementById('date-to').value = today;
  
  // Show all logs
  const userData = await getUserData();
  if (userData && userData.studyLogs) {
    updateLogsUI(userData.studyLogs);
    updateChart(userData.studyLogs);
  }
  
  showAlert("Filters reset", "info");
}

// Set up real-time listeners for data updates
function setupRealtimeListeners() {
  const user = auth.currentUser;
  if (!user) return;
  
  // Listen for user data changes
  const userDocRef = db.collection('users').doc(user.uid);
  userDocRef.onSnapshot(doc => {
    if (doc.exists) {
      const userData = doc.data();
      
      // Update UI with new data
      updateProfileUI(userData);
      
      // Update charts if study logs changed
      if (userData.studyLogs) {
        updateChart();
        updateSubjectDistributionChart();
        updateTimeOfDayChart();
        updateWeeklyComparisonChart();
      }
      
      // Check for new achievements
      checkAchievements(userData);
    }
  }, error => {
    console.error("Real-time listener error:", error);
  });
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
  
  // Update total hours
  updateTotalHours(userData.studyLogs || []);
  
  // Update streak
  updateStreak();
}
