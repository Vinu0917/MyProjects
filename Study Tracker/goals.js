// goals.js - Handles study goals and achievements

// Goal types
const GOAL_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  SUBJECT: 'subject'
};

// Achievement types
const ACHIEVEMENT_TYPES = {
  STREAK: 'streak',
  HOURS: 'hours',
  CONSISTENCY: 'consistency',
  SUBJECT_MASTERY: 'subject_mastery'
};

// Predefined achievements
const PREDEFINED_ACHIEVEMENTS = [
  {
    id: 'streak_3',
    name: '3-Day Streak',
    description: 'Study for 3 consecutive days',
    type: ACHIEVEMENT_TYPES.STREAK,
    threshold: 3,
    icon: '🔥'
  },
  {
    id: 'streak_7',
    name: '7-Day Streak',
    description: 'Study for 7 consecutive days',
    type: ACHIEVEMENT_TYPES.STREAK,
    threshold: 7,
    icon: '🔥'
  },
  {
    id: 'streak_30',
    name: '30-Day Streak',
    description: 'Study for 30 consecutive days',
    type: ACHIEVEMENT_TYPES.STREAK,
    threshold: 30,
    icon: '🏆'
  },
  {
    id: 'hours_10',
    name: '10 Hours',
    description: 'Complete 10 hours of studying',
    type: ACHIEVEMENT_TYPES.HOURS,
    threshold: 10,
    icon: '⏱️'
  },
  {
    id: 'hours_50',
    name: '50 Hours',
    description: 'Complete 50 hours of studying',
    type: ACHIEVEMENT_TYPES.HOURS,
    threshold: 50,
    icon: '⏱️'
  },
  {
    id: 'hours_100',
    name: '100 Hours',
    description: 'Complete 100 hours of studying',
    type: ACHIEVEMENT_TYPES.HOURS,
    threshold: 100,
    icon: '🎓'
  }
];

// Create a new goal
async function createGoal(goalData) {
  const user = auth.currentUser;
  if (!user) return null;
  
  try {
    // Validate goal data
    if (!goalData.type || !goalData.target || !goalData.name) {
      showAlert("Invalid goal data", "error");
      return null;
    }
    
    // Create goal object
    const goal = {
      id: Date.now().toString(),
      name: goalData.name,
      type: goalData.type,
      target: parseFloat(goalData.target),
      subject: goalData.subject || null,
      startDate: goalData.startDate || new Date().toISOString().split('T')[0],
      endDate: goalData.endDate || null,
      progress: 0,
      completed: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    // Add to user's goals collection
    await db.collection('users').doc(user.uid)
      .collection('goals').doc(goal.id).set(goal);
    
    return goal;
  } catch (error) {
    console.error("Error creating goal:", error);
    return null;
  }
}

// Get user's goals
async function getUserGoals() {
  const user = auth.currentUser;
  if (!user) return [];
  
  try {
    const snapshot = await db.collection('users').doc(user.uid)
      .collection('goals').get();
      
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Error getting goals:", error);
    return [];
  }
}

// Update goal progress
async function updateGoalProgress(goalId, progress) {
  const user = auth.currentUser;
  if (!user) return false;
  
  try {
    const goalRef = db.collection('users').doc(user.uid)
      .collection('goals').doc(goalId);
    
    const goalDoc = await goalRef.get();
    if (!goalDoc.exists) return false;
    
    const goal = goalDoc.data();
    const completed = progress >= goal.target;
    
    // Update goal
    await goalRef.update({
      progress,
      completed,
      completedAt: completed ? firebase.firestore.FieldValue.serverTimestamp() : null
    });
    
    // If newly completed, check for achievements
    if (completed && !goal.completed) {
      checkAchievements();
    }
    
    return true;
  } catch (error) {
    console.error("Error updating goal progress:", error);
    return false;
  }
}

// Delete a goal
async function deleteGoal(goalId) {
  const user = auth.currentUser;
  if (!user) return false;
  
  try {
    await db.collection('users').doc(user.uid)
      .collection('goals').doc(goalId).delete();
    return true;
  } catch (error) {
    console.error("Error deleting goal:", error);
    return false;
  }
}

// Check for achievements
async function checkAchievements() {
  const user = auth.currentUser;
  if (!user) return;
  
  try {
    // Get user data
    const userData = await getUserData();
    if (!userData) return;
    
    // Initialize achievements array if not exists
    if (!userData.achievements) {
      await db.collection('users').doc(user.uid).update({
        achievements: []
      });
    }
    
    // Check streak achievements
    const streak = userData.currentStreak || 0;
    const streakAchievements = PREDEFINED_ACHIEVEMENTS.filter(a => 
      a.type === ACHIEVEMENT_TYPES.STREAK && streak >= a.threshold);
    
    // Check hours achievements
    const totalHours = userData.totalHours || 0;
    const hoursAchievements = PREDEFINED_ACHIEVEMENTS.filter(a => 
      a.type === ACHIEVEMENT_TYPES.HOURS && totalHours >= a.threshold);
    
    // Combine achievements to check
    const achievementsToCheck = [...streakAchievements, ...hoursAchievements];
    
    // Get existing achievements
    const existingAchievements = userData.achievements || [];
    
    // Find new achievements
    const newAchievements = achievementsToCheck.filter(achievement => 
      !existingAchievements.some(a => a.id === achievement.id));
    
    // If new achievements found, update user
    if (newAchievements.length > 0) {
      // Add timestamps to new achievements
      const timestampedAchievements = newAchievements.map(achievement => ({
        ...achievement,
        earnedAt: firebase.firestore.FieldValue.serverTimestamp()
      }));
      
      // Update user document
      await db.collection('users').doc(user.uid).update({
        achievements: firebase.firestore.FieldValue.arrayUnion(...timestampedAchievements)
      });
      
      // Show notification for each new achievement
      newAchievements.forEach(achievement => {
        showAlert(`Achievement Unlocked: ${achievement.name}`, "achievement");
      });
    }
  } catch (error) {
    console.error("Error checking achievements:", error);
  }
}

// Initialize goals UI
function initGoalsUI() {
  // Set up goal form
  const goalForm = document.getElementById('add-goal-form');
  if (goalForm) {
    goalForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const goalData = {
        name: document.getElementById('goal-name').value.trim(),
        type: document.getElementById('goal-type').value,
        target: document.getElementById('goal-target').value,
        subject: document.getElementById('goal-subject').value || null,
        startDate: document.getElementById('goal-start-date').value,
        endDate: document.getElementById('goal-end-date').value || null
      };
      
      const goal = await createGoal(goalData);
      if (goal) {
        showAlert(`Goal "${goal.name}" created`, "success");
        goalForm.reset();
        displayGoals();
      }
    });
  }
  
  // Display goals
  displayGoals();
  
  // Display achievements
  displayAchievements();
}

