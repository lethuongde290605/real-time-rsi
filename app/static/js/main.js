document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const toggleSidebarBtn = document.getElementById('sidebar-toggle');
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const searchModal = document.getElementById('search-modal');
    const toggleSearchBtn = document.getElementById('openSearchModal');

    // GSAP Timeline for sidebar animation
    let sidebarTimeline = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut", duration: 0.3 } });

    // Initial state: collapsed
    gsap.set(sidebar, { width: 'var(--sidebar-collapsed-width)' });
    gsap.set('.sidebar-text', { autoAlpha: 0, maxWidth: 0 });
    gsap.set('.content-container', { marginLeft: 'var(--sidebar-collapsed-width)', width: 'calc(100% - var(--sidebar-collapsed-width))' });
    gsap.set(toggleSidebarBtn, { left: 'calc(var(--sidebar-collapsed-width) - 20px)' });

    sidebarTimeline
        .to(sidebar, { width: 'var(--sidebar-width)' })
        .to('.sidebar-text', { autoAlpha: 1, maxWidth: '100%', delay: 0 }, "<")
        .to('.content-container', { marginLeft: 'var(--sidebar-width)', width: 'calc(100% - var(--sidebar-width))' }, "<")
        .to(toggleSidebarBtn, { left: 'calc(var(--sidebar-width) - 20px)' }, "<");

    if (toggleSidebarBtn && sidebar) {
        toggleSidebarBtn.addEventListener('click', () => {
            if (sidebar.classList.contains('collapsed')) {
                sidebarTimeline.play();
                sidebar.classList.remove('collapsed');
                document.body.classList.remove('sidebar-collapsed');
                toggleSidebarBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            } else {
                sidebarTimeline.reverse();
                sidebar.classList.add('collapsed');
                document.body.classList.add('sidebar-collapsed');
                toggleSidebarBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    } else {
        console.warn('Sidebar or toggle button not found');
    }

    sidebar.classList.add('collapsed');
    document.body.classList.add('sidebar-collapsed');
    toggleSidebarBtn.innerHTML = '<i class="fas fa-bars"></i>';

    // Highlight active sidebar item
    function setActiveSidebarItem() {
        const currentPath = window.location.pathname;

        sidebarItems.forEach(item => {
            item.classList.remove('active');
            const targetPage = item.getAttribute('data-target-page');

            if (currentPath === '/') {
                if (targetPage === '/') {
                    item.classList.add('active');
                }
            } else {
                if (targetPage && targetPage !== '/' && currentPath.startsWith(targetPage)) {
                    item.classList.add('active');
                }
            }
        });
    }

    setActiveSidebarItem();

    // ✅ Xử lý riêng cho nút tìm kiếm trong sidebar (không chuyển trang)
    if (toggleSearchBtn && searchModal) {
        toggleSearchBtn.addEventListener('click', (event) => {
            event.preventDefault();
            searchModal.classList.add('show');
            searchModal.classList.remove('hidden');
        });
    }

    // ✅ Các item khác vẫn chuyển trang bình thường
    sidebarItems.forEach(item => {
        const targetPage = item.getAttribute('data-target-page');
        if (targetPage && targetPage !== 'search') {
            item.addEventListener('click', (event) => {
                event.preventDefault();
                window.location.href = targetPage;
            });
        }
    });
});
