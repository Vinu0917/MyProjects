// Smooth scrolling and scroll effects
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Locomotive Scroll if available
    if (typeof LocomotiveScroll !== 'undefined') {
        const scroll = new LocomotiveScroll({
            el: document.querySelector('[data-scroll-container]'),
            smooth: true,
            multiplier: 1,
            lerp: 0.1
        });
        
        // Update scroll on window resize
        window.addEventListener('resize', () => {
            scroll.update();
        });
    } else {
        console.warn('Locomotive Scroll not loaded. Falling back to native scroll.');
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Use Locomotive Scroll if available
                if (typeof LocomotiveScroll !== 'undefined' && scroll) {
                    scroll.scrollTo(targetElement);
                } else {
                    // Fallback to native smooth scroll
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Parallax effect for elements with data-parallax attribute
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-parallax') || 0.5;
            element.style.transform = `translateY(${scrollTop * speed}px)`;
        });
    });
    
    // Scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
        
        // Scroll down when clicking the scroll indicator
        scrollIndicator.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }
    
    // Scroll animations using GSAP and ScrollTrigger
    // FIXED: Remove the nested DOMContentLoaded and place code directly here
    // Initialize GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Reveal animations for elements with .reveal-element class
        const revealElements = document.querySelectorAll('.reveal-element');
        revealElements.forEach(element => {
            gsap.fromTo(element, 
                { y: 50, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.8, 
                    scrollTrigger: {
                        trigger: element,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });
        
        // Staggered animations for elements with .stagger-reveal class
        const staggerContainers = document.querySelectorAll('.stagger-reveal');
        staggerContainers.forEach(container => {
            const elements = container.children;
            gsap.fromTo(elements, 
                { y: 20, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.5, 
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: container,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });
        
        // Parallax effect for profile image
        const profileImage = document.querySelector('.profile-image-container');
        if (profileImage) {
            gsap.to(profileImage, {
                y: -50,
                scrollTrigger: {
                    trigger: '.hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }
        
        // Initialize animations for skill cards
        const skillCards = document.querySelectorAll('.skill-card');
        if (skillCards.length > 0) {
            gsap.fromTo(skillCards, 
                { y: 30, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.6, 
                    stagger: 0.15,
                    scrollTrigger: {
                        trigger: skillCards[0].parentElement,
                        start: "top 75%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }
        
        // Initialize animations for tool items
        const toolItems = document.querySelectorAll('.tool-item');
        if (toolItems.length > 0) {
            gsap.fromTo(toolItems, 
                { y: 20, opacity: 0 },
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.4, 
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: toolItems[0].parentElement,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }
    }
    
    // Tilt effect for cards with class .tilt-card
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
    
    // Enhanced typewriter effect
    const changingText = document.getElementById('changing-text');
    if (changingText) {
        const words = ['beautiful websites', 'interactive experiences', 'creative solutions', 'modern interfaces'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;
        
        function typeEffect() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                changingText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                changingText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }
            
            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 1000; // Pause at the end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pause before typing next word
            }
            
            setTimeout(typeEffect, typeSpeed);
        }
        
        typeEffect();
    }
});