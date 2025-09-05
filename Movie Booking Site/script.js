// Sample movie data (in a real application, this would come from a backend API)
const movies = [
    {
        id: 1,
        title: "Stitch",
        genre: "Animated, Adventure, Comedy",
        duration: "1h 25m",
        rating: "4.2",
        description: "A genetically engineered alien named Stitch crash-lands on Earth and finds friendship and family with a young girl named Lilo in Hawaii.",
        image: "https://preview.redd.it/new-poster-for-the-live-action-lilo-stitch-movie-v0-roitfglg6h3e1.jpeg?auto=webp&s=5b58042cb8bd1ce41ccca7966319c065c31a15f1"
    },
    {
        id: 2,
        title: "How to Train Your Dragon",
        genre: "Live‑Action, Adventure, Fantasy, Family",
        duration: "approx 2h 5m",
        rating: 4.2,
        description: "A live‑action adaptation of the beloved animated saga: Hiccup and Toothless reunite in a breathtaking new adventure directed by Dean DeBlois.",
        image: "https://m.media-amazon.com/images/M/MV5BODA5Y2M0NjctNWQzMy00ODRhLWE0MzUtYmE1YTAzZjYyYmQyXkEyXkFqcGc@._V1_.jpg"
    },
    {
        id: 3,
        title: "දේවී කුසුමාසන",
        genre: "Historical, Epic, Romance",
        duration: "2h 21m (141 min)",
        rating: 4.0,
        description: "A historical epic based on the life of Kusumasana Devi and her romance with Konappu Bandara (later Vimaladharmasuriya I) during Portuguese‑era Ceylon.",
        image: "https://scontent.fcmb1-2.fna.fbcdn.net/v/t39.30808-6/510809538_122167428098563215_4894843775004912263_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeG3RJFN2HnHO7Hr9t0kEDIDJSoJCLkAyDglKgkIuQDIOPqko93k8YxKuEMD2P_zH6csJbk-WU0k5MyKmvqMf5O9&_nc_ohc=cFArB49Mu7YQ7kNvwEGCppG&_nc_oc=AdnobcLU7U1td7k4uHF0SKLw0NzLF2Q3cgoeoUxTSALpkKnrIqU6WDa9Apk-YQE-U5s&_nc_zt=23&_nc_ht=scontent.fcmb1-2.fna&_nc_gid=rqGGfKEhsvdZznueoPWCDg&oh=00_AfQlurAaAnBlZu5RHfVnTYKkTHH-61jwiKn_HTzfPeBgeQ&oe=6880C6AB"
    },
    {
        id: 4,
        title: "ක්ලැරන්ස් – Rhythm of the Guitar",
        genre: "Biographical, Musical, Drama",
        duration: "2h 19m (139 min)",
        rating: 4.4,
        description: "A musical biopic chronicling the life and legacy of Clarence Wijewardena, the pioneering father of Sinhala pop music, who revolutionized Sri Lankan music with the electric guitar.",
        image: "https://m.media-amazon.com/images/M/MV5BMDUxMGVkY2MtMzYyNi00MmUxLWE1MzktN2M0MGExNDYwMDZkXkEyXkFqcGc@._V1_.jpg"
    },
    {
        id: 5,
        title: "වාලම්පුරි හෙවත් හීන හතහමාරක්",
        genre: "Crime, Thriller, Psychological",
        duration: "2h 30m (150 min)",
        rating: 4.3,  // average user‑based score out of 5
        description: "Five village con‑artists posing as a travelling theatre troupe get drawn into a fraudulent scheme involving a mystical conch shell (‘Walampoori’) offered by a fake Hindu priest; deception, ambition, and wit collide in this psychological thriller.",
        image: "https://m.media-amazon.com/images/M/MV5BNjk5NWQ0YmYtYTNhYi00NWVjLTgzNmUtMjUwMTdjYjlmOTljXkEyXkFqcGc@._V1_.jpg"
    },
    {
        id: 6,
        title: "Inception",
        genre: "Sci-Fi/Action",
        duration: "2h 28m",
        rating: 4.7,
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        image: "https://source.unsplash.com/random/300x450/?dream"
    },
    {
        id: 7,
        title: "Inception",
        genre: "Sci-Fi/Action",
        duration: "2h 28m",
        rating: 4.7,
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        image: "https://source.unsplash.com/random/300x450/?dream"
    },
    {
        id: 8,
        title: "Inception",
        genre: "Sci-Fi/Action",
        duration: "2h 28m",
        rating: 4.7,
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        image: "https://source.unsplash.com/random/300x450/?dream"
    }
];

