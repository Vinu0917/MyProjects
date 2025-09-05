// Navigation menu toggle for mobile view
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    // Toggle Navigation
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        
        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Burger Animation
        burger.classList.toggle('toggle');
    });
};

// Smooth scrolling for navigation links
const smoothScroll = () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Check if the link has a hash
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Handle the hero CTA button separately to scroll to packages section
    const ctaButton = document.querySelector('.hero .cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            const packagesSection = document.querySelector('#packages');
            if (packagesSection) {
                window.scrollTo({
                    top: packagesSection.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    }
};
// Initialize all functions
const app = () => {
    navSlide();
    smoothScroll();
};

// Run when DOM is fully loaded
document.addEventListener('DOMContentLoaded', app);