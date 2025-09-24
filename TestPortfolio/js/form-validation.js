// Enhanced Form Validation and Submission
class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.formStatus = document.getElementById('form-status');
        this.successMessage = document.querySelector('.success-message');
        this.errorMessage = document.querySelector('.error-message');
        this.submitBtn = this.form.querySelector('.primary-btn');
        this.originalBtnText = this.submitBtn.innerHTML;
        
        this.init();
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.addRealTimeValidation();
        this.addInputAnimations();
    }

    addRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    addInputAnimations() {
        const formGroups = this.form.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            const label = group.querySelector('label');
            
            // Add focus animations
            input.addEventListener('focus', () => {
                group.classList.add('focused');
                this.addRippleEffect(input);
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    group.classList.remove('focused');
                }
            });
        });
    }

    addRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.className = 'input-ripple';
        element.parentNode.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        this.clearFieldError(field);

        switch (fieldName) {
            case 'name':
                if (!value) {
                    errorMessage = 'Name is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    errorMessage = 'Name can only contain letters and spaces';
                    isValid = false;
                }
                break;

            case 'email':
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!this.isValidEmail(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;

            case 'subject':
                if (value && value.length < 3) {
                    errorMessage = 'Subject must be at least 3 characters';
                    isValid = false;
                }
                break;

            case 'message':
                if (!value) {
                    errorMessage = 'Message is required';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Message must be at least 10 characters';
                    isValid = false;
                } else if (value.length > 1000) {
                    errorMessage = 'Message must be less than 1000 characters';
                    isValid = false;
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(field, message) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.add('error');
        
        // Remove existing error message
        const existingError = formGroup.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        formGroup.appendChild(errorElement);
        
        // Add shake animation
        field.classList.add('shake');
        setTimeout(() => field.classList.remove('shake'), 500);
    }

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
        
        const errorElement = formGroup.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    validateForm() {
        const fields = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate form
        if (!this.validateForm()) {
            this.showMessage('error', 'Please fix the errors above and try again.');
            return;
        }

        // Show loading state
        this.setLoadingState(true);

        try {
            // Simulate form submission (replace with actual API call)
            await this.submitForm();
            
            // Show success message
            this.showMessage('success', 'Thank you! Your message has been sent successfully. I\'ll get back to you soon!');
            
            // Reset form
            this.form.reset();
            this.clearAllErrors();
            
            // Add success animation
            this.addSuccessAnimation();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('error', 'Oops! Something went wrong. Please try again later.');
        } finally {
            this.setLoadingState(false);
        }
    }

    async submitForm() {
        // Simulate API call delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure for demo
                const success = Math.random() > 0.1; // 90% success rate
                if (success) {
                    resolve();
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }

    setLoadingState(isLoading) {
        if (isLoading) {
            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = `
                <span class="loading-spinner"></span>
                <span>Sending...</span>
            `;
            this.submitBtn.classList.add('loading');
        } else {
            this.submitBtn.disabled = false;
            this.submitBtn.innerHTML = this.originalBtnText;
            this.submitBtn.classList.remove('loading');
        }
    }

    showMessage(type, message) {
        // Hide all messages first
        this.successMessage.style.display = 'none';
        this.errorMessage.style.display = 'none';
        
        // Show appropriate message
        if (type === 'success') {
            this.successMessage.textContent = message;
            this.successMessage.style.display = 'block';
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                this.successMessage.style.display = 'none';
            }, 5000);
        } else {
            this.errorMessage.textContent = message;
            this.errorMessage.style.display = 'block';
            
            // Auto-hide after 7 seconds
            setTimeout(() => {
                this.errorMessage.style.display = 'none';
            }, 7000);
        }
    }

    clearAllErrors() {
        const errorElements = this.form.querySelectorAll('.field-error');
        errorElements.forEach(error => error.remove());
        
        const errorGroups = this.form.querySelectorAll('.form-group.error');
        errorGroups.forEach(group => group.classList.remove('error'));
    }

    addSuccessAnimation() {
        const formContainer = document.querySelector('.contact-form-container');
        formContainer.classList.add('success-pulse');
        
        setTimeout(() => {
            formContainer.classList.remove('success-pulse');
        }, 1000);
    }
}

// Character counter for textarea
class CharacterCounter {
    constructor() {
        this.textarea = document.querySelector('textarea[name="message"]');
        this.maxLength = 1000;
        this.init();
    }

    init() {
        if (!this.textarea) return;
        
        this.createCounter();
        this.textarea.addEventListener('input', this.updateCounter.bind(this));
    }

    createCounter() {
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.innerHTML = `<span class="current">0</span> / <span class="max">${this.maxLength}</span>`;
        
        const formGroup = this.textarea.closest('.form-group');
        formGroup.appendChild(counter);
        
        this.counterElement = counter;
        this.currentSpan = counter.querySelector('.current');
    }

    updateCounter() {
        const currentLength = this.textarea.value.length;
        this.currentSpan.textContent = currentLength;
        
        // Add warning styles when approaching limit
        if (currentLength > this.maxLength * 0.9) {
            this.counterElement.classList.add('warning');
        } else {
            this.counterElement.classList.remove('warning');
        }
        
        if (currentLength > this.maxLength) {
            this.counterElement.classList.add('error');
        } else {
            this.counterElement.classList.remove('error');
        }
    }
}

// Enhanced contact card interactions
class ContactCardAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.addHoverEffects();
        this.addClickEffects();
    }

    addHoverEffects() {
        const contactCards = document.querySelectorAll('.contact-card');
        
        contactCards.forEach(card => {
            card.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
            card.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        });
    }

    addClickEffects() {
        const contactCards = document.querySelectorAll('.contact-card');
        
        contactCards.forEach(card => {
            card.addEventListener('click', this.handleCardClick.bind(this));
        });
    }

    handleMouseEnter(e) {
        const card = e.currentTarget;
        const icon = card.querySelector('.contact-icon');
        
        // Add floating animation to icon
        icon.style.animation = 'float 2s ease-in-out infinite';
    }

    handleMouseLeave(e) {
        const card = e.currentTarget;
        const icon = card.querySelector('.contact-icon');
        
        // Remove floating animation
        icon.style.animation = '';
    }

    handleCardClick(e) {
        const card = e.currentTarget;
        const contactInfo = card.querySelector('p').textContent;
        
        // Copy to clipboard if it's email or phone
        if (contactInfo.includes('@') || contactInfo.includes('+')) {
            this.copyToClipboard(contactInfo);
            this.showCopyFeedback(card);
        }
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }

    showCopyFeedback(card) {
        const feedback = document.createElement('div');
        feedback.className = 'copy-feedback';
        feedback.textContent = 'Copied!';
        
        card.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
    new CharacterCounter();
    new ContactCardAnimations();
});

// Add CSS animations for form interactions
const style = document.createElement('style');
style.textContent = `
    .form-group.error input,
    .form-group.error textarea {
        border-color: #f56565 !important;
        box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.1) !important;
    }
    
    .field-error {
        color: #f56565;
        font-size: 0.75rem;
        margin-top: 0.5rem;
        animation: slideInUp 0.3s ease;
    }
    
    .shake {
        animation: shake 0.5s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .loading-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top: 2px solid currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        display: inline-block;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .primary-btn.loading {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    .character-counter {
        text-align: right;
        font-size: 0.75rem;
        color: var(--text-tertiary);
        margin-top: 0.25rem;
        transition: color 0.3s ease;
    }
    
    .character-counter.warning {
        color: #f6ad55;
    }
    
    .character-counter.error {
        color: #f56565;
    }
    
    .success-pulse {
        animation: successPulse 1s ease;
    }
    
    @keyframes successPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    .copy-feedback {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--accent-primary);
        color: var(--bg-primary);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        animation: copyFeedback 2s ease;
        z-index: 10;
    }
    
    @keyframes copyFeedback {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
    
    .input-ripple {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(100, 255, 218, 0.1), transparent 70%);
        border-radius: 12px;
        animation: inputRipple 0.6s ease;
        pointer-events: none;
        z-index: 1;
    }
    
    @keyframes inputRipple {
        0% { transform: scale(0.8); opacity: 1; }
        100% { transform: scale(1.1); opacity: 0; }
    }
`;
document.head.appendChild(style);
