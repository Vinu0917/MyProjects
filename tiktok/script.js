const audioEl = document.getElementById('song');
const playBtn = document.getElementById('playBtn');
const particlesContainer = document.getElementById('particles');
const canvas = document.getElementById('vis');
const ctx = canvas.getContext('2d');
const eqBars = document.querySelectorAll('.eq-bar');

// Resize canvas for HD clarity
function resizeCanvas() {
  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = canvas.clientHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Create floating particles
const NUM_PARTICLES = 40; // Increased for more visual interest
for (let i = 0; i < NUM_PARTICLES; i++) {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  // Random position
  particle.style.left = Math.random() * 100 + '%';
  
  // Random size
  const size = 2 + Math.random() * 4;
  particle.style.width = size + 'px';
  particle.style.height = size + 'px';
  
  // Sri Lankan flag colors
  // Sri Lankan colors matching the elephant image
  const colors = [
    '#8D153A', // Maroon
    '#D68B4B', // Earthy orange
    '#2D5F4C', // Forest green
    '#F2C166', // Soft gold
    '#4A6D8B', // Muted blue
    '#6D4C3D'  // Rich brown
  ];
  particle.style.background = colors[Math.floor(Math.random() * colors.length)];
  
  // Random animation duration
  particle.style.animationDuration = 10 + Math.random() * 20 + 's';
  
  // Random delay
  particle.style.animationDelay = Math.random() * 5 + 's';
  
  particlesContainer.appendChild(particle);
}

// Web Audio API setup
let audioCtx, analyser, source;
function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 512; // Changed from 1024 to match our frequency data array
  source = audioCtx.createMediaElementSource(audioEl);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
}

function map(v, inMin, inMax, outMin, outMax) {
  return outMin + (v - inMin) * (outMax - outMin) / (inMax - inMin);
}

// Color palette - updated with Sri Lankan colors
const color = {
  primary: '#3498db',
  secondary: '#005641', // Sri Lankan green
  accent: '#8D153A',    // Sri Lankan maroon
  accent2: '#EB7400',   // Sri Lankan orange
  accent3: '#FFD100',   // Sri Lankan yellow
  dark: '#2c3e50'
};

// Frequency data arrays - increase size for better resolution
const frequencyData = new Uint8Array(128); // Back to original size
const timeData = new Uint8Array(128);

function draw() {
  requestAnimationFrame(draw);
  if (!analyser) return;
  
  // Get frequency and time domain data
  analyser.getByteFrequencyData(frequencyData);
  analyser.getByteTimeDomainData(timeData);

  // Calculate average levels
  let bassSum = 0, midSum = 0, trebleSum = 0;
  for (let i = 0; i < 40; i++) bassSum += frequencyData[i];
  for (let i = 40; i < 80; i++) midSum += frequencyData[i];
  for (let i = 80; i < 120; i++) trebleSum += frequencyData[i];
  
  const bassLevel = bassSum / 40 / 255;
  const midLevel = midSum / 40 / 255;
  const trebleLevel = trebleSum / 40 / 255;
  
  const overallLevel = (bassLevel + midLevel + trebleLevel) / 3;

  // Canvas dimensions
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // Center coordinates
  const cx = w / 2, cy = h / 2;
  
  // Draw circular visualizer
  drawCircularVisualizer(cx, cy, w, h, bassLevel, midLevel, trebleLevel);
  
  // Draw waveform
  drawWaveform(w, h, timeData);
  
  // Animate equalizer bars
  animateEqBars(frequencyData);
}

