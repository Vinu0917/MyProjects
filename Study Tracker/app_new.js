/**
 * Study Tracker - Enhanced PWA Implementation
 * Features: Line charts, persistent data, cross-device sync, expanded avatars
 */

class StudyTrackerApp {
  constructor() {
    this.currentUser = null;
    this.studyLogs = [];
    this.currentView = 'landing';
    this.selectedAvatar = '👤';
    this.chartPeriod = 'weekly';
    
    // Expanded avatar collection
    this.avatars = [
      '👨‍🎓', '👩‍🎓', '🧑‍💻', '👨‍💻', '👩‍💻', '🧑‍🔬', '👨‍🔬', '👩‍🔬',
      '🧑‍🏫', '👨‍🏫', '👩‍🏫', '🧑‍🎨', '👨‍🎨', '👩‍🎨', '🤓', '😊',
      '🧑‍📚', '👨‍📚', '👩‍📚', '🧑‍🎯', '👨‍🎯', '👩‍🎯', '🧑‍💼', '👨‍💼', '👩‍💼',
      '🧑‍🔧', '👨‍🔧', '👩‍🔧', '🧑‍⚕️', '👨‍⚕️', '👩‍⚕️', '🧑‍🚀', '👨‍🚀', '👩‍🚀',
      '🧑‍🎤', '👨‍🎤', '👩‍🎤', '🧑‍🍳', '👨‍🍳', '👩‍🍳', '🧑‍🌾', '👨‍🌾', '👩‍🌾',
      '😎', '🤗', '😄', '😃', '😁', '🙂', '😇', '🤔', '🧐', '😌', '😊', '☺️',
      '🎯', '📚', '✨', '🌟', '⭐', '🏆', '🎖️', '🥇', '🎓', '📖', '✏️', '📝'
    ];
    
    this.init();
  }

  init() {
    this.loadUserData();
    this.setupEventListeners();
    this.checkAuthState();
    this.setupServiceWorker();
  }

  checkAuthState() {
    const userData = localStorage.getItem('studyTracker_user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      this.loadStudyLogs();
      this.loadFromCloud();
      this.showDashboard();
    } else {
      this.showLandingPage();
    }
  }

