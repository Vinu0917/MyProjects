// Results handling for HireLens

function populateResults(results) {
    // Update score
    const scoreValue = document.getElementById('score-value');
    const scoreMessage = document.getElementById('score-message');
    const scoreFill = document.getElementById('score-fill');
    
    if (scoreValue && scoreFill) {
      // Animate score counter
      animateCounter(scoreValue, 0, results.fitScore, 1500);
      
      // Set score circle fill
      scoreFill.style.strokeDasharray = `${results.fitScore}, 100`;
      
      // Set color based on score
      if (results.fitScore > 75) {
        scoreFill.style.stroke = '#10B981'; // Green
        scoreMessage.textContent = "Great match! Your CV aligns well with this job.";
      } else if (results.fitScore > 50) {
        scoreFill.style.stroke = '#F59E0B'; // Yellow
        scoreMessage.textContent = "Good potential. Some improvements needed.";
      } else {
        scoreFill.style.stroke = '#EF4444'; // Red
        scoreMessage.textContent = "Needs significant improvements to match this job.";
      }
    }
    
    // Populate matching skills
    const matchingSkillsList = document.getElementById('matching-skills');
    if (matchingSkillsList) {
      matchingSkillsList.innerHTML = '';
      results.matchingSkills.forEach(skill => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-check-circle"></i> ${skill}`;
        matchingSkillsList.appendChild(li);
      });
    }
    
    // Populate missing skills
    const missingSkillsList = document.getElementById('missing-skills');
    if (missingSkillsList) {
      missingSkillsList.innerHTML = '';
      results.missingSkills.forEach(skill => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-times-circle"></i> ${skill}`;
        missingSkillsList.appendChild(li);
      });
    }
    
    // Populate detailed missing skills
    const detailedMissingSkills = document.getElementById('detailed-missing-skills');
    if (detailedMissingSkills) {
      detailedMissingSkills.innerHTML = '';
      results.missingSkills.forEach(skill => {
        const li = document.createElement('li');
        li.innerHTML = `
          <i class="fas fa-exclamation-circle"></i>
          <div>
            <strong>${skill}</strong>
            <p>This skill appears prominently in the job description.</p>
          </div>
        `;
        detailedMissingSkills.appendChild(li);
      });
    }
    
    // Populate buzzwords
    const buzzwordsList = document.getElementById('buzzwords-list');
    if (buzzwordsList) {
      buzzwordsList.innerHTML = '';
      results.overusedBuzzwords.forEach(word => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = word;
        buzzwordsList.appendChild(span);
      });
    }
    
    // Populate ATS issues
    const atsIssuesCount = document.getElementById('ats-issues-count');
    const atsIssues = document.getElementById('ats-issues');
    
    if (atsIssuesCount && atsIssues) {
      atsIssuesCount.textContent = `We found ${results.atsIssues.length} potential issues that might affect how your CV is parsed by ATS systems.`;
      
      atsIssues.innerHTML = '';
      results.atsIssues.forEach((issue, index) => {
        const div = document.createElement('div');
        div.className = 'ats-issue';
        div.innerHTML = `
          <div class="flex items-start">
            <i class="fas fa-exclamation-circle text-red-500 mr-3"></i>
            <div>
              <h5>Issue #${index + 1}</h5>
              <p>${issue}</p>
            </div>
          </div>
        `;
        atsIssues.appendChild(div);
      });
    }
    
    // Populate improvement suggestions
    const suggestionsList = document.getElementById('suggestions-list');
    if (suggestionsList) {
      suggestionsList.innerHTML = '';
      results.improvementSuggestions.forEach(suggestion => {
        const div = document.createElement('div');
        div.className = 'suggestion';
        div.innerHTML = `
          <h5>Original Text:</h5>
          <div class="suggestion-original">${suggestion.original}</div>
          <h5>Improved Version:</h5>
          <div class="suggestion-improved">${suggestion.improved}</div>
        `;
        suggestionsList.appendChild(div);
      });
    }
    
    // Populate courses
    const coursesList = document.getElementById('courses-list');
    if (coursesList) {
      coursesList.innerHTML = '';
      results.courses.forEach(course => {
        const div = document.createElement('div');
        div.className = 'course-card';
        div.innerHTML = `
          <h5>${course.name}</h5>
          <p class="course-provider">Provider: ${course.provider}</p>
          <a href="${course.url}" target="_blank" class="text-primary">View Course →</a>
        `;
        coursesList.appendChild(div);
      });
    }
  }
  
  // Helper function to animate counter
  function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.textContent = value;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }