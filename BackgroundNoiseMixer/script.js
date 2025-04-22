// Sound data
const sounds = [
    {
        id: 'rain',
        title: 'Rain',
        icon: 'fa-cloud-rain',
        audioSrc: 'https://cdn.freesound.org/previews/346/346170_5121236-lq.mp3' // More reliable source
    },
    {
        id: 'cafe',
        title: 'Café Chatter',
        icon: 'fa-coffee',
        audioSrc: 'https://cdn.freesound.org/previews/328/328118_3263906-lq.mp3'
    },
    {
        id: 'fire',
        title: 'Fireplace',
        icon: 'fa-fire',
        audioSrc: 'https://cdn.freesound.org/previews/271/271209_5123851-lq.mp3'
    },
    {
        id: 'forest',
        title: 'Forest',
        icon: 'fa-tree',
        audioSrc: 'https://cdn.freesound.org/previews/573/573577_7754927-lq.mp3'
    },
    {
        id: 'waves',
        title: 'Ocean Waves',
        icon: 'fa-water',
        audioSrc: 'https://cdn.freesound.org/previews/527/527933_2464655-lq.mp3'
    },
    {
        id: 'whitenoise',
        title: 'White Noise',
        icon: 'fa-wind',
        audioSrc: 'https://cdn.freesound.org/previews/133/133099_2398403-lq.mp3'
    }
];

// Audio objects for each sound
const audioElements = {};

// DOM elements
const soundCardsContainer = document.querySelector('.sound-cards');
const playAllBtn = document.getElementById('play-all');
const pauseAllBtn = document.getElementById('pause-all');
const saveMixBtn = document.getElementById('save-mix');
const shareMixBtn = document.getElementById('share-mix');
const saveModal = document.getElementById('save-modal');
const shareModal = document.getElementById('share-modal');
const closeButtons = document.querySelectorAll('.close');
const mixNameInput = document.getElementById('mix-name');
const confirmSaveBtn = document.getElementById('confirm-save');
const shareLinkInput = document.getElementById('share-link');
const copyLinkBtn = document.getElementById('copy-link');
const mixesContainer = document.querySelector('.mixes-container');

// Sound library DOM elements
const soundLibraryContainer = document.querySelector('.sound-results');
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const categoryBtns = document.querySelectorAll('.category-btn');
const paginationContainer = document.querySelector('.pagination');

// Initialize the application
function init() {
    createSoundCards();
    setupEventListeners();
    loadSavedMixes();
    checkForSharedMix();
    
    // Initialize sound library if elements exist
    if (soundLibraryContainer && searchBtn && categoryBtns.length > 0) {
        loadSoundLibrary('all');
    }
    // Add the audio initialization overlay
    initializeAudio();
}
// After the init function, add this new function
function initializeAudio() {
    // Create a user interaction overlay
    const overlay = document.createElement('div');
    overlay.className = 'audio-init-overlay';
    overlay.innerHTML = `
        <div class="audio-init-container">
            <h2>Welcome to Background Noise Mixer</h2>
            <p>Due to browser restrictions, we need your interaction to enable audio playback.</p>
            <button id="start-audio" class="start-audio-btn">Start Mixer</button>
        </div>
    `;
    document.body.appendChild(overlay);
    // Add styles for the overlay
    const style = document.createElement('style');
    style.textContent = `
        .audio-init-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
    `;
    style.textContent += `
        .audio-init-container {
            background-color: white;
            padding: 2rem;
            border-radius: 8px;
            text-align: center;
            max-width: 500px;
        }
        .start-audio-btn {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
            margin-top: 1rem;
            transition: background-color 0.3s;
        }
        .start-audio-btn:hover {
            background-color: #45a049;
        }
    `;
    document.head.appendChild(style);
    // Add event listener to the start button
    document.getElementById('start-audio').addEventListener('click', () => {
        // Initialize all audio elements with a silent sound
        Object.values(audioElements).forEach(soundData => {
            // Create a short silent audio context to unlock audio
            const silentAudio = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA");
            silentAudio.play().catch(e => console.log("Silent audio play failed, but that's okay"));
            
            // Try to load the actual audio
            soundData.element.load();
        });
        
        // Remove the overlay
        overlay.remove();
    });
}
// Add this function after initializeAudio
function unlockAudio() {
    // Create and play a silent sound to unlock audio
    const silentSound = new Audio("data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN//MUZAMAAAGkAAAAAAAAA0gAAAAARTMu//MUZAYAAAGkAAAAAAAAA0gAAAAAOTku//MUZAkAAAGkAAAAAAAAA0gAAAAANVVV");
    silentSound.play().catch(e => console.log("Silent sound play failed"));
    silentSound.pause();
}

// Create sound cards
function createSoundCards() {
    sounds.forEach(sound => {
        // Create audio element with better error handling and multiple sources
        const audio = new Audio();
        
        // Add error handling
        audio.addEventListener('error', (e) => {
            console.error(`Error loading audio for ${sound.title}:`, e);
            
            // Try alternative source if primary fails
            if (!audio.fallbackAttempted) {
                audio.fallbackAttempted = true;
                
                // Try an alternative format (MP3 fallback to OGG or vice versa)
                const alternativeSource = sound.audioSrc.includes('.mp3') 
                    ? sound.audioSrc.replace('.mp3', '.ogg') 
                    : sound.audioSrc.replace('.ogg', '.mp3');
                
                console.log(`Trying alternative source for ${sound.title}: ${alternativeSource}`);
                audio.src = alternativeSource;
                audio.load();
            }
        });
        
        // Add canplaythrough event to confirm audio is playable
        audio.addEventListener('canplaythrough', () => {
            console.log(`Audio for ${sound.title} is ready to play`);
        });
        
        // Set CORS attributes to allow cross-origin audio
        audio.crossOrigin = "anonymous";
        
        // Set source after adding error listener
        audio.src = sound.audioSrc;
        audio.loop = true;
        audio.preload = 'auto'; // Ensure audio is preloaded
        
        // Create a backup source using a local audio file if available
        const localFallbackSrc = `./sounds/${sound.id}.mp3`;
        
        audioElements[sound.id] = {
            element: audio,
            playing: false,
            volume: 0.5,
            originalSrc: sound.audioSrc,
            fallbackSrc: localFallbackSrc
        };

        // Create sound card
        const soundCard = document.createElement('div');
        soundCard.className = 'sound-card';
        soundCard.dataset.soundId = sound.id;
        soundCard.draggable = true;

        soundCard.innerHTML = `
            <div class="sound-card-header">
                <span class="sound-title"><i class="fas ${sound.icon}"></i> ${sound.title}</span>
                <button class="sound-toggle" data-sound-id="${sound.id}">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <div class="volume-control">
                <input type="range" class="volume-slider" data-sound-id="${sound.id}" 
                       min="0" max="1" step="0.01" value="0.5">
                <div class="volume-value">50%</div>
            </div>
        `;

        soundCardsContainer.appendChild(soundCard);
    });
}

