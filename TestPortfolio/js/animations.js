// Text animations
document.addEventListener('DOMContentLoaded', () => {
    // Typewriter effect for changing text
    if (document.getElementById('changing-text')) {
        const texts = ['Frontend Developer', 'Graphics Designer', 'UI/UX Designer'];
        let count = 0;
        let index = 0;
        let currentText = '';
        let isDeleting = false;
        
        // Create text span and cursor span
        const textSpan = document.createElement('span');
        const cursorSpan = document.createElement('span');
        cursorSpan.classList.add('typing-cursor');
        cursorSpan.textContent = '|';
        
        const changingTextElement = document.getElementById('changing-text');
        changingTextElement.innerHTML = ''; // Clear existing content
        changingTextElement.appendChild(textSpan);
        changingTextElement.appendChild(cursorSpan);
        
        function type() {
            const current = count % texts.length;
            const fullText = texts[current];

            if (isDeleting) {
                currentText = fullText.substring(0, index - 1);
                index--;
            } else {
                currentText = fullText.substring(0, index + 1);
                index++;
            }

            textSpan.textContent = currentText;

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && index === fullText.length) {
                // Pause at end of typing
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && index === 0) {
                isDeleting = false;
                count++;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }

        type();
    }
    
    // Scroll animations using Intersection Observer
    const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-in-left, .slide-in-right');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
});