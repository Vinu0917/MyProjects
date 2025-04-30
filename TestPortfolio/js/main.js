// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use the system preference
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Set the initial theme
    if (currentTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
    }
    
    // Toggle theme when the button is clicked
    themeToggle.addEventListener('click', () => {
        let theme = 'dark';
        
        if (document.body.getAttribute('data-theme') === 'dark') {
            document.body.setAttribute('data-theme', 'light');
            theme = 'light';
        } else {
            document.body.removeAttribute('data-theme');
        }
        
        // Save the preference
        localStorage.setItem('theme', theme);
    });
    
    // Mobile navigation
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileNav = document.createElement('div');
    mobileNav.classList.add('mobile-nav');
    
    // Clone the navigation links for mobile
    const navLinks = document.querySelector('.nav-links ul').cloneNode(true);
    
    // Create close button
    const closeMenu = document.createElement('div');
    closeMenu.classList.add('close-menu');
    closeMenu.innerHTML = '&times;';
    
    // Append elements to mobile nav
    mobileNav.appendChild(closeMenu);
    mobileNav.appendChild(navLinks);
    
    // Only append to body when hamburger menu is clicked
    hamburgerMenu.addEventListener('click', () => {
        document.body.appendChild(mobileNav);
        mobileNav.classList.add('active');
    });
    
    closeMenu.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        // Remove from DOM after animation completes
        setTimeout(() => {
            if (mobileNav.parentNode) {
                mobileNav.parentNode.removeChild(mobileNav);
            }
        }, 300); // Match this to your CSS transition time
    });
    
    // Close mobile nav when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            // Remove from DOM after animation completes
            setTimeout(() => {
                if (mobileNav.parentNode) {
                    mobileNav.parentNode.removeChild(mobileNav);
                }
            }, 300); // Match this to your CSS transition time
        });
    });
    
    // Scroll effects
    const header = document.querySelector('.main-nav');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add background to header on scroll
        if (scrollTop > 50) {
            header.classList.add('glass-nav');
        } else {
            header.classList.remove('glass-nav');
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Initialize FontAwesome
    if (typeof window.FontAwesome === 'undefined') {
        const fontAwesomeScript = document.createElement('script');
        fontAwesomeScript.src = 'https://kit.fontawesome.com/a076d05399.js';
        fontAwesomeScript.crossOrigin = 'anonymous';
        document.head.appendChild(fontAwesomeScript);
    }
});