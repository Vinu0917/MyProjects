document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const usernameInput = document.getElementById('username');
    const ageSelect = document.getElementById('age');
    const avatars = document.querySelectorAll('.avatar');
    const submitButton = document.getElementById('submit-profile');
    
    // Profile Card Elements
    const profileName = document.getElementById('profile-name');
    const profileAge = document.getElementById('profile-age');
    const profileAvatar = document.getElementById('selected-avatar');
    
    // Validation Elements
    const usernameValidation = document.getElementById('username-validation');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const closeNotification = document.getElementById('close-notification');
    
    // State variables
    let selectedAvatar = 'avatar1';

    // Username validation
    usernameInput.addEventListener('input', function() {
        validateUsername();
    });
    
    function validateUsername() {
        const username = usernameInput.value;
        
        // Scenario 1: Must be 7 characters starting with "s"
        if (!/^s.{6}$/.test(username)) {
            usernameValidation.textContent = "✗ You have not entered a seven-character string starting with 's'";
            usernameValidation.className = 'validation-message error';
            return false;
        }
        
        usernameValidation.textContent = "✓ Valid Username";
        usernameValidation.className = 'validation-message success';
        return true;
    }
    
    // Avatar selection
    avatars.forEach(avatar => {
        avatar.addEventListener('click', function() {
            // Remove selected class from all avatars
            avatars.forEach(a => a.classList.remove('selected'));
            
            // Add selected class to clicked avatar
            this.classList.add('selected');
            
            // Update selected avatar
            selectedAvatar = this.getAttribute('data-avatar');
        });
    });
    
    // Submit profile
    submitButton.addEventListener('click', function() {
        if (!validateForm()) {
            return;
        }
        
        // Update profile card
        updateProfileCard();
        
        showNotification("Profile created successfully!", true);
    });
    
    function validateForm() {
        // Check username
        if (!validateUsername()) {
            showNotification("Please enter a valid username", false);
            return false;
        }
        
        // Check if avatar is selected
        if (!selectedAvatar) {
            showNotification("Please select an avatar", false);
            return false;
        }
        
        return true;
    }
    
    // Add these lines to your existing DOM Elements section
    const studentNameInput = document.getElementById('student-name');
    const studentIdInput = document.getElementById('student-id');
    const courseNameInput = document.getElementById('course-name');
    
    // Add this to your updateProfileCard function
    function updateProfileCard() {
        // Update name
        profileName.textContent = usernameInput.value || "[Your Name]";
        
        // Update age
        profileAge.textContent = ageSelect.options[ageSelect.selectedIndex].text;
        
        // Update avatar
        profileAvatar.src = `images/${selectedAvatar}.png`;
        
        // You might want to add student info to the profile card as well
        // This is optional based on your requirements
    }
    
    // Add event listeners for the new input fields
    studentNameInput.addEventListener('input', function() {
        // You can add validation here if needed
    });
    
    studentIdInput.addEventListener('input', function() {
        // You can add validation here if needed
    });
    
    courseNameInput.addEventListener('input', function() {
        // You can add validation here if needed
    });
    
    function showNotification(message, isSuccess) {
        notificationMessage.textContent = message;
        notification.className = isSuccess ? 'notification success' : 'notification';
        notification.style.display = 'block';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    }
    
    // Close notification
    closeNotification.addEventListener('click', function() {
        notification.style.display = 'none';
    });
    
    // Initialize the first avatar as selected
    avatars[0].classList.add('selected');
});