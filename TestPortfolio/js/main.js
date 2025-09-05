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
        
        if (document.body.getAttribute('data-theme') === 'light') {
            document.body.removeAttribute('data-theme');
            theme = 'dark';
        } else {
            document.body.setAttribute('data-theme', 'light');
            theme = 'light';
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

    // Remove or comment out this entire block
    /*
    // Initialize FontAwesome
    if (typeof window.FontAwesome === 'undefined') {
        const fontAwesomeScript = document.createElement('script');
        fontAwesomeScript.src = 'https://kit.fontawesome.com/a076d05399.js';
        fontAwesomeScript.crossOrigin = 'anonymous';
        document.head.appendChild(fontAwesomeScript);
    }
    */
    
    // CV Download tracking
    const cvDownloadBtn = document.querySelector('a[download]');
    
    if (cvDownloadBtn) {
        cvDownloadBtn.addEventListener('click', function() {
            console.log('CV Downloaded');
            // You could add analytics tracking here
            
            // Optional: Show a thank you message
            setTimeout(() => {
                alert('Thank you for downloading my CV!');
            }, 1000);
        });
    }
    
    // -------------------------------
    // EmailJS Initialization
    // -------------------------------
    try {
        emailjs.init("hMMPegsKz7T3LUPef");
        console.log("EmailJS initialized successfully.");
    } catch (error) {
        console.error("EmailJS initialization failed:", error);
    }
    
    // -------------------------------
    // Newsletter Form Submission
    // -------------------------------
    const newsletterForms = document.querySelectorAll('.newsletter-form');

    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = this.querySelector('.newsletter-input');
            const email = emailInput.value.trim();

            // Basic email validation
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            
            // Check specifically for spaces in the email
            if (email.includes(' ')) {
                return showNewsletterMessage(form, 'Email address cannot contain spaces', 'error');
            }
            
            if (!email) return showNewsletterMessage(form, 'Please enter your email address', 'error');
            if (!emailRegex.test(email)) return showNewsletterMessage(form, 'Please enter a valid email address', 'error');

            // Store email locally
            const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
            if (!subscribers.includes(email)) {
                subscribers.push(email);
                localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
            }

            // Prepare email template parameters
            const templateParams = {
                email: email,
                to_email: email,
                from_email: 'graphixlab0917@gmail.com',
                from_name: 'Graphix Lab',
                reply_to: 'graphixlab0917@gmail.com',
                subject: 'Newsletter Subscription',
                content: 'Thank you for subscribing to our newsletter!',
                message: 'Thank you for subscribing to our newsletter!'
            };
            
            console.log("Sending email to: " + email); // Add this line
            // Check if EmailJS is loaded
            if (typeof emailjs === 'undefined') {
                console.error("EmailJS is not loaded yet.");
                return showNewsletterMessage(form, 'Email service not available. Try again later.', 'error');
            }

            // Send email
            console.log('Email being validated:', email);
            console.log('Validation result:', emailRegex.test(email));
            emailjs.send("Graphix_Lab", "template_pcqfi3g", templateParams)
                .then(response => {
                    console.log('Email sent successfully:', response);
                    showNewsletterMessage(form, 'Thank you for subscribing!', 'success');
                    emailInput.value = '';
                })
                .catch(error => {
                    console.error('Email failed to send:', error);
                    console.error('Error details:', JSON.stringify(error));
                    console.error('Template params:', JSON.stringify(templateParams));
                    console.error('Service ID:', "Graphix_Lab");
                    console.error('Template ID:', "template_pcqfi3g");
                    showNewsletterMessage(form, 'Subscription saved, but email failed to send. Check console for details.', 'error');
                    emailInput.value = '';
                });
        });
    });

    // Helper function to show newsletter messages
    function showNewsletterMessage(form, message, type) {
        const messageElement = form.querySelector('.newsletter-message') || document.createElement('div');
        messageElement.className = `newsletter-message ${type}`;
        messageElement.textContent = message;
        
        if (!form.querySelector('.newsletter-message')) {
            form.appendChild(messageElement);
        }
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageElement.style.opacity = '0';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 300);
        }, 5000);
    }
});