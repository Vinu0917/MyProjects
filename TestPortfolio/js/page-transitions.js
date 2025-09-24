// Enhanced Page Transitions for All Portfolio Pages
class PageTransitions {
    constructor() {
        this.pageTransition = document.querySelector('.page-transition');
        this.isTransitioning = false;
        this.currentPage = this.getCurrentPageName();
        
        this.init();
    }

    init() {
        this.createTransitionOverlay();
        this.setupNavigationHandlers();
        this.animatePageEntrance();
        this.preloadCriticalPages();
        this.handleBrowserNavigation();
    }

    createTransitionOverlay() {
        if (!this.pageTransition) {
            this.pageTransition = document.createElement('div');
            this.pageTransition.className = 'page-transition';
            document.body.appendChild(this.pageTransition);
        }
        
        // Ensure overlay starts hidden
        this.pageTransition.style.transform = 'translateX(-100%)';
        this.pageTransition.style.transition = 'transform 0.4s ease-in-out';
    }

    setupNavigationHandlers() {
        // Get all internal navigation links
        const navLinks = document.querySelectorAll(`
            .nav-links a,
            .footer-links a,
            .logo a,
            a[href$=".html"]:not([target="_blank"]),
            a[href="index.html"],
            a[href="about.html"],
            a[href="skills.html"],
            a[href="education.html"],
            a[href="projects.html"],
            a[href="contact.html"]
        `);

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Skip if external link, current page, or special links
                if (this.shouldSkipTransition(href, link)) {
                    return;
                }
                
                e.preventDefault();
                this.transitionToPage(href);
            });
        });
    }

    shouldSkipTransition(href, link) {
        return (
            !href ||
            href === '#' ||
            href.startsWith('http') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            link.hasAttribute('target') ||
            this.isCurrentPage(href) ||
            this.isTransitioning
        );
    }

    isCurrentPage(href) {
        const currentPath = window.location.pathname;
        const targetPath = href.startsWith('/') ? href : '/' + href;
        
        // Handle index.html as root
        if (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('index.html'))) {
            return true;
        }
        
        return currentPath.endsWith(href) || targetPath === currentPath;
    }

    getCurrentPageName() {
        const path = window.location.pathname;
        const fileName = path.split('/').pop() || 'index.html';
        return fileName.replace('.html', '');
    }

    async transitionToPage(href) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        await this.performTransition(href);
        this.isTransitioning = false;
    }

    async performTransition(url) {
        try {
            // Add transitioning class to body
            document.body.classList.add('page-transitioning');
            
            // Show transition overlay with slide-in effect
            if (this.pageTransition) {
                this.pageTransition.style.transform = 'translateX(0%)';
            }
            
            // Wait for transition animation
            await this.delay(200);
            
            // Navigate to new page
            window.location.href = url;
            
        } catch (error) {
            console.error('Transition error:', error);
            // Fallback to direct navigation
            window.location.href = url;
        }
    }

    animatePageExit() {
        const elements = document.querySelectorAll(`
            .fade-in, 
            .slide-in, 
            .project-card, 
            .skill-card, 
            .contact-card,
            .timeline-item,
            .certification-card,
            .hero-content,
            .about-content
        `);
        
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.transition = 'all 0.3s ease-out';
                element.style.opacity = '0.3';
                element.style.transform = 'translateY(-20px) scale(0.98)';
            }, index * 20);
        });
    }

    animatePageEntrance() {
        // Wait for DOM to be fully loaded
        setTimeout(() => {
            this.performEntranceAnimation();
        }, 100);
    }

    performEntranceAnimation() {
        const animatedElements = document.querySelectorAll(`
            .fade-in, 
            .slide-in, 
            .slide-up,
            .project-card, 
            .skill-card,
            .contact-card,
            .timeline-item,
            .certification-card,
            .hero-content,
            .about-content,
            .section-title,
            .nav-links li,
            .social-icon
        `);
        
        // Reset and animate elements with floating effect
        animatedElements.forEach((element, index) => {
            // Set initial state
            element.style.opacity = '0';
            element.style.transform = 'translateY(60px) scale(0.9)';
            element.style.transition = 'none';
            
            // Add floating entrance animation
            setTimeout(() => {
                element.classList.add('float-in');
                element.style.transition = 'all 1s cubic-bezier(0.25, 0.8, 0.25, 1)';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0) scale(1)';
                
                // Add subtle floating animation after entrance
                setTimeout(() => {
                    element.style.animation = 'subtleFloat 6s ease-in-out infinite';
                }, 1000);
            }, index * 100 + 300);
        });

        // Animate navigation separately for smoother effect
        this.animateNavigation();
        
        // Hide page transition overlay after entrance animation
        setTimeout(() => {
            if (this.pageTransition) {
                this.pageTransition.style.transform = 'translateY(-100%)';
            }
            document.body.classList.remove('page-transitioning');
        }, 400);
    }

    animateNavigation() {
        const navItems = document.querySelectorAll('.nav-links li');
        navItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                item.style.transition = 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100 + 100);
        });
    }

    handleBrowserNavigation() {
        window.addEventListener('popstate', () => {
            // Smooth reload for browser back/forward
            this.animatePageEntrance();
        });
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.isTransitioning) {
                this.isTransitioning = false;
                document.body.classList.remove('page-transitioning');
                if (this.pageTransition) {
                    this.pageTransition.style.transform = 'translateY(-100%)';
                }
            }
        });
    }

    preloadCriticalPages() {
        const pages = [
            'index.html',
            'about.html', 
            'skills.html',
            'education.html', 
            'projects.html', 
            'contact.html'
        ];
        
        pages.forEach(page => {
            if (page !== window.location.pathname.split('/').pop()) {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = page;
                document.head.appendChild(link);
            }
        });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize page transitions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PageTransitions();
});

// Simple slide-in page transitions
const transitionStyles = document.createElement('style');
transitionStyles.textContent = `
    .page-transition {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-primary);
        z-index: 9999;
        transform: translateX(-100%);
        transition: transform 0.4s ease-in-out;
    }
    
    .page-transitioning {
        overflow: hidden;
    }
    
    .page-transitioning * {
        pointer-events: none;
    }
    
    /* Fixed navigation bar */
    .main-nav {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1000;
        padding: 1rem 0;
        background: rgba(10, 25, 47, 0.95);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(100, 255, 218, 0.1);
    }
    
    /* Page content padding to account for fixed nav */
    body {
        padding-top: 80px;
    }
    
    .hero {
        padding-top: 2rem;
    }
    
    /* Simple slide-in animation for page elements */
    .slide-in-element {
        opacity: 0;
        transform: translateX(-30px);
        transition: all 0.6s ease-out;
    }
    
    .slide-in-element.visible {
        opacity: 1;
        transform: translateX(0);
    }
`;

document.head.appendChild(transitionStyles);
