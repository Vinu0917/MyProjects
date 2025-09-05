// Booking form functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get the Book Now button and modal elements
    const bookNowButtons = document.querySelectorAll('.cta-button, .book-package-btn, .nav-book-btn');
    const bookingModal = document.getElementById('booking-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const bookingForm = document.getElementById('booking-form');
    
    // Open modal when Book Now button is clicked
    bookNowButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // If button is in a package row, pre-fill the package field
            if (this.classList.contains('book-package-btn')) {
                const packageRow = this.closest('tr');
                const packageName = packageRow.querySelector('td:first-child').textContent;
                document.getElementById('package').value = packageName;
            }
            
            bookingModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
    });
    
    // Close modal when close button is clicked
    closeModalBtn.addEventListener('click', function() {
        bookingModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    });
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(e) {
        if (e.target === bookingModal) {
            bookingModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(bookingForm);
        const bookingData = {};
        
        for (const [key, value] of formData.entries()) {
            bookingData[key] = value;
        }
        
        // Here you would typically send the data to a server
        // For now, we'll just show a success message
        bookingForm.innerHTML = `
            <div class="booking-success">
                <h3>Booking Request Received!</h3>
                <p>Thank you for booking with Travelexia. We've received your request for the ${bookingData.package} package.</p>
                <p>A confirmation email has been sent to ${bookingData.email}.</p>
                <p>One of our travel specialists will contact you within 24 hours to finalize your booking.</p>
                <button type="button" id="close-success" class="submit-button">Close</button>
            </div>
        `;
        
        // Add event listener to the new close button
        document.getElementById('close-success').addEventListener('click', function() {
            bookingModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            // Reset the form after closing
            setTimeout(() => {
                bookingForm.reset();
                bookingForm.innerHTML = originalFormHTML;
                // Re-attach event listeners to the new form elements
                attachFormListeners();
            }, 300);
        });
    });
    
    // Store the original form HTML to reset it later
    const originalFormHTML = bookingForm.innerHTML;
    
    // Function to attach event listeners to form elements
    function attachFormListeners() {
        // Add any additional form-specific event listeners here
    }
});