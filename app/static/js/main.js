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
