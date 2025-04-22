// Upload handling for HireLens

document.addEventListener('DOMContentLoaded', function() {
    // File upload handling
    const cvFileInput = document.getElementById('cv-file');
    const cvDropArea = document.getElementById('cv-drop');
    const cvFileName = document.getElementById('cv-file-name');
    
    const jobFileInput = document.getElementById('job-file');
    const jobDropArea = document.getElementById('job-drop');
    const jobFileName = document.getElementById('job-file-name');
    
    // CV file upload
    if (cvDropArea && cvFileInput) {
      cvDropArea.addEventListener('click', function() {
        cvFileInput.click();
      });
      
      cvFileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
          cvFileName.textContent = this.files[0].name;
          cvDropArea.classList.add('has-file');
        }
      });
      
      // Drag and drop for CV
      setupDragAndDrop(cvDropArea, cvFileInput, cvFileName);
    }
    
    // Job file upload
    if (jobDropArea && jobFileInput) {
      jobDropArea.addEventListener('click', function() {
        jobFileInput.click();
      });
      jobFileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
          jobFileName.textContent = this.files[0].name;
          jobDropArea.classList.add('has-file');
        }
      });
      
      // Drag and drop for job description
      setupDragAndDrop(jobDropArea, jobFileInput, jobFileName);
    }
    
    // Form submission
    const uploadForm = document.getElementById('upload-form');
    const analyzeBtn = document.getElementById('analyze-btn');
    const btnText = analyzeBtn.querySelector('.btn-text');
    const spinner = analyzeBtn.querySelector('.spinner');
    
    if (uploadForm) {
      uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate inputs
        const cvFile = cvFileInput.files[0];
        let jobData;
        
        // Check which tab is active
        const fileTabActive = document.getElementById('file-tab').classList.contains('active');
        
        if (fileTabActive) {
          jobData = jobFileInput.files[0];
          if (!jobData) {
            alert('Please upload a job description file');
            return;
          }
        } else {
          const jobText = document.getElementById('job-text').value.trim();
          if (!jobText) {
            alert('Please enter a job description');
            return;
          }
          jobData = jobText;
        }
        
        if (!cvFile) {
          alert('Please upload your CV/Resume');
          return;
        }
        
        // Show loading state
        btnText.textContent = 'Analyzing...';
        spinner.classList.remove('hidden');
        analyzeBtn.disabled = true;
        
        // Prepare form data
        const formData = new FormData();
        formData.append('cv', cvFile);
        
        if (fileTabActive) {
          formData.append('job_file', jobData);
        } else {
          formData.append('job_text', jobData);
        }
        
        // Send to backend (for now we'll simulate with setTimeout)
        setTimeout(function() {
          // Hide loading state
          btnText.textContent = 'Analyze My CV';
          spinner.classList.add('hidden');
          analyzeBtn.disabled = false;
          
          // Show results section
          document.getElementById('upload-section').classList.add('hidden');
          document.getElementById('results-section').classList.remove('hidden');
          
          // Populate with mock data
          populateResults(getMockResults());
        }, 2000);
        
        // In a real implementation, you would use fetch:
        /*
        fetch('/api/analyze', {
          method: 'POST',
          body: formData
        })
        .then(response => response.json())
        .then(data => {
          // Hide loading state
          btnText.textContent = 'Analyze My CV';
          spinner.classList.add('hidden');
          analyzeBtn.disabled = false;
          
          // Show results section
          document.getElementById('upload-section').classList.add('hidden');
          document.getElementById('results-section').classList.remove('hidden');
          
          // Populate with real data
          populateResults(data);
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An error occurred during analysis. Please try again.');
          
          // Hide loading state
          btnText.textContent = 'Analyze My CV';
          spinner.classList.add('hidden');
          analyzeBtn.disabled = false;
        });
        */
      });
    }
});

// Helper function for drag and drop
function setupDragAndDrop(dropArea, fileInput, fileNameElement) {
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
  });
  
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  ['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
  });
  
  ['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
  });
  
  function highlight() {
    dropArea.classList.add('highlight');
  }
  
  function unhighlight() {
    dropArea.classList.remove('highlight');
  }
  
  dropArea.addEventListener('drop', handleDrop, false);
  
  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
      fileInput.files = files;
      fileNameElement.textContent = files[0].name;
      dropArea.classList.add('has-file');
    }
  }
}

// Mock results for testing
function getMockResults() {
  return {
    fitScore: 78,
    matchingSkills: ['Python', 'Data Analysis', 'SQL', 'Machine Learning'],
    missingSkills: ['TensorFlow', 'Kubernetes'],
    overusedBuzzwords: ['Team player', 'Detail-oriented', 'Hard worker', 'Self-starter'],
    atsIssues: [
      'Header not properly parsed',
      'Education section missing dates',
      'Inconsistent formatting detected',
      'Tables used in layout (not ATS-friendly)'
    ],
    improvementSuggestions: [
      {
        original: "Worked on customer service.",
        improved: "Resolved 50+ customer inquiries weekly with a 95% satisfaction rate."
      },
      {
        original: "Helped with data analysis.",
        improved: "Analyzed 2TB of customer data to identify key trends, resulting in 15% revenue growth."
      },
      {
        original: "Managed team projects.",
        improved: "Led cross-functional team of 8 members to deliver 3 high-priority projects ahead of schedule."
      }
    ],
    courses: [
      { name: 'TensorFlow for Beginners', provider: 'Coursera', url: 'https://coursera.org' },
      { name: 'Kubernetes Essentials', provider: 'LinkedIn Learning', url: 'https://linkedin.com/learning' }
    ]
  };
}