// Set up event listeners
function setupEventListeners() {
    // Sound toggle buttons
    document.querySelectorAll('.sound-toggle').forEach(button => {
        button.addEventListener('click', toggleSound);
    });

    // Volume sliders
    document.querySelectorAll('.volume-slider').forEach(slider => {
        slider.addEventListener('input', adjustVolume);
    });

    // Global controls
    if (playAllBtn) playAllBtn.addEventListener('click', playAllSounds);
    if (pauseAllBtn) pauseAllBtn.addEventListener('click', pauseAllSounds);
    if (saveMixBtn) saveMixBtn.addEventListener('click', () => saveModal.style.display = 'block');
    if (shareMixBtn) shareMixBtn.addEventListener('click', openShareModal);

    // Modal controls
    if (closeButtons) {
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (saveModal) saveModal.style.display = 'none';
                if (shareModal) shareModal.style.display = 'none';
            });
        });
    }

    if (confirmSaveBtn) confirmSaveBtn.addEventListener('click', saveMix);
    if (copyLinkBtn) copyLinkBtn.addEventListener('click', copyShareLink);

    // Close modals when clicking outside
    window.addEventListener('click', event => {
        if (saveModal && event.target === saveModal) saveModal.style.display = 'none';
        if (shareModal && event.target === shareModal) shareModal.style.display = 'none';
    });

    // Drag and drop functionality
    setupDragAndDrop();
    
    // Sound library event listeners
    if (searchBtn && soundLibraryContainer) {
        searchBtn.addEventListener('click', () => {
            const activeCategory = document.querySelector('.category-btn.active')?.dataset.category || 'all';
            const query = searchInput.value.trim();
            loadSoundLibrary(activeCategory, query);
        });
    }
    
    if (searchInput && soundLibraryContainer) {
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                const activeCategory = document.querySelector('.category-btn.active')?.dataset.category || 'all';
                const query = searchInput.value.trim();
                loadSoundLibrary(activeCategory, query);
            }
        });
    }
    
    if (categoryBtns.length > 0 && soundLibraryContainer) {
        categoryBtns.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                categoryBtns.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Load sounds for selected category
                const category = button.dataset.category;
                const query = searchInput?.value.trim() || '';
                loadSoundLibrary(category, query);
            });
        });
    }
}

// Toggle sound play/pause
function toggleSound(event) {
    const soundId = event.currentTarget.dataset.soundId;
    const soundData = audioElements[soundId];
    const button = event.currentTarget;
    const soundCard = button.closest('.sound-card');

    if (soundData.playing) {
        soundData.element.pause();
        soundData.playing = false;
        button.innerHTML = '<i class="fas fa-play"></i>';
        soundCard.classList.remove('active');
    } else {
        try {
            // Reset the audio source if it failed previously
            if (soundData.element.error) {
                console.log(`Attempting to recover from error for ${soundId}`);
                
                // Try the fallback source if original failed
                if (soundData.element.src === soundData.originalSrc) {
                    console.log(`Trying fallback source for ${soundId}`);
                    soundData.element.src = soundData.fallbackSrc;
                } else {
                    // If fallback also failed, try a different format
                    const currentSrc = soundData.element.src;
                    const newFormat = currentSrc.includes('.mp3') ? 
                        currentSrc.replace('.mp3', '.ogg') : 
                        currentSrc.replace('.ogg', '.mp3');
                    
                    console.log(`Trying different format for ${soundId}: ${newFormat}`);
                    soundData.element.src = newFormat;
                }
                
                soundData.element.load();
            }
            
            // Use a promise to handle play() properly
            const playPromise = soundData.element.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Playback started successfully
                    soundData.playing = true;
                    button.innerHTML = '<i class="fas fa-pause"></i>';
                    soundCard.classList.add('active');
                }).catch(error => {
                    console.error('Error playing audio:', error);
                    
                    // More helpful error message
                    if (error.name === 'NotAllowedError') {
                        alert('Your browser is blocking autoplay. Please click the "Start Mixer" button that appears when you first load the page. If you dismissed it, please refresh the page.');
                    } else if (error.name === 'NotSupportedError') {
                        alert('This audio format is not supported by your browser. Try using a different browser like Chrome or Firefox.');
                    } else {
                        alert('Error playing audio: ' + (error.message || 'Please try refreshing the page.'));
                    }
                    
                    soundData.playing = false;
                });
            }
        } catch (error) {
            console.error('Error playing audio:', error);
            alert('Error playing audio. Please try again.');
        }
    }
}
// Play all sounds
function playAllSounds() {
    Object.keys(audioElements).forEach(soundId => {
        const soundData = audioElements[soundId];
        const button = document.querySelector(`.sound-toggle[data-sound-id="${soundId}"]`);
        const soundCard = button.closest('.sound-card');
        
        // Fix: Use the same improved play mechanism
        try {
            // Reset the audio source if it failed previously
            if (soundData.element.error) {
                soundData.element.src = sounds.find(s => s.id === soundId)?.audioSrc || 
                                       soundData.element.src;
                soundData.element.load();
            }
            
            const playPromise = soundData.element.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Playback started successfully
                    soundData.playing = true;
                    button.innerHTML = '<i class="fas fa-pause"></i>';
                    soundCard.classList.add('active');
                }).catch(error => {
                    console.error('Error playing audio:', error);
                    // Don't show alert for each sound when playing all
                });
            }
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    });
}

