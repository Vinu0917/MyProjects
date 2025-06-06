document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const studyForm = document.getElementById('study-form');
    const studyLogs = document.getElementById('study-logs').querySelector('tbody');
    
    // Load existing study logs from localStorage
    loadStudyLogs();
    
    // Add event listener for form submission
    studyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const subject = document.getElementById('subject').value;
        const hours = document.getElementById('hours').value;
        const date = document.getElementById('date').value;
        
        // Add new study log
        addStudyLog(subject, hours, date);
        
        // Reset form
        studyForm.reset();
    });
    
    // Function to add a new study log
    function addStudyLog(subject, hours, date) {
        // Create a unique ID for the log
        const logId = Date.now().toString();
        
        // Create log object
        const log = {
            id: logId,
            subject: subject,
            hours: hours,
            date: date
        };
        
        // Save to localStorage
        saveStudyLog(log);
        
        // Add to UI
        displayStudyLog(log);
        
        // Show "Log added!" alert
        showAlert("Log added!");
    }
    
    // Function to save study log to localStorage
    function saveStudyLog(log) {
        let logs = JSON.parse(localStorage.getItem('studyLogs')) || [];
        logs.push(log);
        localStorage.setItem('studyLogs', JSON.stringify(logs));
    }
    
    // Function to display study log in the UI
    function displayStudyLog(log) {
        const row = document.createElement('tr');
        row.setAttribute('data-id', log.id);
        
        // Format the date for display
        const formattedDate = new Date(log.date).toLocaleDateString();
        
        row.innerHTML = `
            <td>${log.subject}</td>
            <td>${log.hours}</td>
            <td>${formattedDate}</td>
            <td><button class="delete-btn" data-id="${log.id}">Delete</button></td>
        `;
        
        // Add delete event listener
        row.querySelector('.delete-btn').addEventListener('click', function() {
            deleteStudyLog(log.id);
        });
        
        studyLogs.appendChild(row);
    }
    
    // Function to load study logs from localStorage
    function loadStudyLogs() {
        const logs = JSON.parse(localStorage.getItem('studyLogs')) || [];
        logs.forEach(log => displayStudyLog(log));
    }
    
    // Function to delete a study log
    function deleteStudyLog(id) {
        // Remove from localStorage
        let logs = JSON.parse(localStorage.getItem('studyLogs')) || [];
        logs = logs.filter(log => log.id !== id);
        localStorage.setItem('studyLogs', JSON.stringify(logs));
        
        // Remove from UI
        const row = studyLogs.querySelector(`tr[data-id="${id}"]`);
        if (row) {
            row.remove();
        }
    }
    
    // Function to show alert message
    function showAlert(message) {
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert';
        alertDiv.textContent = message;
        
        // Add alert to the page
        document.querySelector('.form-container').appendChild(alertDiv);
        
        // Remove alert after 3 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
});