// Display user's goals
async function displayGoals() {
  const goalsList = document.getElementById('goals-list');
  if (!goalsList) return;
  
  try {
    const goals = await getUserGoals();
    
    if (goals.length === 0) {
      goalsList.innerHTML = '<p class="empty-state">No goals yet. Create one to get started!</p>';
      return;
    }
    
    // Sort goals (active first, then by creation date)
    goals.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    // Render goals
    goalsList.innerHTML = goals.map(goal => {
      const progress = Math.min(100, (goal.progress / goal.target) * 100);
      const statusClass = goal.completed ? 'completed' : 'in-progress';
      
      return `
        <div class="goal-card ${statusClass}">
          <div class="goal-header">
            <h4>${goal.name}</h4>
            <button class="btn-icon delete-goal" data-id="${goal.id}">
              <span class="sr-only">Delete</span>
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
              </svg>
            </button>
          </div>
          <div class="goal-details">
            <p>${getGoalDescription(goal)}</p>
            <div class="progress-bar">
              <div class="progress" style="width: ${progress}%"></div>
            </div>
            <p class="progress-text">${goal.progress} / ${goal.target} ${getGoalUnit(goal.type)}</p>
          </div>
        </div>
      `;
    }).join('');
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-goal').forEach(btn => {
      btn.addEventListener('click', async () => {
        const goalId = btn.getAttribute('data-id');
        if (await deleteGoal(goalId)) {
          showAlert("Goal deleted", "success");
          displayGoals();
        }
      });
    });
  } catch (error) {
    console.error("Error displaying goals:", error);
    goalsList.innerHTML = '<p class="error">Error loading goals</p>';
  }
}

// Get goal description based on type
function getGoalDescription(goal) {
  switch (goal.type) {
    case GOAL_TYPES.DAILY:
      return `Study ${goal.target} hours today`;
    case GOAL_TYPES.WEEKLY:
      return `Study ${goal.target} hours this week`;
    case GOAL_TYPES.MONTHLY:
      return `Study ${goal.target} hours this month`;
    case GOAL_TYPES.SUBJECT:
      return `Study ${goal.target} hours of ${goal.subject}`;
    default:
      return `Complete ${goal.target} hours`;
  }
}

// Get goal unit based on type
function getGoalUnit(type) {
  return 'hours';
}

// Display user's achievements
async function displayAchievements() {
  const achievementsList = document.getElementById('achievements-list');
  if (!achievementsList) return;
  
  try {
    const userData = await getUserData();
    const achievements = userData.achievements || [];
    
    if (achievements.length === 0) {
      achievementsList.innerHTML = '<p class="empty-state">No achievements yet. Keep studying to earn some!</p>';
      return;
    }
    
    // Sort achievements by earned date
    achievements.sort((a, b) => {
      return new Date(b.earnedAt) - new Date(a.earnedAt);
    });
    
    // Render achievements
    achievementsList.innerHTML = achievements.map(achievement => {
      const earnedDate = achievement.earnedAt ? 
        formatDate(achievement.earnedAt.toDate()) : 'Recently';
      
      return `
        <div class="achievement-card">
          <div class="achievement-icon">${achievement.icon}</div>
          <div class="achievement-details">
            <h4>${achievement.name}</h4>
            <p>${achievement.description}</p>
            <p class="earned-date">Earned on ${earnedDate}</p>
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    console.error("Error displaying achievements:", error);
    achievementsList.innerHTML = '<p class="error">Error loading achievements</p>';
  }
}