// Project Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    // Initialize filter functionality
    initializeFilters();

    function initializeFilters() {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter projects with animation
                filterProjects(filter);
            });
        });
    }

    function filterProjects(filter) {
        projectCards.forEach((card, index) => {
            const categories = card.getAttribute('data-category');
            const shouldShow = filter === 'all' || categories.includes(filter);
            
            if (shouldShow) {
                // Show card with staggered animation
                setTimeout(() => {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                    
                    // Trigger animation
                    requestAnimationFrame(() => {
                        card.style.transition = 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                }, index * 100);
            } else {
                // Hide card with animation
                card.style.transition = 'all 0.3s ease';
                card.style.opacity = '0';
                card.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }

    // Add smooth scroll to projects section when filter is clicked
    function smoothScrollToProjects() {
        const projectsSection = document.querySelector('.projects-grid');
        if (projectsSection) {
            projectsSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Add click handlers for project links
    const projectLinks = document.querySelectorAll('.project-link');
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add ripple effect
            createRippleEffect(this, e);
        });
    });

    // Create ripple effect for buttons
    function createRippleEffect(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(100, 255, 218, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe project cards for scroll animations
    projectCards.forEach(card => {
        observer.observe(card);
    });

    // Add loading states for project images
    const projectImages = document.querySelectorAll('.project-image img');
    projectImages.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });

        // Add error handling for missing images
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMTEyMjQwIi8+CjxwYXRoIGQ9Ik0xNTAgNzVMMTI1IDEwMEgxNzVMMTUwIDc1WiIgZmlsbD0iIzY0RkZEQSIgZmlsbC1vcGFjaXR5PSIwLjMiLz4KPHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxMzUiIHk9IjEwNSI+CjxwYXRoIGQ9Ik0xNSAyQzguMzcgMiAzIDcuMzcgMyAxNFM4LjM3IDI2IDE1IDI2UzI3IDIwLjYzIDI3IDE0UzIxLjYzIDIgMTUgMlpNMTUgMjJDMTAuNTkgMjIgNyAxOC40MSA3IDE0UzEwLjU5IDYgMTUgNlMjMyA5LjU5IDIzIDE0UzE5LjQxIDIyIDE1IDIyWiIgZmlsbD0iIzY0RkZEQSIgZmlsbC1vcGFjaXR5PSIwLjUiLz4KPHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxMCIgeT0iMTAiPgo8Y2lyY2xlIGN4PSI1IiBjeT0iNSIgcj0iMiIgZmlsbD0iIzY0RkZEQSIgZmlsbC1vcGFjaXR5PSIwLjciLz4KPC9zdmc+Cjwvc3ZnPgo8L3N2Zz4K';
            this.alt = 'Project Image';
        });
    });
});