function drawCircularVisualizer(cx, cy, w, h, bassLevel, midLevel, trebleLevel) {
  // Outer circle parameters - make it smaller and centered
  const maxRadius = Math.min(w, h) * 0.25; // Reduced size for better centering
  
  // Adjust horizontal position to move visualizer to the left
  const adjustedCx = cx - (w * 0.1); // Move 10% of width to the left
  
  // Center the visualizer vertically in the middle of the screen
  const adjustedCy = h * 0.45; // Position at 45% from the top for better visual centering
  
  const bassRadius = maxRadius * (0.7 + bassLevel * 0.3);
  const midRadius = maxRadius * (0.5 + midLevel * 0.3);
  const trebleRadius = maxRadius * (0.3 + trebleLevel * 0.3);
  
  // Draw bass circle
  ctx.beginPath();
  ctx.arc(adjustedCx, adjustedCy, bassRadius, 0, Math.PI * 2);
  const bassGradient = ctx.createRadialGradient(adjustedCx, adjustedCy, 0, adjustedCx, adjustedCy, bassRadius);
  bassGradient.addColorStop(0, 'rgba(141, 21, 58, 0)'); 
  bassGradient.addColorStop(0.7, 'rgba(141, 21, 58, 0.1)');
  bassGradient.addColorStop(1, 'rgba(141, 21, 58, 0.3)');
  ctx.fillStyle = bassGradient;
  ctx.fill();
  
  // Draw mid circle
  ctx.beginPath();
  ctx.arc(adjustedCx, adjustedCy, midRadius, 0, Math.PI * 2);
  const midGradient = ctx.createRadialGradient(adjustedCx, adjustedCy, 0, adjustedCx, adjustedCy, midRadius);
  midGradient.addColorStop(0, 'rgba(214, 139, 75, 0)');
  midGradient.addColorStop(0.7, 'rgba(214, 139, 75, 0.2)');
  midGradient.addColorStop(1, 'rgba(214, 139, 75, 0.4)');
  ctx.fillStyle = midGradient;
  ctx.fill();
  
  // Draw treble circle
  ctx.beginPath();
  ctx.arc(adjustedCx, adjustedCy, trebleRadius, 0, Math.PI * 2);
  const trebleGradient = ctx.createRadialGradient(adjustedCx, adjustedCy, 0, adjustedCx, adjustedCy, trebleRadius);
  trebleGradient.addColorStop(0, 'rgba(45, 95, 76, 0.4)');
  trebleGradient.addColorStop(0.7, 'rgba(45, 95, 76, 0.2)');
  trebleGradient.addColorStop(1, 'rgba(45, 95, 76, 0)');
  ctx.fillStyle = trebleGradient;
  ctx.fill();
  
  // Draw frequency bars in a circle
  const barCount = 180;
  const barWidth = 2;
  const barMaxHeight = maxRadius * 0.8;
  
  for (let i = 0; i < barCount; i++) {
    const angle = (i / barCount) * Math.PI * 2;
    const freqIndex = Math.floor(map(i, 0, barCount, 0, frequencyData.length));
    const value = frequencyData[freqIndex] / 255;
    
    // Make all lines move similarly by using consistent multipliers
    let multiplier;
    if (freqIndex < 40) { // Red/maroon lines
      multiplier = 1.0 + (bassLevel * 0.8); // Adjusted to be similar to other lines
    } else if (freqIndex < 80) { // Orange lines
      multiplier = 1.0 + (midLevel * 0.8);
    } else { // Green lines
      multiplier = 1.0 + (trebleLevel * 0.8);
    }
    
    const barHeight = value * barMaxHeight * multiplier;
    
    const startX = adjustedCx + Math.cos(angle) * maxRadius;
    const startY = adjustedCy + Math.sin(angle) * maxRadius;
    
    const endX = adjustedCx + Math.cos(angle) * (maxRadius + barHeight);
    const endY = adjustedCy + Math.sin(angle) * (maxRadius + barHeight);
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    
    // Color based on frequency range - using colors matching the elephant image
    let barColor;
    if (freqIndex < 40) {
      barColor = 'rgba(141, 21, 58, 0.8)'; // Maroon
    } else if (freqIndex < 80) {
      barColor = 'rgba(214, 139, 75, 0.8)'; // Earthy orange
    } else {
      barColor = 'rgba(45, 95, 76, 0.8)';   // Forest green
    }
    
    ctx.strokeStyle = barColor;
    ctx.lineWidth = barWidth;
    ctx.stroke();
  }
}