// DOM Elements
const movieGrid = document.getElementById('movie-grid');
const themeToggle = document.querySelector('.theme-toggle');

// Theme Toggle Functionality
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Update icon
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Check for saved theme preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    const icon = themeToggle.querySelector('i');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
}

// Function to display movies on the homepage
function displayMovies() {
    if (!movieGrid) return; // If not on the homepage, return
    
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        
        movieCard.innerHTML = `
            <div class="movie-poster">
                <img src="${movie.image}" alt="${movie.title}">
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span>${movie.genre}</span>
                    <span class="movie-rating">
                        <i class="fas fa-star"></i> ${movie.rating}
                    </span>
                </div>
                <div class="movie-actions">
                    <button class="btn-primary book-now" data-id="${movie.id}">Book Now</button>
                </div>
            </div>
        `;
        
        movieGrid.appendChild(movieCard);
    });
    
    // Add event listeners to Book Now buttons
    const bookButtons = document.querySelectorAll('.book-now');
    bookButtons.forEach(button => {
        button.addEventListener('click', () => {
            const movieId = button.getAttribute('data-id');
            localStorage.setItem('selectedMovie', movieId);
            window.location.href = 'booking.html';
        });
    });
    
    // Add event listener to Explore Now button
    const exploreButton = document.querySelector('.hero .btn-primary');
    if (exploreButton) {
        exploreButton.addEventListener('click', () => {
            window.location.href = 'movies.html';
        });
    }
}

