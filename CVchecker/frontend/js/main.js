// Main JavaScript file for HireLens

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const tabType = this.dataset.tab || this.dataset.resultTab;
        const tabsContainer = this.closest('.tabs').parentElement;
        
        // Remove active class from all buttons and contents
        tabsContainer.querySelectorAll('.tab-btn').forEach(btn => {
          btn.classList.remove('active');
        });
        
        if (this.dataset.tab) {
          tabsContainer.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
          });
          
          // Add active class to clicked button and corresponding content
          this.classList.add('active');
          document.getElementById(`${tabType}-tab`).classList.add('active');
        } else if (this.dataset.resultTab) {
          tabsContainer.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
          });
          
          // Add active class to clicked button and corresponding content
          this.classList.add('active');
          document.getElementById(`${tabType}-tab`).classList.add('active');
        }
      });
    });
    
    // Back button functionality
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', function() {
        document.getElementById('results-section').classList.add('hidden');
        document.getElementById('upload-section').classList.remove('hidden');
      });
    }
    
    // Download PDF functionality
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', function() {
        alert('PDF download functionality will be implemented with the backend.');
      });
    }
  });