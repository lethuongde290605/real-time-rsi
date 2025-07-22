// --- DOM Elements & Constants ---
const tokenA = "{{ tokenA }}";
const tokenB = "{{ tokenB }}";
const tradingViewSymbol = `BINANCE:${tokenA}${tokenB}`;

const themeSwitch = document.getElementById('themeSwitch');
const chartContainer = document.getElementById('tradingview_chart_container');
const body = document.body;

/**
 * GHI CHÚ QUAN TRỌNG:
 * Dữ liệu giá dưới đây là GIẢ LẬP.
 * Trong một ứng dụng thực tế, bạn cần gọi API từ một sàn giao dịch (Binance, Bybit)
 * hoặc một nhà cung cấp dữ liệu (CoinGecko, CoinMarketCap) để lấy dữ liệu thật.
 */
function updateMarketInfo() {
    // --- BẮT ĐẦU VÙNG GIẢ LẬP DỮ LIỆU ---
    const lastPrice = 69420.55;
    const priceChange = (Math.random() - 0.5) * 2000;
    const currentPrice = lastPrice + priceChange;
    const priceChangePercent = (priceChange / lastPrice) * 100;
    const high24h = lastPrice + 1500;
    const low24h = lastPrice - 1800;
    const volumeToken = 2500 + Math.random() * 500;
    const volumeQuote = volumeToken * currentPrice;
    // --- KẾT THÚC VÙNG GIẢ LẬP DỮ LIỆU ---

    // TODO: Thay thế vùng giả lập ở trên bằng lệnh fetch API thực tế, ví dụ:
    // fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${tokenA}${tokenB}`)
    //   .then(response => response.json())
    //   .then(data => {
    //      // Cập nhật các biến với dữ liệu từ `data`, ví dụ: currentPrice = parseFloat(data.lastPrice);
    //   });

    // Cập nhật DOM
    const priceDisplayEl = document.getElementById('price-display');
    const priceChangeEl = document.getElementById('price-change-24h');
    
    priceDisplayEl.textContent = `$${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    const changeText = `${priceChange.toFixed(2)} (${priceChangePercent.toFixed(2)}%)`;
    priceChangeEl.textContent = priceChange >= 0 ? `+${changeText}` : changeText;

    priceChangeEl.classList.remove('positive', 'negative');
    if (priceChange >= 0) {
        priceChangeEl.classList.add('positive');
    } else {
        priceChangeEl.classList.add('negative');
    }
    
    document.getElementById('high-24h').textContent = `$${high24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('low-24h').textContent = `$${low24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('volume-24h-token').textContent = `${volumeToken.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById('volume-24h-quote').textContent = `$${volumeQuote.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}


/**
 * Tạo hoặc tải lại biểu đồ TradingView
 */
function createTradingViewWidget(theme) {
    chartContainer.innerHTML = `<div class="chart-loader d-flex flex-column justify-content-center align-items-center h-100"><div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status"></div><p class="mt-3">Đang tải dữ liệu biểu đồ...</p></div>`;
    
    setTimeout(() => {
        new TradingView.widget({
            "autosize": true,
            "symbol": tradingViewSymbol,
            "interval": "D",
            "timezone": "Asia/Ho_Chi_Minh",
            "theme": theme,
            "style": "1",
            "locale": "en",
            "toolbar_bg": theme === 'light' ? "#ffffff" : "#161b22",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "container_id": "tradingview_chart_container",
            "studies": [ "RSI@tv-basicstudies", "MACD@tv-basicstudies" ],
        });
    }, 50);
}

/**
 * Áp dụng theme (sáng/tối) cho toàn trang
 */
function applyTheme(isDark) {
    localStorage.setItem('isDarkTheme', isDark);
    themeSwitch.checked = isDark;
    
    body.classList.toggle('dark-mode', isDark);
    body.classList.toggle('light-mode', !isDark);
    
    createTradingViewWidget(isDark ? 'dark' : 'light');
}

// --- Khởi chạy khi tải trang ---
themeSwitch.addEventListener('change', (event) => applyTheme(event.target.checked));

document.addEventListener('DOMContentLoaded', () => {
    // Cập nhật thông tin thị trường
    updateMarketInfo(); 
    // Lặp lại việc cập nhật sau mỗi 5 giây để giả lập real-time
    setInterval(updateMarketInfo, 5000);

    // Thiết lập theme ban đầu
    const savedTheme = localStorage.getItem('isDarkTheme');
    let isDark = savedTheme !== null ? (savedTheme === 'true') : window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(isDark);
});