// Booking Page Functionality
function initBookingPage() {
    const moviePoster = document.getElementById('movie-poster');
    const movieTitle = document.getElementById('movie-title');
    const movieDuration = document.getElementById('movie-duration');
    const movieGenre = document.getElementById('movie-genre');
    const movieRating = document.getElementById('movie-rating');
    const movieDescription = document.getElementById('movie-description');
    const seatingLayout = document.getElementById('seating-layout');
    const summaryMovie = document.getElementById('summary-movie');
    const summaryDate = document.getElementById('summary-date');
    const summaryTime = document.getElementById('summary-time');
    const summarySeats = document.getElementById('summary-seats');
    const summaryTotal = document.getElementById('summary-total');
    const confirmButton = document.getElementById('confirm-booking');
    const bookingDate = document.getElementById('booking-date');
    const bookingTime = document.getElementById('booking-time');
    
    if (!movieTitle) return; // If not on the booking page, return
    
    // Get selected movie from localStorage
    const selectedMovieId = localStorage.getItem('selectedMovie');
    const selectedMovie = movies.find(movie => movie.id == selectedMovieId);
    
    if (!selectedMovie) {
        window.location.href = 'index.html'; // Redirect if no movie selected
        return;
    }
    
    // Display movie details
    moviePoster.innerHTML = `<img src="${selectedMovie.image}" alt="${selectedMovie.title}">`;
    movieTitle.textContent = selectedMovie.title;
    movieDuration.textContent = selectedMovie.duration;
    movieGenre.textContent = selectedMovie.genre;
    movieRating.textContent = `⭐ ${selectedMovie.rating}`;
    movieDescription.textContent = selectedMovie.description;
    summaryMovie.textContent = selectedMovie.title;
    
    // Generate seating layout
    const rows = 8;
    const seatsPerRow = 10;
    const occupiedSeats = generateRandomOccupiedSeats(rows, seatsPerRow);
    
    for (let i = 0; i < rows; i++) {
        const rowElement = document.createElement('div');
        rowElement.classList.add('seat-row');
        
        // Add row label (A, B, C, etc.)
        const rowLabel = document.createElement('div');
        rowLabel.classList.add('row-label');
        rowLabel.textContent = String.fromCharCode(65 + i); // A, B, C, ...
        rowElement.appendChild(rowLabel);
        
        for (let j = 0; j < seatsPerRow; j++) {
            const seat = document.createElement('div');
            seat.classList.add('seat');
            
            // Set seat ID (e.g., A1, A2, B1, B2, etc.)
            const seatId = `${String.fromCharCode(65 + i)}${j + 1}`;
            seat.setAttribute('data-seat-id', seatId);
            
            // Check if seat is occupied
            if (occupiedSeats.includes(seatId)) {
                seat.classList.add('occupied');
            } else {
                seat.classList.add('available');
                
                // Add click event to toggle seat selection
                seat.addEventListener('click', () => {
                    if (seat.classList.contains('occupied')) return;
                    
                    seat.classList.toggle('selected');
                    updateBookingSummary();
                });
            }
            
            rowElement.appendChild(seat);
        }
        
        seatingLayout.appendChild(rowElement);
    }
    
    // Update booking summary when date or time changes
    bookingDate.addEventListener('change', updateBookingSummary);
    bookingTime.addEventListener('change', updateBookingSummary);
    
    // Set minimum date to today
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    bookingDate.setAttribute('min', formattedDate);
    
    // Confirm booking button
    confirmButton.addEventListener('click', () => {
        // Save booking details to localStorage
        const bookingDetails = {
            movie: selectedMovie.title,
            date: bookingDate.value,
            time: bookingTime.value,
            seats: getSelectedSeats(),
            total: calculateTotal()
        };
        
        localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
        window.location.href = 'confirmation.html';
    });
    
    // Function to update booking summary
    function updateBookingSummary() {
        const selectedSeats = getSelectedSeats();
        const date = bookingDate.value;
        const time = bookingTime.value;
        
        summaryDate.textContent = date ? new Date(date).toLocaleDateString() : '-';
        summaryTime.textContent = time || '-';
        summarySeats.textContent = selectedSeats.length > 0 ? selectedSeats.join(', ') : '-';
        summaryTotal.textContent = `LKR ${calculateTotal()}`;
        
        // Enable/disable confirm button
        confirmButton.disabled = !(selectedSeats.length > 0 && date && time);
    }
    
    // Function to get selected seats
    function getSelectedSeats() {
        const selectedSeats = [];
        const seats = document.querySelectorAll('.seat.selected');
        
        seats.forEach(seat => {
            selectedSeats.push(seat.getAttribute('data-seat-id'));
        });
        
        return selectedSeats;
    }
    
    // Function to calculate total price
    function calculateTotal() {
        const selectedSeats = getSelectedSeats();
        const pricePerSeat = 800; // LKR 800 per seat
        
        return selectedSeats.length * pricePerSeat;
    }
}

// Confirmation Page Functionality
function initConfirmationPage() {
    const confMovie = document.getElementById('conf-movie');
    const confDate = document.getElementById('conf-date');
    const confTime = document.getElementById('conf-time');
    const confSeats = document.getElementById('conf-seats');
    const confTotal = document.getElementById('conf-total');
    const downloadButton = document.getElementById('download-ticket');
    
    if (!confMovie) return; // If not on the confirmation page, return
    
    // Get booking details from localStorage
    const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails'));
    
    if (!bookingDetails) {
        window.location.href = 'index.html'; // Redirect if no booking details
        return;
    }
    
    // Display booking details
    confMovie.textContent = bookingDetails.movie;
    confDate.textContent = new Date(bookingDetails.date).toLocaleDateString();
    confTime.textContent = bookingDetails.time;
    confSeats.textContent = bookingDetails.seats.join(', ');
    confTotal.textContent = `LKR ${bookingDetails.total}`;
    
    // Show toast notification
    showToast('Booking confirmed successfully!');
    
    // Download ticket button with actual functionality
    downloadButton.addEventListener('click', () => {
        generateTicket(bookingDetails);
    });
}

