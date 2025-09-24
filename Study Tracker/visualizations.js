// visualizations.js - Enhanced data visualizations

// Chart colors
const CHART_COLORS = {
  primary: '#4f46e5',
  secondary: '#10b981',
  tertiary: '#f59e0b',
  quaternary: '#ef4444',
  background: 'rgba(255, 255, 255, 0.1)',
  text: '#6b7280'
};

// Initialize all charts
function initCharts() {
  // Main hours chart (already in profile.js)
  updateChart();
  
  // Subject distribution chart
  updateSubjectDistributionChart();
  
  // Time of day chart
  updateTimeOfDayChart();
  
  // Weekly comparison chart
  updateWeeklyComparisonChart();
}

// Update subject distribution chart
async function updateSubjectDistributionChart() {
  const chartCanvas = document.getElementById('subject-distribution-chart');
  if (!chartCanvas) return;
  
  try {
    const userData = await getUserData();
    if (!userData || !userData.studyLogs || userData.studyLogs.length === 0) {
      return;
    }
    
    // Group logs by subject
    const subjectHours = {};
    userData.studyLogs.forEach(log => {
      const subject = log.subject;
      if (!subjectHours[subject]) {
        subjectHours[subject] = 0;
      }
      subjectHours[subject] += log.hours;
    });
    
    // Sort subjects by hours (descending)
    const sortedSubjects = Object.keys(subjectHours).sort((a, b) => 
      subjectHours[b] - subjectHours[a]);
    
    // Prepare chart data
    const labels = sortedSubjects;
    const data = sortedSubjects.map(subject => subjectHours[subject]);
    
    // Generate colors
    const backgroundColors = sortedSubjects.map((_, index) => {
      const colorKeys = Object.keys(CHART_COLORS).filter(key => key !== 'background' && key !== 'text');
      return CHART_COLORS[colorKeys[index % colorKeys.length]];
    });
    
    // Create chart
    if (window.subjectDistributionChart) {
      window.subjectDistributionChart.destroy();
    }
    
    window.subjectDistributionChart = new Chart(chartCanvas, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: CHART_COLORS.text
            }
          },
          title: {
            display: true,
            text: 'Study Hours by Subject',
            color: CHART_COLORS.text
          }
        }
      }
    });
  } catch (error) {
    console.error("Error updating subject distribution chart:", error);
  }
}

// Update time of day chart
async function updateTimeOfDayChart() {
  const chartCanvas = document.getElementById('time-of-day-chart');
  if (!chartCanvas) return;
  
  try {
    const userData = await getUserData();
    if (!userData || !userData.studyLogs || userData.studyLogs.length === 0) {
      return;
    }
    
    // Group logs by time of day
    const timeSlots = {
      'Morning (5am-12pm)': 0,
      'Afternoon (12pm-5pm)': 0,
      'Evening (5pm-9pm)': 0,
      'Night (9pm-5am)': 0
    };
    
    userData.studyLogs.forEach(log => {
      if (!log.startTime) return;
      
      const hour = parseInt(log.startTime.split(':')[0]);
      
      if (hour >= 5 && hour < 12) {
        timeSlots['Morning (5am-12pm)'] += log.hours;
      } else if (hour >= 12 && hour < 17) {
        timeSlots['Afternoon (12pm-5pm)'] += log.hours;
      } else if (hour >= 17 && hour < 21) {
        timeSlots['Evening (5pm-9pm)'] += log.hours;
      } else {
        timeSlots['Night (9pm-5am)'] += log.hours;
      }
    });
    
    // Prepare chart data
    const labels = Object.keys(timeSlots);
    const data = Object.values(timeSlots);
    
    // Create chart
    if (window.timeOfDayChart) {
      window.timeOfDayChart.destroy();
    }
    
    window.timeOfDayChart = new Chart(chartCanvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Hours',
          data: data,
          backgroundColor: CHART_COLORS.primary,
          borderColor: CHART_COLORS.primary,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: CHART_COLORS.text
            },
            grid: {
              color: CHART_COLORS.background
            }
          },
          x: {
            ticks: {
              color: CHART_COLORS.text
            },
            grid: {
              color: CHART_COLORS.background
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Study Hours by Time of Day',
            color: CHART_COLORS.text
          }
        }
      }
    });
  } catch (error) {
    console.error("Error updating time of day chart:", error);
  }
}

// Update weekly comparison chart
async function updateWeeklyComparisonChart() {
  const chartCanvas = document.getElementById('weekly-comparison-chart');
  if (!chartCanvas) return;
  
  try {
    const userData = await getUserData();
    if (!userData || !userData.studyLogs || userData.studyLogs.length === 0) {
      return;
    }
    
    // Get last 4 weeks of data
    const today = new Date();
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
    
    // Filter logs within the last 4 weeks
    const recentLogs = userData.studyLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= fourWeeksAgo && logDate <= today;
    });
    
    // Group logs by week
    const weeklyData = {};
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - ((i + 1) * 7));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() - (i * 7));
      weekEnd.setHours(23, 59, 59, 999);
      
      const weekLabel = `Week ${4 - i}`;
      
      weeklyData[weekLabel] = recentLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= weekStart && logDate <= weekEnd;
      }).reduce((total, log) => total + log.hours, 0);
    }
    
    // Prepare chart data
    const labels = Object.keys(weeklyData).reverse();
    const data = Object.values(weeklyData).reverse();
    
    // Create chart
    if (window.weeklyComparisonChart) {
      window.weeklyComparisonChart.destroy();
    }
    
    window.weeklyComparisonChart = new Chart(chartCanvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Hours',
          data: data,
          backgroundColor: CHART_COLORS.secondary,
          borderColor: CHART_COLORS.secondary,
          borderWidth: 2,
          tension: 0.3,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: CHART_COLORS.text
            },
            grid: {
              color: CHART_COLORS.background
            }
          },
          x: {
            ticks: {
              color: CHART_COLORS.text
            },
            grid: {
              color: CHART_COLORS.background
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Weekly Study Hours Comparison',
            color: CHART_COLORS.text
          }
        }
      }
    });
  } catch (error) {
    console.error("Error updating weekly comparison chart:", error);
  }
}