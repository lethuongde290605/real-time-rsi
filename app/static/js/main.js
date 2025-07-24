document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const toggleSidebarBtn = document.getElementById('sidebar-toggle');
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const searchModal = new bootstrap.Modal(document.getElementById('search-modal'));
    const searchButtonInNavbar = document.querySelector('.navbar-actions .icon-button:first-child'); // Assuming search is the first icon button

    // GSAP Timeline for sidebar animation
    let sidebarTimeline = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut", duration: 0.3 } });

    // Initial state: collapsed
    gsap.set(sidebar, { width: 'var(--sidebar-collapsed-width)' });
    gsap.set('.sidebar-text', { autoAlpha: 0, maxWidth: 0 });
    gsap.set('.content-container', { marginLeft: 'var(--sidebar-collapsed-width)', width: 'calc(100% - var(--sidebar-collapsed-width))' });
    gsap.set(toggleSidebarBtn, { left: 'calc(var(--sidebar-collapsed-width) - 20px)' }); // Adjust toggle button position for collapsed state


    sidebarTimeline
        .to(sidebar, { width: 'var(--sidebar-width)' })
        .to('.sidebar-text', { autoAlpha: 1, maxWidth: '100%', delay: 0 }, "<") // Animate text in
        .to('.content-container', { marginLeft: 'var(--sidebar-width)', width: 'calc(100% - var(--sidebar-width))' }, "<")
        .to(toggleSidebarBtn, { left: 'calc(var(--sidebar-width) - 20px)' }, "<"); // Animate toggle button for expanded state

    if (toggleSidebarBtn && sidebar) {
        toggleSidebarBtn.addEventListener('click', () => {
            if (sidebar.classList.contains('collapsed')) {
                sidebarTimeline.play();
                sidebar.classList.remove('collapsed');
                document.body.classList.remove('sidebar-collapsed'); // Remove class from body for content adjustment
                toggleSidebarBtn.innerHTML = '<i class="fas fa-chevron-left"></i>'; // Change icon to collapse
            } else {
                sidebarTimeline.reverse();
                sidebar.classList.add('collapsed');
                document.body.classList.add('sidebar-collapsed'); // Add class to body for content adjustment
                toggleSidebarBtn.innerHTML = '<i class="fas fa-bars"></i>'; // Change icon to expand
            }
        });
    } else {
        console.warn('Sidebar or toggle button not found');
    }

    // Initial state setup (collapsed by default, so set classes)
    sidebar.classList.add('collapsed');
    document.body.classList.add('sidebar-collapsed');
    // Ensure the correct icon is set at page load based on initial state
    toggleSidebarBtn.innerHTML = '<i class="fas fa-bars"></i>';


    // Highlight active sidebar item
    function setActiveSidebarItem() {
        const currentPath = window.location.pathname;

        sidebarItems.forEach(item => {
            item.classList.remove('active'); // Always remove active first

            const targetPage = item.getAttribute('data-target-page');

            if (currentPath === '/') { // Special handling for homepage
                if (targetPage === '/') {
                    item.classList.add('active');
                }
            } else { // For all other pages
                // Check if targetPage is not '/' and currentPath starts with targetPage
                if (targetPage && targetPage !== '/' && currentPath.startsWith(targetPage)) {
                    item.classList.add('active');
                }
            }
        });
    }

    // Initial call to set active item
    setActiveSidebarItem();

    // Event listener for sidebar item clicks (for navigation)
    sidebarItems.forEach(item => {
        item.addEventListener('click', (event) => {
            const targetPage = item.getAttribute('data-target-page');
            if (targetPage) {
                event.preventDefault(); // Prevent default link behavior
                window.location.href = targetPage; // Navigate programmatically
            }
        });
    });

    // --- Search Modal Logic (unchanged from previous iterations, kept for completeness) ---
    // Handle search button click to open modal
    // Note: The search button was in the navbar, which is now removed.
    // Consider where you want to place the search button now (e.g., in sidebar footer or a floating action button).
    // For now, I'm commenting out the event listener that relied on the navbar search button.
    // If you add a new search button element, uncomment and update its ID/class.
    /*
    if (searchButtonInNavbar) {
        searchButtonInNavbar.addEventListener('click', () => {
            searchModal.show();
            // Optional: focus on the search input
            // document.getElementById('search-input').focus();
        });
    }
    */
});