// Function to add a sound from the library to the mixer
function addSoundToMixer(event) {
    const soundId = event.currentTarget.dataset.soundId;
    const soundTitle = event.currentTarget.dataset.soundTitle;
    const soundUrl = event.currentTarget.dataset.soundUrl;
    
    // Check if sound already exists in mixer
    if (audioElements[soundId]) {
        alert('This sound is already in your mixer.');
        return;
    }
    
    // Create audio element
    const audio = new Audio();
    // Fix: Add event listeners for better error handling
    audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        alert(`Error loading sound: ${soundTitle}. Please try another sound.`);
    });
    
    // Set source after adding error listener
    audio.src = soundUrl;
    audio.loop = true;
    audio.preload = 'auto'; // Ensure audio is preloaded
    
    audioElements[soundId] = {
        element: audio,
        playing: false,
        volume: 0.5
    };
    
    // Rest of the function remains the same
    // ...
}

// Adjust volume
function adjustVolume(event) {
    const soundId = event.currentTarget.dataset.soundId;
    const volume = parseFloat(event.currentTarget.value);
    const volumeDisplay = event.currentTarget.nextElementSibling;
    
    audioElements[soundId].element.volume = volume;
    audioElements[soundId].volume = volume;
    volumeDisplay.textContent = `${Math.round(volume * 100)}%`;
}

// Pause all sounds
function pauseAllSounds() {
    Object.keys(audioElements).forEach(soundId => {
        const soundData = audioElements[soundId];
        const button = document.querySelector(`.sound-toggle[data-sound-id="${soundId}"]`);
        const soundCard = button.closest('.sound-card');
        
        soundData.element.pause();
        soundData.playing = false;
        button.innerHTML = '<i class="fas fa-play"></i>';
        soundCard.classList.remove('active');
    });
}

