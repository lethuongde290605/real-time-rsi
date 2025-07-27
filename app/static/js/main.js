// Sidebar toggle functionality
const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const contentContainer = document.querySelector('.content-container');

if (sidebarToggle && sidebar && contentContainer) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        document.body.classList.toggle('sidebar-collapsed');
        if (sidebar.classList.contains('collapsed')) {
            contentContainer.style.marginLeft = '60px';
            contentContainer.style.width = 'calc(100% - 60px)';
        } else {
            contentContainer.style.marginLeft = '250px';
            contentContainer.style.width = 'calc(100% - 250px)';
        }
    });
}