function drawWaveform(w, h, timeData) {
  // Draw waveform at the bottom
  const waveformHeight = h * 0.15;
  const waveformY = h * 0.75;
  
  ctx.beginPath();
  ctx.moveTo(0, waveformY);
  
  for (let i = 0; i < timeData.length; i++) {
    const x = (i / timeData.length) * w;
    const normalizedValue = (timeData[i] / 128) - 1; // -1 to 1
    const y = waveformY + normalizedValue * waveformHeight;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  // Create gradient for waveform - using colors matching the elephant image
  const gradient = ctx.createLinearGradient(0, waveformY - waveformHeight, 0, waveformY + waveformHeight);
  gradient.addColorStop(0, 'rgba(141, 21, 58, 0.8)');  // Maroon
  gradient.addColorStop(0.33, 'rgba(214, 139, 75, 0.8)'); // Earthy orange
  gradient.addColorStop(0.66, 'rgba(242, 193, 102, 0.8)'); // Soft gold
  gradient.addColorStop(1, 'rgba(45, 95, 76, 0.8)');    // Forest green
  gradient.addColorStop(0.5, 'rgba(235, 116, 0, 0.8)'); // Orange
  gradient.addColorStop(1, 'rgba(0, 86, 65, 0.8)');    // Green
  
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function animateEqBars(frequencyData) {
  // Animate equalizer bars
  eqBars.forEach((bar, i) => {
    // Sample different frequency ranges for each bar
    const freqIndex = 10 + i * 20;
    const value = frequencyData[freqIndex] / 255;
    
    // Scale the bar height
    const scaleY = 0.2 + value * 2;
    bar.style.transform = `scaleY(${scaleY})`;
    
    // Change color based on intensity - using Sri Lankan colors
    const colors = [
      '#8D153A', // Maroon
      '#EB7400', // Orange
      '#005641', // Green
      '#FFD100', // Yellow
      '#3498db'  // Blue (keep one original color)
    ];
    
    // Cycle through colors based on intensity
    const colorIndex = Math.floor(value * colors.length);
    bar.style.backgroundColor = colors[Math.min(colorIndex, colors.length - 1)];
  });
  
  // Animate border based on bass level
  const slBorder = document.querySelector('.sl-border');
  if (slBorder) {
    const bassIndex = 20; // Bass frequency index
    const bassValue = frequencyData[bassIndex] / 255;
    slBorder.style.opacity = 0.4 + bassValue * 0.6;
  }
}

draw();

playBtn.addEventListener('click', async () => {
  initAudio();
  await audioCtx.resume();
  audioEl.play();
  playBtn.textContent = 'PAUSE';
});

document.getElementById('stage').addEventListener('click', (e) => {
  if (e.target.id === 'playBtn') return;
  if (!audioCtx) { playBtn.click(); return; }
  if (audioEl.paused) {
    audioEl.play();
    playBtn.textContent = 'PAUSE';
  } else {
    audioEl.pause();
    playBtn.textContent = 'PLAY';
  }
});

// Color palette - updated with colors matching the elephant image
const colorPalette = {
  primary: '#4A6D8B',   // Muted blue
  secondary: '#2D5F4C',  // Forest green
  accent: '#8D153A',     // Maroon
  accent2: '#D68B4B',    // Earthy orange
  accent3: '#F2C166',    // Soft gold
  dark: '#2c3e50'
};

// Update the colors array for equalizer bars
const colors = [
  '#8D153A', // Maroon
  '#D68B4B', // Earthy orange
  '#2D5F4C', // Forest green
  '#F2C166', // Soft gold
  '#4A6D8B'  // Muted blue
];
  accent4: '#6D4C3D'     // Rich brown

