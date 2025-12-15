document.addEventListener('DOMContentLoaded', () => {
    const contactBtn = document.getElementById('contact-btn');
    const popover = document.getElementById('contact-popover');
    const popoverContent = popover.querySelector('.popover-content');

    const closeBtn = document.getElementById('close-popover'); // Get button

    // Toggle Popover
    contactBtn.addEventListener('click', () => {
        popover.classList.remove('hidden');
        // Force reflow
        void popover.offsetWidth;
        popover.classList.add('visible');
    });

    // Close on button click
    if (closeBtn) {
        closeBtn.addEventListener('click', closePopover);
    }

    // Close on click outside
    popover.addEventListener('click', (e) => {
        if (e.target === popover) {
            closePopover();
        }
    });

    // Close function
    function closePopover() {
        popover.classList.remove('visible');
        // Wait for transition to finish before hiding display (optional, but cleaner if we used display:none)
        // Here we just use opacity/transform, so removing visible is enough.
        // But if we want to add 'hidden' back for accessibility/perf after animation:
        setTimeout(() => {
            if (!popover.classList.contains('visible')) {
                popover.classList.add('hidden');
            }
        }, 400);
    }

    // Carousel Logic: JS-driven for Momentum compatibility
    const container = document.querySelector('.carousel-container');
    const track = document.getElementById('carousel-track');

    // Duplicate items for infinite loop (ensure we have enough content)
    // We already have some duplicates from build script maybe, but let's be safe.
    // Actually, simply cloning the current set once more is safer for wide screens.
    const items = Array.from(track.children);
    items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
    });

    let autoScrollSpeed = 0.5; // Adjustable speed
    let isUserInteracting = false;
    let lastScrollPos = container.scrollLeft;

    // Interaction listeners to pause auto-scroll instantly
    const stopInteracting = () => { isUserInteracting = false; };
    const startInteracting = () => { isUserInteracting = true; };

    container.addEventListener('touchstart', startInteracting, { passive: true });
    container.addEventListener('mousedown', startInteracting);

    container.addEventListener('touchend', stopInteracting);
    container.addEventListener('mouseup', stopInteracting);
    container.addEventListener('mouseleave', stopInteracting);

    // Animation Loop
    function animate() {
        if (!isUserInteracting) {
            // Check if momentum is active
            // We compare current scroll position with where we expect it to be.
            // Or simpler: We check if the position changed significantly since last frame WITHOUT our input.
            // But we can't easily distinguish.
            // Better heuristic: checks if position is the same as last frame.
            // If it IS stable, we push it. If it's moving, we assume momentum and let it ride.

            const currentScroll = container.scrollLeft;

            // If the position hasn't changed (or changed very little), we assume it stopped.
            // We give it a small threshold because sub-pixel rendering might oscillate.
            if (Math.abs(currentScroll - lastScrollPos) < 1) {
                container.scrollLeft += autoScrollSpeed;
            } else {
                // It is moving (momentum or user drag just finished but still dispatching events)
                // Just update references
            }
        }

        lastScrollPos = container.scrollLeft;

        // Infinite Wrap Logic
        // If we've scrolled past half the width (the original set), jump back to 0.
        // NOTE: scrollWidth changes as images load. Safest to check constantly.
        // We assume track has 2 identical sets.
        // 5 is a buffer to avoid flickering at exact boundary
        if (container.scrollLeft >= (container.scrollWidth / 2)) {
            container.scrollLeft -= (container.scrollWidth / 2);
            lastScrollPos = container.scrollLeft; // Sync lastPos to avoid "momentum" detection on the jump
        }

        requestAnimationFrame(animate);
    }

    // Start
    requestAnimationFrame(animate);
});
