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
// Sidebar toggle functionality
const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const contentContainer = document.querySelector('.content-container');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    document.body.classList.toggle('sidebar-collapsed');
    if (sidebar.classList.contains('collapsed')) {
        contentContainer.style.marginLeft = '60px';
        contentContainer.style.width = 'calc(100% - 60px)';
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
        contentContainer.style.marginLeft = '250px';
        contentContainer.style.width = 'calc(100% - 250px)';
    }
});

// Mock token data (replace with API call in production)
const tokenData = [
    { name: "SOL", price: 150.25, volume: 1200000, change: 2.5, marketCap: 70000000 },
    { name: "USDC", price: 1.00, volume: 850000, change: -0.1, marketCap: 25000000 },
    { name: "SRM", price: 0.75, volume: 300000, change: 1.8, marketCap: 15000000 }
];

// Function to populate token table
function populateTokenTable() {
    const tokenTable = document.querySelector('#token-table tbody');
    tokenTable.innerHTML = '';
    tokenData.forEach(token => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${token.name}</td>
            <td>$${token.price.toFixed(2)}</td>
            <td>$${token.volume.toLocaleString()}</td>
            <td class="${token.change >= 0 ? 'positive' : 'negative'}">${token.change.toFixed(2)}%</td>
            <td>$${token.marketCap.toLocaleString()}</td>
        `;
        tokenTable.appendChild(row);
    });
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    populateTokenTable();
});