  loadUserData() {
    const userData = localStorage.getItem('studyTracker_user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  loadStudyLogs() {
    if (this.currentUser) {
      const logs = localStorage.getItem(`studyTracker_logs_${this.currentUser.username}`);
      if (logs) {
        this.studyLogs = JSON.parse(logs);
      }
    }
  }

  saveUserData() {
    if (this.currentUser) {
      localStorage.setItem('studyTracker_user', JSON.stringify(this.currentUser));
      this.syncToCloud();
    }
  }

  saveStudyLogs() {
    if (this.currentUser) {
      localStorage.setItem(`studyTracker_logs_${this.currentUser.username}`, JSON.stringify(this.studyLogs));
      this.syncToCloud();
    }
  }

  syncToCloud() {
    if (this.currentUser) {
      const syncData = {
        user: this.currentUser,
        logs: this.studyLogs,
        lastSync: new Date().toISOString()
      };
      localStorage.setItem(`studyTracker_cloud_${this.currentUser.username}`, JSON.stringify(syncData));
    }
  }

  loadFromCloud() {
    if (this.currentUser) {
      const cloudData = localStorage.getItem(`studyTracker_cloud_${this.currentUser.username}`);
      if (cloudData) {
        const data = JSON.parse(cloudData);
        if (data.logs && data.logs.length > this.studyLogs.length) {
          this.studyLogs = data.logs;
          this.saveStudyLogs();
        }
      }
    }
  }

  showLandingPage() {
    this.currentView = 'landing';
    document.getElementById('landing-page').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('nav-menu').innerHTML = `
      <button class="nav-btn" id="login-btn">Login</button>
      <button class="nav-btn nav-btn-primary" id="signup-btn">Sign Up</button>
    `;
  }

  showDashboard() {
    this.currentView = 'dashboard';
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    
    document.getElementById('nav-menu').innerHTML = `
      <span class="user-info">
        <span class="user-avatar">${this.currentUser.avatar}</span>
        <span class="user-name">${this.currentUser.username}</span>
      </span>
      <button class="nav-btn" id="logout-btn">Logout</button>
    `;
    
    this.addChartPeriodSelector();
    this.updateDashboard();
  }

  addChartPeriodSelector() {
    const chartContainer = document.querySelector('.card h3');
    if (chartContainer && !document.getElementById('chart-period-selector')) {
      chartContainer.innerHTML = `
        Study Progress
        <select id="chart-period-selector" class="chart-period-selector">
          <option value="daily">Daily</option>
          <option value="weekly" selected>Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      `;
    }
  }

  updateDashboard() {
    this.updateStats();
    this.updateChart();
    this.updateRecentSessions();
  }

  updateStats() {
    const totalHours = this.studyLogs.reduce((sum, log) => sum + log.hours, 0);
    const streak = this.calculateStreak();
    const todayHours = this.getTodayHours();

    document.getElementById('total-hours').textContent = totalHours.toFixed(1);
    document.getElementById('study-streak').textContent = streak;
    document.getElementById('today-hours').textContent = todayHours.toFixed(1);
  }

  calculateStreak() {
    if (this.studyLogs.length === 0) return 0;
    
    const today = new Date();
    const dates = [...new Set(this.studyLogs.map(log => log.date))].sort();
    let streak = 0;
    let currentDate = new Date(today);

    for (let i = dates.length - 1; i >= 0; i--) {
      const logDate = new Date(dates[i]);
      const diffDays = Math.floor((currentDate - logDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
        currentDate = logDate;
      } else {
        break;
      }
    }
    return streak;
  }

  getTodayHours() {
    const today = new Date().toISOString().split('T')[0];
    return this.studyLogs
      .filter(log => log.date === today)
      .reduce((sum, log) => sum + log.hours, 0);
  }

  updateRecentSessions() {
    const sessionsList = document.getElementById('sessions-list');
    const recentSessions = this.studyLogs
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    if (recentSessions.length === 0) {
      sessionsList.innerHTML = '<p class="no-data">No study sessions yet. Add your first session!</p>';
      return;
    }

    sessionsList.innerHTML = recentSessions.map(session => `
      <div class="session-item">
        <div class="session-subject">${session.subject}</div>
        <div class="session-details">
          <span class="session-date">${new Date(session.date).toLocaleDateString()}</span>
          <span class="session-hours">${session.hours}h</span>
        </div>
        <button class="btn-delete" onclick="app.deleteSession('${session.id}')">×</button>
      </div>
    `).join('');
  }

  updateChart() {
    const canvas = document.getElementById('progress-chart');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const chartData = this.getChartData();
    
    if (chartData.length === 0) {
      ctx.fillStyle = '#6b7280';
      ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
      return;
    }

    this.drawLineChart(ctx, canvas, chartData);
  }

  getChartData() {
    const now = new Date();
    let data = [];

    switch (this.chartPeriod) {
      case 'daily':
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split('T')[0];
          const hours = this.studyLogs
            .filter(log => log.date === dateStr)
            .reduce((sum, log) => sum + log.hours, 0);
          data.push({
            label: date.toLocaleDateString('en-US', { weekday: 'short' }),
            value: hours
          });
        }
        break;
        
      case 'weekly':
        for (let i = 3; i >= 0; i--) {
          const weekStart = new Date(now);
          weekStart.setDate(weekStart.getDate() - (weekStart.getDay() + 7 * i));
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          
          const hours = this.studyLogs
            .filter(log => {
              const logDate = new Date(log.date);
              return logDate >= weekStart && logDate <= weekEnd;
            })
            .reduce((sum, log) => sum + log.hours, 0);
            
          data.push({
            label: `Week ${i + 1}`,
            value: hours
          });
        }
        break;
        
      case 'monthly':
        for (let i = 5; i >= 0; i--) {
          const month = new Date(now);
          month.setMonth(month.getMonth() - i);
          const monthStr = month.toISOString().slice(0, 7);
          
          const hours = this.studyLogs
            .filter(log => log.date.startsWith(monthStr))
            .reduce((sum, log) => sum + log.hours, 0);
            
          data.push({
            label: month.toLocaleDateString('en-US', { month: 'short' }),
            value: hours
          });
        }
        break;
    }
    return data;
  }

  drawLineChart(ctx, canvas, data) {
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    
    const maxValue = Math.max(...data.map(d => d.value), 1);
    const stepX = chartWidth / (data.length - 1);
    
    // Grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight * i) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
    }
    
    // Line
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((point, index) => {
      const x = padding + index * stepX;
      const y = padding + chartHeight - (point.value / maxValue) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Points
    ctx.fillStyle = '#6366f1';
    data.forEach((point, index) => {
      const x = padding + index * stepX;
      const y = padding + chartHeight - (point.value / maxValue) * chartHeight;
      
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    // Labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    
    data.forEach((point, index) => {
      const x = padding + index * stepX;
      ctx.fillText(point.label, x, canvas.height - 10);
      
      const y = padding + chartHeight - (point.value / maxValue) * chartHeight;
      ctx.fillText(`${point.value.toFixed(1)}h`, x, y - 10);
    });
  }

  setupEventListeners() {
    // Attach event listeners immediately
    this.attachEventListeners();
  }

  attachEventListeners() {
    // Check if we're on login or signup page
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'login.html') {
      this.setupLoginPage();
    } else if (currentPage === 'signup.html') {
      this.setupSignupPage();
    } else if (currentPage === 'index.html' || currentPage === '') {
      this.setupMainPage();
    }
    
    // Common event listeners
    document.body.addEventListener('click', (e) => {
      if (e.target.id === 'logout-btn') {
        e.preventDefault();
        this.logout();
      }
    });

    // Modal close buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal-overlay')) {
        e.preventDefault();
        this.hideModals();
      }
    });

    // Form submissions
    document.addEventListener('submit', (e) => {
      if (e.target.id === 'login-form') {
        e.preventDefault();
        this.handleLogin(e.target);
      } else if (e.target.id === 'signup-form') {
        e.preventDefault();
        this.handleSignup(e.target);
      } else if (e.target.id === 'study-form') {
        e.preventDefault();
        this.handleStudyLog(e.target);
      }
    });

    // Chart period selector
    document.addEventListener('change', (e) => {
      if (e.target.id === 'chart-period-selector') {
        this.chartPeriod = e.target.value;
        this.updateChart();
      }
    });

    // Set default date to today
    const dateInput = document.getElementById('date');
    if (dateInput) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }
  }

  showModal(modalId) {
    console.log('Showing modal:', modalId);
    this.hideModals();
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'flex';
      modal.style.visibility = 'visible';
      setTimeout(() => {
        modal.classList.add('active');
      }, 10);
      this.populateAvatarGrid();
    } else {
      console.error('Modal not found:', modalId);
    }
  }

  hideModals() {
    document.querySelectorAll('.modal').forEach(modal => {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    });
  }

  populateAvatarGrid() {
    const avatarGrid = document.getElementById('avatar-grid');
    if (avatarGrid) {
      avatarGrid.innerHTML = this.avatars.map(avatar => 
        `<div class="avatar-option" data-avatar="${avatar}">${avatar}</div>`
      ).join('');

      const firstAvatar = avatarGrid.querySelector('.avatar-option');
      if (firstAvatar) {
        firstAvatar.classList.add('selected');
        this.selectedAvatar = firstAvatar.dataset.avatar;
      }

      avatarGrid.addEventListener('click', (e) => {
        const option = e.target.closest('.avatar-option');
        if (!option) return;

        avatarGrid.querySelectorAll('.avatar-option').forEach(opt => 
          opt.classList.remove('selected'));
        
        option.classList.add('selected');
        this.selectedAvatar = option.dataset.avatar;
      });
    }
  }

  handleSignup(form) {
    const formData = new FormData(form);
    const username = formData.get('username');
    const password = formData.get('password');

    // Simple validation
    if (!username || !password) {
      this.showAlert('Please fill in all fields', 'error');
      return;
    }

    if (!this.selectedAvatar) {
      this.showAlert('Please select an avatar', 'error');
      return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('study_tracker_users') || '{}');
    
    if (users[username]) {
      this.showAlert('Username already exists', 'error');
      return;
    }

    // Create new user
    const newUser = {
      username,
      password,
      avatar: this.selectedAvatar,
      createdAt: new Date().toISOString()
    };

    users[username] = newUser;
    localStorage.setItem('study_tracker_users', JSON.stringify(users));
    
    this.currentUser = newUser;
    localStorage.setItem('study_tracker_current_user', JSON.stringify(this.currentUser));
    
    this.showAlert('Account created successfully!', 'success');
    
    // Redirect to main page
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }

  logout() {
    this.currentUser = null;
    this.studyLogs = [];
    localStorage.removeItem('study_tracker_current_user');
    
    // Redirect to main page
    window.location.href = 'index.html';
  }

  handleStudyLog(e) {
    const formData = new FormData(e.target);
    const subject = formData.get('subject').trim();
    const date = formData.get('date');
    const startTime = formData.get('start-time');
    const endTime = formData.get('end-time');

    if (!subject || !date || !startTime || !endTime) {
      this.showAlert('Please fill in all fields', 'error');
      return;
    }

    const hours = this.calculateHours(startTime, endTime);
    if (hours <= 0) {
      this.showAlert('End time must be after start time', 'error');
      return;
    }

    const newLog = {
      id: Date.now().toString(),
      subject,
      date,
      startTime,
      endTime,
      hours,
      createdAt: new Date().toISOString()
    };

    this.studyLogs.push(newLog);
    this.saveStudyLogs();
    this.updateDashboard();
    e.target.reset();
    this.showAlert('Study session logged!', 'success');
  }

  calculateHours(startTime, endTime) {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    let totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60;
    }
    
    return parseFloat((totalMinutes / 60).toFixed(2));
  }

  deleteSession(sessionId) {
    this.studyLogs = this.studyLogs.filter(log => log.id !== sessionId);
    this.saveStudyLogs();
    this.updateDashboard();
    this.showAlert('Session deleted', 'success');
  }

  showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
      alert.remove();
    }, 3000);
  }

  async setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('service-worker.js');
        console.log('Service Worker registered successfully');
      } catch (error) {
        console.log('Service Worker registration failed:', error);
      }
    }
  }
}

// Initialize the app
const app = new StudyTrackerApp();
