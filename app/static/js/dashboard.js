// dashboard.js - Dashboard logic for home page

document.addEventListener('DOMContentLoaded', () => {
    const tokenTableBody = document.getElementById('token-table-body');
    const searchInput = document.getElementById('search-input');
    const searchDropdown = document.getElementById('search-dropdown');
    const chartModalEl = document.getElementById('chart-modal');
    const chartModal = chartModalEl ? new bootstrap.Modal(chartModalEl) : null;
    const chartCanvasEl = document.getElementById('token-chart');
    const chartCanvas = chartCanvasEl ? chartCanvasEl.getContext('2d') : null;
    let chartInstance = null;
    let allTokens = [];

    // Initialize ScrollReveal
    if (window.ScrollReveal) {
        ScrollReveal().reveal('.reveal-item', {
            delay: 200,
            distance: '50px',
            origin: 'bottom',
            interval: 100,
            easing: 'ease-in-out',
            mobile: false
        });
        ScrollReveal().reveal('.section-title', {
            delay: 100,
            distance: '30px',
            origin: 'top',
            easing: 'ease-out'
        });
    }

    async function fetchTokenData() {
        try {
            const COINGECKO_API_URL = "https://api.coingecko.com/api/v3/coins/markets";
            const params = new URLSearchParams({
                vs_currency: 'usd',
                category: 'solana-ecosystem',
                order: 'market_cap_desc',
                per_page: 100,
                page: 1,
                sparkline: 'false'
            });
            const response = await fetch(`${COINGECKO_API_URL}?${params.toString()}`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.status?.error_message || 'Could not fetch data from CoinGecko.');
            }
            allTokens = data.map((coin, index) => ({
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol.toUpperCase(),
                price: coin.current_price || 0,
                volume24h: coin.total_volume || 0,
                change24h: coin.price_change_percentage_24h || 0,
                marketCap: coin.market_cap || 0,
                image: coin.image
            }));
            updateTokenList(allTokens);
        } catch (error) {
            console.error('Error fetching token data:', error);
            if (tokenTableBody)
                tokenTableBody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Không thể tải dữ liệu token từ CoinGecko. Vui lòng thử lại sau.</td></tr>';
        }
    }

    function updateTokenList(tokens) {
        if (!tokenTableBody) return;
        tokenTableBody.innerHTML = '';
        if (tokens.length === 0) {
            tokenTableBody.innerHTML = '<tr><td colspan="5" class="text-center text-secondary">Không tìm thấy token phù hợp.</td></tr>';
            return;
        }
        tokens.forEach((token, index) => {
            const row = document.createElement('tr');
            row.classList.add('reveal-item-table');
            const change24hClass = token.change24h >= 0 ? 'positive' : 'negative';
            row.innerHTML = `
                <td>
                    <span class="rank">#${index + 1}</span>
                    ${token.image ? `<img src="${token.image}" alt="${token.name} logo" class="token-logo">` : ''}
                    <span class="token-name">${token.name}</span>
                    <span class="token-symbol">(${token.symbol})</span>
                </td>
                <td>$${token.price.toFixed(5)}</td>
                <td>$${token.volume24h.toLocaleString()}</td>
                <td class="${change24hClass}">${token.change24h.toFixed(2)}%</td>
                <td>$${token.marketCap.toLocaleString()}</td>
            `;
            row.addEventListener('click', () => {
                window.location.href = `/chart/${token.symbol.toLowerCase()}/usd`;
            });
            tokenTableBody.appendChild(row);
        });
        if (window.ScrollReveal) {
            ScrollReveal().reveal('.reveal-item-table', {
                delay: 0,
                distance: '20px',
                origin: 'bottom',
                interval: 50,
                easing: 'ease-out',
                mobile: false
            });
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const filteredTokens = allTokens.filter(token =>
                token.name.toLowerCase().includes(searchTerm) ||
                token.symbol.toLowerCase().includes(searchTerm)
            );
            updateTokenList(filteredTokens);
        });
    }

    fetchTokenData();
    setInterval(fetchTokenData, 60000);
});