// Save mix
function saveMix() {
    const mixName = mixNameInput.value.trim() || `Mix ${new Date().toLocaleString()}`;
    
    // Get current mix settings
    const mixSettings = {};
    Object.keys(audioElements).forEach(soundId => {
        mixSettings[soundId] = {
            volume: audioElements[soundId].volume,
            playing: audioElements[soundId].playing
        };
    });
    
    // Save to local storage
    const savedMixes = JSON.parse(localStorage.getItem('backgroundNoiseMixes') || '[]');
    savedMixes.push({
        id: Date.now().toString(),
        name: mixName,
        settings: mixSettings,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('backgroundNoiseMixes', JSON.stringify(savedMixes));
    
    // Close modal and reset input
    saveModal.style.display = 'none';
    mixNameInput.value = '';
    
    // Refresh saved mixes display
    loadSavedMixes();
}

// Load saved mixes
function loadSavedMixes() {
    const savedMixes = JSON.parse(localStorage.getItem('backgroundNoiseMixes') || '[]');
    mixesContainer.innerHTML = '';
    
    if (savedMixes.length === 0) {
        mixesContainer.innerHTML = '<p class="no-mixes">No saved mixes yet. Create your first mix!</p>';
        return;
    }
    
    savedMixes.forEach(mix => {
        const mixCard = document.createElement('div');
        mixCard.className = 'mix-card';
        mixCard.dataset.mixId = mix.id;
        
        mixCard.innerHTML = `
            <h3>${mix.name}</h3>
            <p>Created: ${new Date(mix.createdAt).toLocaleDateString()}</p>
            <div class="mix-actions">
                <button class="mix-btn load-mix" data-mix-id="${mix.id}">Load</button>
                <button class="mix-btn share-mix" data-mix-id="${mix.id}">Share</button>
                <button class="mix-btn delete delete-mix" data-mix-id="${mix.id}">Delete</button>
            </div>
        `;
        
        mixesContainer.appendChild(mixCard);
    });
    
    // Add event listeners to mix buttons
    document.querySelectorAll('.load-mix').forEach(button => {
        button.addEventListener('click', loadMix);
    });
    
    document.querySelectorAll('.share-mix').forEach(button => {
        button.addEventListener('click', shareSavedMix);
    });
    
    document.querySelectorAll('.delete-mix').forEach(button => {
        button.addEventListener('click', deleteMix);
    });
}

// Load a saved mix
function loadMix(event) {
    const mixId = event.currentTarget.dataset.mixId;
    const savedMixes = JSON.parse(localStorage.getItem('backgroundNoiseMixes') || '[]');
    const mix = savedMixes.find(m => m.id === mixId);
    
    if (!mix) return;
    
    // Apply mix settings
    Object.keys(mix.settings).forEach(soundId => {
        if (audioElements[soundId]) {
            const setting = mix.settings[soundId];
            const slider = document.querySelector(`.volume-slider[data-sound-id="${soundId}"]`);
            const volumeDisplay = slider.nextElementSibling;
            const button = document.querySelector(`.sound-toggle[data-sound-id="${soundId}"]`);
            const soundCard = button.closest('.sound-card');
            
            // Set volume
            audioElements[soundId].element.volume = setting.volume;
            audioElements[soundId].volume = setting.volume;
            slider.value = setting.volume;
            volumeDisplay.textContent = `${Math.round(setting.volume * 100)}%`;
            
            // Set play/pause state
            if (setting.playing) {
                audioElements[soundId].element.play();
                audioElements[soundId].playing = true;
                button.innerHTML = '<i class="fas fa-pause"></i>';
                soundCard.classList.add('active');
            } else {
                audioElements[soundId].element.pause();
                audioElements[soundId].playing = false;
                button.innerHTML = '<i class="fas fa-play"></i>';
                soundCard.classList.remove('active');
            }
        }
    });
}

// Share a saved mix
function shareSavedMix(event) {
    const mixId = event.currentTarget.dataset.mixId;
    const savedMixes = JSON.parse(localStorage.getItem('backgroundNoiseMixes') || '[]');
    const mix = savedMixes.find(m => m.id === mixId);
    
    if (!mix) return;
    
    // Create share URL
    const shareData = btoa(JSON.stringify(mix.settings));
    const shareUrl = `${window.location.href.split('?')[0]}?mix=${shareData}`;
    
    shareLinkInput.value = shareUrl;
    shareModal.style.display = 'block';
}

// Open share modal with current mix
function openShareModal() {
    // Get current mix settings
    const mixSettings = {};
    Object.keys(audioElements).forEach(soundId => {
        mixSettings[soundId] = {
            volume: audioElements[soundId].volume,
            playing: audioElements[soundId].playing
        };
    });
    
    // Create share URL
    const shareData = btoa(JSON.stringify(mixSettings));
    const shareUrl = `${window.location.href.split('?')[0]}?mix=${shareData}`;
    
    shareLinkInput.value = shareUrl;
    shareModal.style.display = 'block';
}

// Copy share link to clipboard
function copyShareLink() {
    shareLinkInput.select();
    document.execCommand('copy');
    
    // Visual feedback
    copyLinkBtn.textContent = 'Copied!';
    setTimeout(() => {
        copyLinkBtn.textContent = 'Copy Link';
    }, 2000);
}

// Delete a saved mix
function deleteMix(event) {
    const mixId = event.currentTarget.dataset.mixId;
    const savedMixes = JSON.parse(localStorage.getItem('backgroundNoiseMixes') || '[]');
    const updatedMixes = savedMixes.filter(mix => mix.id !== mixId);
    
    localStorage.setItem('backgroundNoiseMixes', JSON.stringify(updatedMixes));
    loadSavedMixes();
}

// Check for shared mix in URL
function checkForSharedMix() {
    const urlParams = new URLSearchParams(window.location.search);
    const mixParam = urlParams.get('mix');
    
    if (mixParam) {
        try {
            const mixSettings = JSON.parse(atob(mixParam));
            
            // Apply mix settings
            Object.keys(mixSettings).forEach(soundId => {
                if (audioElements[soundId]) {
                    const setting = mixSettings[soundId];
                    const slider = document.querySelector(`.volume-slider[data-sound-id="${soundId}"]`);
                    const volumeDisplay = slider.nextElementSibling;
                    const button = document.querySelector(`.sound-toggle[data-sound-id="${soundId}"]`);
                    const soundCard = button.closest('.sound-card');
                    
                    // Set volume
                    audioElements[soundId].element.volume = setting.volume;
                    audioElements[soundId].volume = setting.volume;
                    slider.value = setting.volume;
                    volumeDisplay.textContent = `${Math.round(setting.volume * 100)}%`;
                    
                    // Set play/pause state
                    if (setting.playing) {
                        audioElements[soundId].element.play();
                        audioElements[soundId].playing = true;
                        button.innerHTML = '<i class="fas fa-pause"></i>';
                        soundCard.classList.add('active');
                    } else {
                        audioElements[soundId].element.pause();
                        audioElements[soundId].playing = false;
                        button.innerHTML = '<i class="fas fa-play"></i>';
                        soundCard.classList.remove('active');
                    }
                }
            });
        } catch (error) {
            console.error('Error loading shared mix:', error);
        }
    }
}

// Setup drag and drop functionality
function setupDragAndDrop() {
    const soundCards = document.querySelectorAll('.sound-card');
    
    soundCards.forEach(card => {
        card.addEventListener('dragstart', dragStart);
        card.addEventListener('dragover', dragOver);
        card.addEventListener('dragenter', dragEnter);
        card.addEventListener('dragleave', dragLeave);
        card.addEventListener('drop', drop);
        card.addEventListener('dragend', dragEnd);
    });
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.soundId);
    setTimeout(() => {
        e.target.classList.add('dragging');
    }, 0);
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    e.target.closest('.sound-card').classList.add('drag-over');
}

function dragLeave(e) {
    e.target.closest('.sound-card').classList.remove('drag-over');
}

function drop(e) {
    e.preventDefault();
    const draggedSoundId = e.dataTransfer.getData('text/plain');
    const targetCard = e.target.closest('.sound-card');
    const targetSoundId = targetCard.dataset.soundId;
    
    targetCard.classList.remove('drag-over');
    
    if (draggedSoundId !== targetSoundId) {
        const cards = Array.from(document.querySelectorAll('.sound-card'));
        const draggedCardIndex = cards.findIndex(card => card.dataset.soundId === draggedSoundId);
        const targetCardIndex = cards.findIndex(card => card.dataset.soundId === targetSoundId);
        
        if (draggedCardIndex > targetCardIndex) {
            soundCardsContainer.insertBefore(cards[draggedCardIndex], cards[targetCardIndex]);
        } else {
            soundCardsContainer.insertBefore(cards[draggedCardIndex], cards[targetCardIndex].nextSibling);
        }
    }
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.sound-card').forEach(card => {
        card.classList.remove('drag-over');
    });
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Function to simulate fetching sounds from API
async function fetchSoundsFromAPI(category, query, page) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // These are the APIs you can use in a real implementation:
    // 1. Freesound API: https://freesound.org/docs/api/
    // 2. Soundcloud API: https://developers.soundcloud.com/docs/api/guide
    // 3. BBC Sound Effects API: https://sound-effects.bbcrewind.co.uk/
    // 4. Jamendo API: https://developer.jamendo.com/v3.0
    
    // Simulate different results based on category and query
    let results = [];
    const categories = {
        'nature': ['Forest', 'Birds', 'Wind', 'Leaves', 'Thunder', 'Rain'],
        'ambient': ['Cafe', 'Office', 'Crowd', 'Market', 'Restaurant', 'Library'],
        'urban': ['Traffic', 'Construction', 'Subway', 'Train', 'Airport', 'City'],
        'noise': ['White Noise', 'Pink Noise', 'Brown Noise', 'Fan', 'Static', 'Hum'],
        'water': ['Ocean', 'River', 'Stream', 'Waterfall', 'Lake', 'Rain']
    };
    
    // Generate 20 results per page
    const itemsPerPage = 20;
    const startIndex = (page - 1) * itemsPerPage;
    const totalItems = 100; // Simulate 100 total items
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (category === 'all') {
        // Combine all categories
        const allSounds = [];
        for (const cat in categories) {
            categories[cat].forEach(sound => allSounds.push(sound));
        }
        
        // Filter by query if provided
        const filteredSounds = query ? 
            allSounds.filter(sound => sound.toLowerCase().includes(query.toLowerCase())) : 
            allSounds;
            
        // Paginate results
        for (let i = 0; i < itemsPerPage && startIndex + i < filteredSounds.length; i++) {
            results.push({
                id: `sound-${startIndex + i}`,
                title: filteredSounds[startIndex + i],
                duration: Math.floor(Math.random() * 60) + 30, // Random duration between 30-90 seconds
                username: 'FreeSoundUser',
                preview: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3' // Example URL
            });
        }
    } else if (categories[category]) {
        // Filter by category
        const categorySounds = categories[category];
        
        // Filter by query if provided
        const filteredSounds = query ? 
            categorySounds.filter(sound => sound.toLowerCase().includes(query.toLowerCase())) : 
            categorySounds;
            
        // Paginate results
        for (let i = 0; i < itemsPerPage && i < filteredSounds.length; i++) {
            results.push({
                id: `sound-${category}-${i}`,
                title: filteredSounds[i],
                duration: Math.floor(Math.random() * 60) + 30, // Random duration between 30-90 seconds
                username: 'FreeSoundUser',
                preview: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3' // Example URL
            });
        }
    }
    
    // Make sure we always return something even if no results
    return {
        results: results,
        totalPages: totalPages || 1,
        currentPage: page
    };
}