// Helper function to generate random occupied seats
function generateRandomOccupiedSeats(rows, seatsPerRow) {
    const occupiedSeats = [];
    const totalSeats = rows * seatsPerRow;
    const numOccupied = Math.floor(totalSeats * 0.3); // 30% of seats are occupied
    
    for (let i = 0; i < numOccupied; i++) {
        const row = String.fromCharCode(65 + Math.floor(Math.random() * rows));
        const seat = Math.floor(Math.random() * seatsPerRow) + 1;
        const seatId = `${row}${seat}`;
        
        if (!occupiedSeats.includes(seatId)) {
            occupiedSeats.push(seatId);
        }
    }
    
    return occupiedSeats;
}

// Function to show toast notification
function showToast(message) {
    // Check if toast already exists
    let toast = document.querySelector('.toast');
    
    if (!toast) {
        // Create toast element
        toast = document.createElement('div');
        toast.classList.add('toast');
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
    } else {
        // Update message
        toast.querySelector('span').textContent = message;
    }
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Function to initialize the Movies page
function initMoviesPage() {
    const allMoviesGrid = document.getElementById('all-movies-grid');
    const movieSearch = document.getElementById('movie-search');
    const searchBtn = document.getElementById('search-btn');
    const genreFilter = document.getElementById('genre-filter');
    const movieModal = document.getElementById('movie-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalPoster = document.getElementById('modal-poster');
    const modalTitle = document.getElementById('modal-title');
    const modalDuration = document.getElementById('modal-duration');
    const modalGenre = document.getElementById('modal-genre');
    const modalRating = document.getElementById('modal-rating');
    const modalDescription = document.getElementById('modal-description');
    const modalBookBtn = document.getElementById('modal-book-btn');
    
    if (!allMoviesGrid) return; // If not on the movies page, return
    
    // Function to display all movies with optional filtering
    function displayAllMovies(searchTerm = '', genreFilter = '') {
        // Clear existing movies
        allMoviesGrid.innerHTML = '';
        
        // Filter movies based on search term and genre
        const filteredMovies = movies.filter(movie => {
            const matchesSearch = searchTerm === '' || 
                movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                movie.description.toLowerCase().includes(searchTerm.toLowerCase());
                
            const matchesGenre = genreFilter === '' || 
                movie.genre.toLowerCase().includes(genreFilter.toLowerCase());
                
            return matchesSearch && matchesGenre;
        });
        
        if (filteredMovies.length === 0) {
            // Display no results message
            const noResults = document.createElement('div');
            noResults.classList.add('no-results');
            noResults.innerHTML = `
                <i class="fas fa-search"></i>
                <h3>No movies found</h3>
                <p>Try adjusting your search or filter criteria</p>
            `;
            allMoviesGrid.appendChild(noResults);
            return;
        }
        
        // Display filtered movies
        filteredMovies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            
            movieCard.innerHTML = `
                <div class="movie-poster">
                    <img src="${movie.image}" alt="${movie.title}">
                </div>
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <div class="movie-meta">
                        <span>${movie.genre}</span>
                        <span class="movie-rating">
                            <i class="fas fa-star"></i> ${movie.rating}
                        </span>
                    </div>
                    <div class="movie-actions">
                        <button class="btn-primary view-details" data-id="${movie.id}">View Details</button>
                    </div>
                </div>
            `;
            
            allMoviesGrid.appendChild(movieCard);
        });
        
        // Add event listeners to view details buttons
        const viewDetailsButtons = document.querySelectorAll('.view-details');
        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', () => {
                const movieId = button.getAttribute('data-id');
                const movie = movies.find(m => m.id == movieId);
                
                // Populate modal with movie details
                modalPoster.innerHTML = `<img src="${movie.image}" alt="${movie.title}">`;
                modalTitle.textContent = movie.title;
                modalDuration.textContent = movie.duration;
                modalGenre.textContent = movie.genre;
                modalRating.textContent = `⭐ ${movie.rating}`;
                modalDescription.textContent = movie.description;
                modalBookBtn.setAttribute('data-id', movie.id);
                
                // Show modal
                movieModal.style.display = 'flex';
            });
        });
    }
    
    // Initial display of all movies
    displayAllMovies();
    
    // Search functionality
    searchBtn.addEventListener('click', () => {
        const searchTerm = movieSearch.value.trim();
        const selectedGenre = genreFilter.value;
        displayAllMovies(searchTerm, selectedGenre);
    });
    
    // Search on Enter key
    movieSearch.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = movieSearch.value.trim();
            const selectedGenre = genreFilter.value;
            displayAllMovies(searchTerm, selectedGenre);
        }
    });
    
    // Genre filter functionality
    genreFilter.addEventListener('change', () => {
        const searchTerm = movieSearch.value.trim();
        const selectedGenre = genreFilter.value;
        displayAllMovies(searchTerm, selectedGenre);
    });
    
    // Close modal when clicking the X
    closeModal.addEventListener('click', () => {
        movieModal.style.display = 'none';
    });
    
    // Close modal when clicking outside the content
    movieModal.addEventListener('click', (e) => {
        if (e.target === movieModal) {
            movieModal.style.display = 'none';
        }
    });
    
    // Book Now button in modal
    modalBookBtn.addEventListener('click', () => {
        const movieId = modalBookBtn.getAttribute('data-id');
        localStorage.setItem('selectedMovie', movieId);
        window.location.href = 'booking.html';
    });
}

