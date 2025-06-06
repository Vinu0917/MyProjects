document.addEventListener('DOMContentLoaded', function() {
    // Get all "Learn More" buttons
    const learnMoreButtons = document.querySelectorAll('.course-card .btn');
    
    // Add click event listener to each button
    learnMoreButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            // Get the course name from the previous h2 element
            const courseCard = this.closest('.course-card');
            const courseName = courseCard.querySelector('h2').textContent;
            
            // Show alert with course name
            alert(`Redirecting to: ${courseName}`);
            
            // The default link behavior will continue after the alert
        });
    });
});