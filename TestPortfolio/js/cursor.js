// Custom cursor effects
document.addEventListener('DOMContentLoaded', () => {
    // Create cursor elements
    const cursor = document.createElement('div');
    const cursorRing = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursorRing.className = 'cursor-ring';
    document.body.appendChild(cursor);
    document.body.appendChild(cursorRing);

    let cursorVisible = false;
    let cursorEnlarged = false;
    
    // Cache cursor positions
    let clientX = -100;
    let clientY = -100;
    let lastX = -100;
    let lastY = -100;
    
    let rafId = null;
    let lastMoveTime = 0;
    const inactivityDelay = 2000; // Hide cursor after 2 seconds of inactivity

    // Update cursor position with debounced RAF
    const render = () => {
        cursor.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) rotate(${cursorEnlarged ? '0' : '45'}deg)`;
        cursorRing.style.transform = `translate3d(${lastX}px, ${lastY}px, 0)`;
        
        // Smooth follow for ring
        const dx = clientX - lastX;
        const dy = clientY - lastY;
        lastX += dx * 0.35;
        lastY += dy * 0.35;
        
        rafId = requestAnimationFrame(render);
    };

    // Hide cursor after inactivity
    const hideCursor = () => {
        if (cursorVisible) {
            cursorVisible = false;
            cursor.style.opacity = 0;
            cursorRing.style.opacity = 0;
        }
    };

    // Throttled mousemove handler
    document.addEventListener('mousemove', e => {
        const now = performance.now();
        if (now - lastMoveTime < 16) return; // Skip if less than 16ms (60fps)
        lastMoveTime = now;
        
        clientX = e.clientX;
        clientY = e.clientY;
        
        // Show cursor
        if (!cursorVisible) {
            cursorVisible = true;
            cursor.style.opacity = 1;
            cursorRing.style.opacity = 1;
        }
        
        // Clear any existing hide timeout
        if (window.cursorTimeout) {
            clearTimeout(window.cursorTimeout);
        }
        
        // Set new hide timeout
        window.cursorTimeout = setTimeout(hideCursor, inactivityDelay);
        
        // Start animation if not running
        if (!rafId) {
            rafId = requestAnimationFrame(render);
        }
    });

    // Optimized event handlers
    const handleMouseOver = e => {
        if (e.target.matches('a, button, input[type="button"], input[type="submit"], [role="button"], .clickable')) {
            cursorEnlarged = true;
            cursor.classList.add('cursor-hover');
            cursorRing.classList.add('cursor-ring-hover');
        }
    };

    const handleMouseOut = e => {
        if (e.target.matches('a, button, input[type="button"], input[type="submit"], [role="button"], .clickable')) {
            cursorEnlarged = false;
            cursor.classList.remove('cursor-hover');
            cursorRing.classList.remove('cursor-ring-hover');
        }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    // Click effects
    document.addEventListener('mousedown', () => {
        cursor.classList.add('cursor-click');
        cursorRing.classList.add('cursor-ring-click');
    });

    document.addEventListener('mouseup', () => {
        cursor.classList.remove('cursor-click');
        cursorRing.classList.remove('cursor-ring-click');
    });

    // Visibility handling
    document.addEventListener('mouseleave', () => {
        cursorVisible = false;
        cursor.style.opacity = 0;
        cursorRing.style.opacity = 0;
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    });

    // Cleanup on window blur
    window.addEventListener('blur', () => {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        hideCursor();
    });

    // Initial hide
    hideCursor();
});