// Function to show/hide loading spinner
function showLoading(show) {
    if (!soundLibraryContainer) return;
    
    if (show) {
        soundLibraryContainer.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
            </div>
        `;
    }
}

// Add this function after the fetchSoundsFromAPI function
// Function to display sound results
function displaySoundResults(data) {
    if (!data.results || data.results.length === 0) {
        soundLibraryContainer.innerHTML = `
            <div class="no-results">
                <p>No sounds found. Try a different search or category.</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    data.results.forEach(sound => {
        const minutes = Math.floor(sound.duration / 60);
        const seconds = sound.duration % 60;
        const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        html += `
            <div class="sound-result-card" data-sound-id="${sound.id}">
                <h4>${sound.title}</h4>
                <p>${formattedDuration} • ${sound.username}</p>
                <button class="add-sound-btn" data-sound-id="${sound.id}" data-sound-title="${sound.title}" data-sound-url="${sound.preview}">
                    Add to Mixer
                </button>
            </div>
        `;
    });
    
    soundLibraryContainer.innerHTML = html;
    
    // Add event listeners to add buttons
    document.querySelectorAll('.add-sound-btn').forEach(button => {
        button.addEventListener('click', addSoundToMixer);
    });
}

// Add this function after displaySoundResults
// Function to create pagination
function createPagination(totalPages, currentPage) {
    let html = '';
    
    // Previous button
    html += `
        <button class="page-btn prev-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        html += `
            <button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>
        `;
    }
    
    // Next button
    html += `
        <button class="page-btn next-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationContainer.innerHTML = html;
    
    // Add event listeners to pagination buttons
    document.querySelectorAll('.page-btn').forEach(button => {
        button.addEventListener('click', handlePagination);
    });
}

// Add this function after createPagination
// Function to handle pagination clicks
function handlePagination(event) {
    if (event.currentTarget.hasAttribute('disabled')) return;
    
    const page = parseInt(event.currentTarget.dataset.page);
    const activeCategory = document.querySelector('.category-btn.active')?.dataset.category || 'all';
    const query = searchInput?.value.trim() || '';
    
    loadSoundLibrary(activeCategory, query, page);
}

// Add this function after handlePagination
// Function to add a sound from the library to the mixer
function addSoundToMixer(event) {
    const soundId = event.currentTarget.dataset.soundId;
    const soundTitle = event.currentTarget.dataset.soundTitle;
    const soundUrl = event.currentTarget.dataset.soundUrl;
    
    // Check if sound already exists in mixer
    if (audioElements[soundId]) {
        alert('This sound is already in your mixer.');
        return;
    }
    
    // Create audio element
    const audio = new Audio();
    // Fix: Add event listeners for better error handling
    audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        alert(`Error loading sound: ${soundTitle}. Please try another sound.`);
    });
    
    // Set source after adding error listener
    audio.src = soundUrl;
    audio.loop = true;
    audio.preload = 'auto'; // Ensure audio is preloaded
    
    audioElements[soundId] = {
        element: audio,
        playing: false,
        volume: 0.5
    };
    
    // Rest of the function remains the same
    // ...
}

// Adjust volume
function adjustVolume(event) {
    const soundId = event.currentTarget.dataset.soundId;
    const volume = parseFloat(event.currentTarget.value);
    const volumeDisplay = event.currentTarget.nextElementSibling;
    
    audioElements[soundId].element.volume = volume;
    audioElements[soundId].volume = volume;
    volumeDisplay.textContent = `${Math.round(volume * 100)}%`;
}

