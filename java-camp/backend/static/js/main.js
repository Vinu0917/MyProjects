// Smooth scroll for internal nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
  
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Handle Login button click
  document.querySelector('.login')?.addEventListener('click', () => {
    alert('Login button clicked!');
    // You can redirect or open a modal here
  });
  
  // Handle Signup button click
  document.querySelector('.signup')?.addEventListener('click', () => {
    alert('Signup button clicked!');
    // You can redirect or open a modal here
  });
  
  // Optional: Intersection Observer for animations
  const revealElements = document.querySelectorAll('.hero-text, .hero-image, .footer-container');
  
  const revealOnScroll = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  };
  
  const observer = new IntersectionObserver(revealOnScroll, {
    threshold: 0.1
  });
  
  revealElements.forEach(el => observer.observe(el));
  
  // Add class to CSS for animation
  const style = document.createElement('style');
  style.textContent = `
    .reveal {
      opacity: 1;
      transform: translateY(0);
      transition: all 0.8s ease-out;
    }
    
    .hero-text, .hero-image, .footer-container {
      opacity: 0;
      transform: translateY(20px);
    }
  `;
  document.head.appendChild(style);
  