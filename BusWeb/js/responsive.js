/**
 * Responsive Navigation Menu
 * Handles the hamburger menu toggle functionality for mobile devices
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    // Toggle menu visibility when hamburger is clicked
    hamburgerMenu.addEventListener('click', function() {
        // Toggle active class on hamburger
        this.classList.toggle('active');
        
        // Toggle menu visibility
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on links (for mobile)
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                hamburgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = hamburgerMenu.contains(event.target) || navMenu.contains(event.target);
        
        if (!isClickInside && navMenu.classList.contains('active') && window.innerWidth <= 768) {
            hamburgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Close menu when window is resized to desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            hamburgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});