// Pause all sounds
function pauseAllSounds() {
    Object.keys(audioElements).forEach(soundId => {
        const soundData = audioElements[soundId];
        const button = document.querySelector(`.sound-toggle[data-sound-id="${soundId}"]`);
        const soundCard = button.closest('.sound-card');
        
        soundData.element.pause();
        soundData.playing = false;
        button.innerHTML = '<i class="fas fa-play"></i>';
        soundCard.classList.remove('active');
    });
}

// Save mix
function saveMix() {
    const mixName = mixNameInput.value.trim() || `Mix ${new Date().toLocaleString()}`;
    
    // Get current mix settings
    const mixSettings = {};
    Object.keys(audioElements).forEach(soundId => {
        mixSettings[soundId] = {
            volume: audioElements[soundId].volume,
            playing: audioElements[soundId].playing
        };
    });
    
    // Save to local storage
    const savedMixes = JSON.parse(localStorage.getItem('backgroundNoiseMixes') || '[]');
    savedMixes.push({
        id: Date.now().toString(),
        name: mixName,
        settings: mixSettings,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('backgroundNoiseMixes', JSON.stringify(savedMixes));
    
    // Close modal and reset input
    saveModal.style.display = 'none';
    mixNameInput.value = '';
    
    // Refresh saved mixes display
    loadSavedMixes();
}

// Load saved mixes
function loadSavedMixes() {
    const savedMixes = JSON.parse(localStorage.getItem('backgroundNoiseMixes') || '[]');
    mixesContainer.innerHTML = '';
    
    if (savedMixes.length === 0) {
        mixesContainer.innerHTML = '<p class="no-mixes">No saved mixes yet. Create your first mix!</p>';
        return;
    }
    
    savedMixes.forEach(mix => {
        const mixCard = document.createElement('div');
        mixCard.className = 'mix-card';
        mixCard.dataset.mixId = mix.id;
        
        mixCard.innerHTML = `
            <h3>${mix.name}</h3>
            <p>Created: ${new Date(mix.createdAt).toLocaleDateString()}</p>
            <div class="mix-actions">
                <button class="mix-btn load-mix" data-mix-id="${mix.id}">Load</button>
                <button class="mix-btn share-mix" data-mix-id="${mix.id}">Share</button>
                <button class="mix-btn delete delete-mix" data-mix-id="${mix.id}">Delete</button>
            </div>
        `;
        
        mixesContainer.appendChild(mixCard);
    });
    
    // Add event listeners to mix buttons
    document.querySelectorAll('.load-mix').forEach(button => {
        button.addEventListener('click', loadMix);
    });
    
    document.querySelectorAll('.share-mix').forEach(button => {
        button.addEventListener('click', shareSavedMix);
    });
    
    document.querySelectorAll('.delete-mix').forEach(button => {
        button.addEventListener('click', deleteMix);
    });
}

// Load a saved mix
function loadMix(event) {
    const mixId = event.currentTarget.dataset.mixId;
    const savedMixes = JSON.parse(localStorage.getItem('backgroundNoiseMixes') || '[]');
    const mix = savedMixes.find(m => m.id === mixId);
    
    if (!mix) return;
    
    // Apply mix settings
    Object.keys(mix.settings).forEach(soundId => {
        if (audioElements[soundId]) {
            const setting = mix.settings[soundId];
            const slider = document.querySelector(`.volume-slider[data-sound-id="${soundId}"]`);
            const volumeDisplay = slider.nextElementSibling;
            const button = document.querySelector(`.sound-toggle[data-sound-id="${soundId}"]`);
            const soundCard = button.closest('.sound-card');
            
            // Set volume
            audioElements[soundId].element.volume = setting.volume;
            audioElements[soundId].volume = setting.volume;
            slider.value = setting.volume;
            volumeDisplay.textContent = `${Math.round(setting.volume * 100)}%`;
            
            // Set play/pause state
            if (setting.playing) {
                audioElements[soundId].element.play();
                audioElements[soundId].playing = true;
                button.innerHTML = '<i class="fas fa-pause"></i>';
                soundCard.classList.add('active');
            } else {
                audioElements[soundId].element.pause();
                audioElements[soundId].playing = false;
                button.innerHTML = '<i class="fas fa-play"></i>';
                soundCard.classList.remove('active');
            }
        }
    });
}

// Share a saved mix
function shareSavedMix(event) {
    const mixId = event.currentTarget.dataset.mixId;
    const savedMixes = JSON.parse(localStorage.getItem('backgroundNoiseMixes') || '[]');
    const mix = savedMixes.find(m => m.id === mixId);
    
    if (!mix) return;
    
    // Create share URL
    const shareData = btoa(JSON.stringify(mix.settings));
    const shareUrl = `${window.location.href.split('?')[0]}?mix=${shareData}`;
    
    shareLinkInput.value = shareUrl;
    shareModal.style.display = 'block';
}

// Open share modal with current mix
function openShareModal() {
    // Get current mix settings
    const mixSettings = {};
    Object.keys(audioElements).forEach(soundId => {
        mixSettings[soundId] = {
            volume: audioElements[soundId].volume,
            playing: audioElements[soundId].playing
        };
    });
    
    // Create share URL
    const shareData = btoa(JSON.stringify(mixSettings));
    const shareUrl = `${window.location.href.split('?')[0]}?mix=${shareData}`;
    
    shareLinkInput.value = shareUrl;
    shareModal.style.display = 'block';
}

// Copy share link to clipboard
function copyShareLink() {
    shareLinkInput.select();
    document.execCommand('copy');
    
    // Visual feedback
    copyLinkBtn.textContent = 'Copied!';
    setTimeout(() => {
        copyLinkBtn.textContent = 'Copy Link';
    }, 2000);
}

// Delete a saved mix
function deleteMix(event) {
    const mixId = event.currentTarget.dataset.mixId;
    const savedMixes = JSON.parse(localStorage.getItem('backgroundNoiseMixes') || '[]');
    const updatedMixes = savedMixes.filter(mix => mix.id !== mixId);
    
    localStorage.setItem('backgroundNoiseMixes', JSON.stringify(updatedMixes));
    loadSavedMixes();
}

// Check for shared mix in URL
function checkForSharedMix() {
    const urlParams = new URLSearchParams(window.location.search);
    const mixParam = urlParams.get('mix');
    
    if (mixParam) {
        try {
            const mixSettings = JSON.parse(atob(mixParam));
            
            // Apply mix settings
            Object.keys(mixSettings).forEach(soundId => {
                if (audioElements[soundId]) {
                    const setting = mixSettings[soundId];
                    const slider = document.querySelector(`.volume-slider[data-sound-id="${soundId}"]`);
                    const volumeDisplay = slider.nextElementSibling;
                    const button = document.querySelector(`.sound-toggle[data-sound-id="${soundId}"]`);
                    const soundCard = button.closest('.sound-card');
                    
                    // Set volume
                    audioElements[soundId].element.volume = setting.volume;
                    audioElements[soundId].volume = setting.volume;
                    slider.value = setting.volume;
                    volumeDisplay.textContent = `${Math.round(setting.volume * 100)}%`;
                    
                    // Set play/pause state
                    if (setting.playing) {
                        audioElements[soundId].element.play();
                        audioElements[soundId].playing = true;
                        button.innerHTML = '<i class="fas fa-pause"></i>';
                        soundCard.classList.add('active');
                    } else {
                        audioElements[soundId].element.pause();
                        audioElements[soundId].playing = false;
                        button.innerHTML = '<i class="fas fa-play"></i>';
                        soundCard.classList.remove('active');
                    }
                }
            });
        } catch (error) {
            console.error('Error loading shared mix:', error);
        }
    }
}

// Setup drag and drop functionality
function setupDragAndDrop() {
    const soundCards = document.querySelectorAll('.sound-card');
    
    soundCards.forEach(card => {
        card.addEventListener('dragstart', dragStart);
        card.addEventListener('dragover', dragOver);
        card.addEventListener('dragenter', dragEnter);
        card.addEventListener('dragleave', dragLeave);
        card.addEventListener('drop', drop);
        card.addEventListener('dragend', dragEnd);
    });
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.soundId);
    setTimeout(() => {
        e.target.classList.add('dragging');
    }, 0);
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    e.target.closest('.sound-card').classList.add('drag-over');
}

function dragLeave(e) {
    e.target.closest('.sound-card').classList.remove('drag-over');
}

function drop(e) {
    e.preventDefault();
    const draggedSoundId = e.dataTransfer.getData('text/plain');
    const targetCard = e.target.closest('.sound-card');
    const targetSoundId = targetCard.dataset.soundId;
    
    targetCard.classList.remove('drag-over');
    
    if (draggedSoundId !== targetSoundId) {
        const cards = Array.from(document.querySelectorAll('.sound-card'));
        const draggedCardIndex = cards.findIndex(card => card.dataset.soundId === draggedSoundId);
        const targetCardIndex = cards.findIndex(card => card.dataset.soundId === targetSoundId);
        
        if (draggedCardIndex > targetCardIndex) {
            soundCardsContainer.insertBefore(cards[draggedCardIndex], cards[targetCardIndex]);
        } else {
            soundCardsContainer.insertBefore(cards[draggedCardIndex], cards[targetCardIndex].nextSibling);
        }
    }
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
    document.querySelectorAll('.sound-card').forEach(card => {
        card.classList.remove('drag-over');
    });
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Function to simulate fetching sounds from API
async function fetchSoundsFromAPI(category, query, page) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // These are the APIs you can use in a real implementation:
    // 1. Freesound API: https://freesound.org/docs/api/
    // 2. Soundcloud API: https://developers.soundcloud.com/docs/api/guide
    // 3. BBC Sound Effects API: https://sound-effects.bbcrewind.co.uk/
    // 4. Jamendo API: https://developer.jamendo.com/v3.0
    
    // Simulate different results based on category and query
    let results = [];
    const categories = {
        'nature': ['Forest', 'Birds', 'Wind', 'Leaves', 'Thunder', 'Rain'],
        'ambient': ['Cafe', 'Office', 'Crowd', 'Market', 'Restaurant', 'Library'],
        'urban': ['Traffic', 'Construction', 'Subway', 'Train', 'Airport', 'City'],
        'noise': ['White Noise', 'Pink Noise', 'Brown Noise', 'Fan', 'Static', 'Hum'],
        'water': ['Ocean', 'River', 'Stream', 'Waterfall', 'Lake', 'Rain']
    };
    
    // Generate 20 results per page
    const itemsPerPage = 20;
    const startIndex = (page - 1) * itemsPerPage;
    const totalItems = 100; // Simulate 100 total items
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (category === 'all') {
        // Combine all categories
        const allSounds = [];
        for (const cat in categories) {
            categories[cat].forEach(sound => allSounds.push(sound));
        }
        
        // Filter by query if provided
        const filteredSounds = query ? 
            allSounds.filter(sound => sound.toLowerCase().includes(query.toLowerCase())) : 
            allSounds;
            
        // Paginate results
        for (let i = 0; i < itemsPerPage && startIndex + i < filteredSounds.length; i++) {
            results.push({
                id: `sound-${startIndex + i}`,
                title: filteredSounds[startIndex + i],
                duration: Math.floor(Math.random() * 60) + 30, // Random duration between 30-90 seconds
                username: 'FreeSoundUser',
                preview: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3' // Example URL
            });
        }
    } else if (categories[category]) {
        // Filter by category
        const categorySounds = categories[category];
        
        // Filter by query if provided
        const filteredSounds = query ? 
            categorySounds.filter(sound => sound.toLowerCase().includes(query.toLowerCase())) : 
            categorySounds;
            
        // Paginate results
        for (let i = 0; i < itemsPerPage && i < filteredSounds.length; i++) {
            results.push({
                id: `sound-${category}-${i}`,
                title: filteredSounds[i],
                duration: Math.floor(Math.random() * 60) + 30, // Random duration between 30-90 seconds
                username: 'FreeSoundUser',
                preview: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3' // Example URL
            });
        }
    }
    
    // Make sure we always return something even if no results
    return {
        results: results,
        totalPages: totalPages || 1,
        currentPage: page
    };
}

// Function to show/hide loading spinner
function showLoading(show) {
    if (!soundLibraryContainer) return;
    
    if (show) {
        soundLibraryContainer.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
            </div>
        `;
    }
}

// Add this function after the fetchSoundsFromAPI function
// Function to display sound results
function displaySoundResults(data) {
    if (!data.results || data.results.length === 0) {
        soundLibraryContainer.innerHTML = `
            <div class="no-results">
                <p>No sounds found. Try a different search or category.</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    data.results.forEach(sound => {
        const minutes = Math.floor(sound.duration / 60);
        const seconds = sound.duration % 60;
        const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        html += `
            <div class="sound-result-card" data-sound-id="${sound.id}">
                <h4>${sound.title}</h4>
                <p>${formattedDuration} • ${sound.username}</p>
                <button class="add-sound-btn" data-sound-id="${sound.id}" data-sound-title="${sound.title}" data-sound-url="${sound.preview}">
                    Add to Mixer
                </button>
            </div>
        `;
    });
    
    soundLibraryContainer.innerHTML = html;
    
    // Add event listeners to add buttons
    document.querySelectorAll('.add-sound-btn').forEach(button => {
        button.addEventListener('click', addSoundToMixer);
    });
}

// Add this function after displaySoundResults
// Function to create pagination
function createPagination(totalPages, currentPage) {
    let html = '';
    
    // Previous button
    html += `
        <button class="page-btn prev-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        html += `
            <button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>
        `;
    }
    
    // Next button
    html += `
        <button class="page-btn next-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    paginationContainer.innerHTML = html;
    
    // Add event listeners to pagination buttons
    document.querySelectorAll('.page-btn').forEach(button => {
        button.addEventListener('click', handlePagination);
    });
}

// Add this function after createPagination
// Function to handle pagination clicks
function handlePagination(event) {
    if (event.currentTarget.hasAttribute('disabled')) return;
    
    const page = parseInt(event.currentTarget.dataset.page);
    const activeCategory = document.querySelector('.category-btn.active')?.dataset.category || 'all';
    const query = searchInput?.value.trim() || '';
    
    loadSoundLibrary(activeCategory, query, page);
}

// Add this function after handlePagination
// Function to add a sound from the library to the mixer
function addSoundToMixer(event) {
    const soundId = event.currentTarget.dataset.soundId;
    const soundTitle = event.currentTarget.dataset.soundTitle;
    const soundUrl = event.currentTarget.dataset.soundUrl;
    
    // Check if sound already exists in mixer
    if (audioElements[soundId]) {
        alert('This sound is already in your mixer.');
        return;
    }
    
    // Create audio element
    const audio = new Audio();
    // Fix: Add event listeners for better error handling
    audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        alert(`Error loading sound: ${soundTitle}. Please try another sound.`);
    });
    
    // Set source after adding error listener
    audio.src = soundUrl;
    audio.loop = true;
    audio.preload = 'auto'; // Ensure audio is preloaded
    
    audioElements[soundId] = {
        element: audio,
        playing: false,
        volume: 0.5
    };
    
    // Create sound card
    const soundCard = document.createElement('div');
    soundCard.className = 'sound-card';
    soundCard.dataset.soundId = soundId;
    soundCard.draggable = true;
    
    soundCard.innerHTML = `
        <div class="sound-card-header">
            <span class="sound-title"><i class="fas fa-music"></i> ${soundTitle}</span>
            <button class="sound-toggle" data-sound-id="${soundId}">
                <i class="fas fa-play"></i>
            </button>
        </div>
        <div class="volume-control">
            <input type="range" class="volume-slider" data-sound-id="${soundId}" 
                   min="0" max="1" step="0.01" value="0.5">
            <div class="volume-value">50%</div>
        </div>
    `;
    
    soundCardsContainer.appendChild(soundCard);
    
    // Add event listeners
    soundCard.querySelector('.sound-toggle').addEventListener('click', toggleSound);
    soundCard.querySelector('.volume-slider').addEventListener('input', adjustVolume);
    
    // Setup drag and drop
    soundCard.addEventListener('dragstart', dragStart);
    soundCard.addEventListener('dragover', dragOver);
    soundCard.addEventListener('dragenter', dragEnter);
    soundCard.addEventListener('dragleave', dragLeave);
    soundCard.addEventListener('drop', drop);
    soundCard.addEventListener('dragend', dragEnd);
    
    // Show success message
    alert(`"${soundTitle}" has been added to your mixer.`);
}

// Add this function after the showLoading function
// Function to load sounds from Freesound API
async function loadSoundLibrary(category = 'all', query = '', page = 1) {
    showLoading(true);
    
    try {
        // Freesound API requires authentication
        // For demo purposes, we'll simulate API response
        // In a real application, you would use your API key
        const sounds = await fetchSoundsFromAPI(category, query, page);
        displaySoundResults(sounds);
        createPagination(sounds.totalPages, page);
    } catch (error) {
        console.error('Error loading sound library:', error);
        soundLibraryContainer.innerHTML = `
            <div class="error-message">
                <p>Error loading sounds. Please try again later.</p>
            </div>
        `;
    }
    
    showLoading(false);
}