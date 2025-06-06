
// Portfolio Items
const portfolioItems = [
   /* {  
        title: 'Restaurant Campaign',
        description: 'Social media marketing campaign',
        image: 'https://via.placeholder.com/300x200?text=Social+Media+Campaign',
        category: 'social'
    },
    {
        title: 'E-learning Platform',
        description: 'Student project for online courses',
        image: 'https://via.placeholder.com/300x200?text=Student+Project',
        category: 'student'
    }*/
];

// Populate Portfolio Section if on portfolio page
const portfolioGrid = document.querySelector('.portfolio-grid');
if (portfolioGrid) {
    portfolioItems.forEach(item => {
        const portfolioCard = document.createElement('div');
        portfolioCard.className = 'portfolio-card';
        portfolioCard.setAttribute('data-category', item.category);
        portfolioCard.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="portfolio-info">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <a href="#" class="view-project">View Project</a>
            </div>
        `;
        portfolioGrid.appendChild(portfolioCard);
    });
}

// Portfolio Filtering - SINGLE IMPLEMENTATION
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    
    // Only proceed if filter buttons exist on the page
    if (filterButtons.length > 0) {
        // Initialize - ensure all items are visible by default
        portfolioCards.forEach(card => {
            card.classList.remove('hidden');
        });
        
        // Set up click event for each filter button
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Get filter value
                const filterValue = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter items
                portfolioCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
        
        // Trigger click on "All" button to initialize filtering
        const allButton = document.querySelector('.filter-btn[data-filter="all"]');
        if (allButton) {
            allButton.click();
        }
    }
});

// Pricing Toggle
const billingToggle = document.getElementById('billing-toggle');
if (billingToggle) {
    const prices = document.querySelectorAll('.amount');
    const periods = document.querySelectorAll('.period');
    
    const monthlyPrices = ['5,000', '10,000', '20,000'];
    const yearlyPrices = ['48,000', '96,000', '192,000'];

    billingToggle.addEventListener('change', () => {
        const isYearly = billingToggle.checked;
        prices.forEach((price, index) => {
            price.textContent = isYearly ? yearlyPrices[index] : monthlyPrices[index];
            periods[index].textContent = isYearly ? '/year' : '/month';
        });
    });
}

// Contact Form Submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Display loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Get the service text value instead of the value attribute
        const serviceSelect = document.getElementById('service');
        const serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;
        
        // Create template parameters object with the service text
        const templateParams = {
            name: data.name,
            email: data.email,
            service: serviceText, // Use the display text instead of the value
            message: data.message
        };
        
        // Send the email using EmailJS with template parameters
        emailjs.send('Merge_Minds', 'template_5ixxiwe', templateParams)
            .then(() => {
                // Show success message
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
                console.log('Email sent successfully!');
            })
            .catch((error) => {
                // Show error message
                alert('Oops! Something went wrong. Please try again later.');
                console.error('Email sending failed:', error);
            })
            .finally(() => {
                // Reset button state
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
    });
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .about-content, .portfolio-card, .pricing-card, .contact-info-card, .contact-form-card, .faq-item').forEach(el => {
    observer.observe(el);
});

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    .service-card, .about-content, .portfolio-card, .pricing-card, .contact-info-card, .contact-form-card, .faq-item {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .animate {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});