// Initialize page based on current URL
function initPage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'index.html' || currentPage === '') {
        displayMovies();
    } else if (currentPage === 'booking.html') {
        initBookingPage();
    } else if (currentPage === 'confirmation.html') {
        initConfirmationPage();
    } else if (currentPage === 'movies.html') {
        initMoviesPage();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage);

// Function to generate and download ticket
function generateTicket(bookingDetails) {
    // If multiple seats are selected, generate a ticket for each seat
    if (bookingDetails.seats.length > 1) {
        // Create individual tickets for each seat
        bookingDetails.seats.forEach(seat => {
            const singleSeatBooking = {
                ...bookingDetails,
                seats: [seat],
                total: bookingDetails.total / bookingDetails.seats.length // Divide total by number of seats
            };
            generateSingleTicket(singleSeatBooking);
        });
        
        // Show success message after all tickets are generated
        setTimeout(() => {
            showToast(`${bookingDetails.seats.length} tickets downloaded successfully!`);
        }, 500);
    } else {
        // If only one seat, generate a single ticket
        generateSingleTicket(bookingDetails);
    }
}

// Function to generate a single ticket
function generateSingleTicket(bookingDetails) {
    // Create a ticket element
    const ticketElement = document.createElement('div');
    ticketElement.classList.add('ticket-template');
    
    // Generate a random ticket number
    const ticketNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    
    // Add ticket content
    ticketElement.innerHTML = `
        <div style="width: 800px; height: 350px; border: 2px dashed #333; padding: 20px; font-family: Arial, sans-serif; position: relative; background-color: #f9f9f9;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
                <h2 style="margin: 0; color: #e63946;">CineSphere</h2>
                <div>
                    <h3 style="margin: 0;">MOVIE TICKET</h3>
                    <p style="margin: 5px 0 0; font-size: 12px;">Ticket #: ${ticketNumber}</p>
                </div>
            </div>
            
            <div style="display: flex; margin-top: 20px;">
                <div style="flex: 2; padding-right: 20px;">
                    <h3 style="margin: 0 0 15px; color: #333;">${bookingDetails.movie}</h3>
                    
                    <div style="margin-bottom: 10px;">
                        <strong>Date:</strong> ${new Date(bookingDetails.date).toLocaleDateString()}
                    </div>
                    
                    <div style="margin-bottom: 10px;">
                        <strong>Time:</strong> ${bookingDetails.time}
                    </div>
                    
                    <div style="margin-bottom: 10px;">
                        <strong>Seat:</strong> ${bookingDetails.seats.join(', ')}
                    </div>
                    
                    <div style="margin-bottom: 10px;">
                        <strong>Total:</strong> LKR ${bookingDetails.total}
                    </div>
                </div>
                
                <div style="flex: 1; border-left: 1px dashed #ccc; padding-left: 20px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    <div style="text-align: center;">
                        <h4 style="margin: 0 0 10px;">ADMIT ONE</h4>
                        <p style="margin: 0; font-size: 14px;">${bookingDetails.movie}</p>
                        <p style="margin: 5px 0; font-size: 14px;">${new Date(bookingDetails.date).toLocaleDateString()} | ${bookingDetails.time}</p>
                        <p style="margin: 5px 0; font-size: 14px;">Seat: ${bookingDetails.seats.join(', ')}</p>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px; font-size: 12px; text-align: center;">
                <p style="margin: 0;">Please arrive 15 minutes before showtime. This ticket is non-refundable.</p>
                <p style="margin: 5px 0 0;">Thank you for choosing CineSphere!</p>
            </div>
            
            <div style="position: absolute; bottom: 20px; right: 20px; font-size: 10px; color: #666;">
                Generated on: ${new Date().toLocaleString()}
            </div>
        </div>
    `;
    
    // Use html2canvas to convert the ticket element to an image
    // First, add the element to the body but make it invisible
    ticketElement.style.position = 'absolute';
    ticketElement.style.left = '-9999px';
    document.body.appendChild(ticketElement);
    
    // Use setTimeout to ensure the element is rendered before capturing
    setTimeout(() => {
        // Create a canvas from the ticket element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 350;
        
        // Fill with white background
        ctx.fillStyle = '#f9f9f9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw ticket content (simplified version)
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#e63946';
        ctx.fillText('CineSphere', 20, 30);
        
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = '#333';
        ctx.fillText('MOVIE TICKET', 650, 25);
        ctx.font = '12px Arial';
        ctx.fillText(`Ticket #: ${ticketNumber}`, 650, 45);
        
        ctx.beginPath();
        ctx.moveTo(0, 50);
        ctx.lineTo(800, 50);
        ctx.strokeStyle = '#ccc';
        ctx.stroke();
        
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = '#333';
        ctx.fillText(bookingDetails.movie, 20, 80);
        
        ctx.font = '14px Arial';
        ctx.fillText(`Date: ${new Date(bookingDetails.date).toLocaleDateString()}`, 20, 110);
        ctx.fillText(`Time: ${bookingDetails.time}`, 20, 140);
        ctx.fillText(`Seat: ${bookingDetails.seats.join(', ')}`, 20, 170);
        ctx.fillText(`Total: LKR ${bookingDetails.total}`, 20, 200);
        
        ctx.beginPath();
        ctx.moveTo(500, 60);
        ctx.lineTo(500, 230);
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = '#ccc';
        ctx.stroke();
        
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#333';
        ctx.fillText('ADMIT ONE', 600, 100);
        ctx.font = '14px Arial';
        ctx.fillText(bookingDetails.movie, 600, 130);
        ctx.fillText(`${new Date(bookingDetails.date).toLocaleDateString()} | ${bookingDetails.time}`, 600, 160);
        ctx.fillText(`Seat: ${bookingDetails.seats.join(', ')}`, 600, 190);
        
        ctx.beginPath();
        ctx.moveTo(0, 240);
        ctx.lineTo(800, 240);
        ctx.setLineDash([]);
        ctx.strokeStyle = '#ccc';
        ctx.stroke();
        
        ctx.font = '12px Arial';
        ctx.fillStyle = '#333';
        ctx.fillText('Please arrive 15 minutes before showtime. This ticket is non-refundable.', 200, 270);
        ctx.fillText('Thank you for choosing CineSphere!', 300, 290);
        
        ctx.font = '10px Arial';
        ctx.fillStyle = '#666';
        ctx.fillText(`Generated on: ${new Date().toLocaleString()}`, 600, 330);
        
        // Convert canvas to data URL
        const dataURL = canvas.toDataURL('image/png');
        
        // Create download link
        const downloadLink = document.createElement('a');
        downloadLink.href = dataURL;
        downloadLink.download = `CineSphere_Ticket_${bookingDetails.seats.join('')}_${ticketNumber}.png`;
        
        // Trigger download
        downloadLink.click();
        
        // Clean up
        document.body.removeChild(ticketElement);
        
        // Only show toast for single ticket downloads
        if (bookingDetails.seats.length === 1) {
            showToast('Ticket downloaded successfully!');
        }
    }, 100);
}