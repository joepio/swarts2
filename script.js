document.addEventListener('DOMContentLoaded', () => {
    const contactBtn = document.getElementById('contact-btn');
    const popover = document.getElementById('contact-popover');
    const popoverContent = popover.querySelector('.popover-content');

    // Toggle Popover
    contactBtn.addEventListener('click', () => {
        popover.classList.remove('hidden');
        // Force reflow
        void popover.offsetWidth;
        popover.classList.add('visible');
    });

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

    // Carousel Logic: duplicate items for infinite loop
    const track = document.getElementById('carousel-track');
    // Clone children to ensure we have enough for a seamless loop
    // Ideally we want 2 sets of items.
    // The current HTML has manually duplicated items, but we can do it programmatically to be safe.
    // Let's just double the content.
    const items = Array.from(track.children);
    items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
    });

    // Adjust animation duration based on total width if needed, but CSS fixed duration is okay for now.
});
