var typed = new Typed(".text", {
    strings:["Frontend Developer", "Graphics Designer" ,"UI/UX Designer"],
    typeSpeed:100,
    backSpeed:100,
    backDelay:1000,
    loop:true
});

document.addEventListener("DOMContentLoaded", function () {
    const projectsWrapper = document.querySelector(".projects-wrapper");
    const scrollLeftBtn = document.querySelector(".scroll-left");
    const scrollRightBtn = document.querySelector(".scroll-right");
    
    // Add mobile menu toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navbar = document.querySelector('.navbar');
    
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navbar.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navbar.classList.remove('active');
        });
    });

    // Update active navigation based on scroll position
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar a');

    function updateActiveNav() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // Project scrolling
    let scrollAmount = 300;

    scrollLeftBtn.addEventListener("click", () => {
        projectsWrapper.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });

    scrollRightBtn.addEventListener("click", () => {
        projectsWrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    // Hide/show buttons based on scroll position
    function updateScrollButtons() {
        scrollLeftBtn.style.display = projectsWrapper.scrollLeft > 0 ? "block" : "none";
        scrollRightBtn.style.display =
            projectsWrapper.scrollLeft + projectsWrapper.clientWidth < projectsWrapper.scrollWidth
                ? "block"
                : "none";
    }

    projectsWrapper.addEventListener("scroll", updateScrollButtons);
    updateScrollButtons(); // Initialize button visibility
    
    // Form submission feedback
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const button = contactForm.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            button.textContent = 'Sending...';
            
            // This will still submit the form to Formspree
            setTimeout(() => {
                button.textContent = originalText;
            }, 3000);
        });
    }
});

