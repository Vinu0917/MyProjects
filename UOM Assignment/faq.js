document.addEventListener('DOMContentLoaded', function() {
    // Get all FAQ items
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Add click event listener to each FAQ item heading
    faqItems.forEach(item => {
        const heading = item.querySelector('h3');
        const answer = item.querySelector('.faq-answer');
        
        // Initially hide all answers
        answer.style.display = 'none';
        
        // Add a plus/minus icon to indicate expandable content
        const icon = document.createElement('span');
        icon.classList.add('faq-toggle-icon');
        icon.innerHTML = '+';
        heading.appendChild(icon);
        
        // Add click event to toggle answer visibility
        heading.addEventListener('click', () => {
            // Toggle the answer visibility
            if (answer.style.display === 'none') {
                answer.style.display = 'block';
                icon.innerHTML = '−'; // Minus sign
                item.classList.add('active');
            } else {
                answer.style.display = 'none';
                icon.innerHTML = '+';
                item.classList.remove('active');
            }
        });
    });
});