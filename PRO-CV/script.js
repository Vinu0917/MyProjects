document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 50,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animation to skill tags
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach((tag, index) => {
        tag.style.animationDelay = `${index * 0.05}s`;
        tag.classList.add('animate-in');
    });
    
    // Add animation to project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    // Function to check if an element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Function to handle scroll animations
    function handleScrollAnimations() {
        projectCards.forEach(card => {
            if (isInViewport(card)) {
                card.classList.add('animate-in');
            }
        });
    }
    
    // Initial check for elements in viewport
    handleScrollAnimations();
    
    // Listen for scroll events
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Print/PDF functionality with page count check
    document.querySelector('.print-button button').addEventListener('click', function() {
        // Add a temporary listener for afterprint event
        window.addEventListener('afterprint', function checkPageCount() {
            // Remove the listener after it runs once
            window.removeEventListener('afterprint', checkPageCount);
            
            // Check if we can access the page count (only works in some browsers)
            setTimeout(() => {
                // This is a visual reminder for the user about the 2-page goal
                alert('Your CV should now be condensed to 2 pages. If it\'s still longer, try adjusting your content or using your browser\'s print preview to check page count.');
            }, 500);
        });
        
        window.print();
    });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeIn 0.5s ease forwards;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .skill-tag, .project-card {
        opacity: 0;
    }
`;
document.head.appendChild(style);