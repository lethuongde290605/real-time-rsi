// --- Khởi chạy khi trang đã tải xong ---
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements & Constants ---
    const themeSwitch = document.getElementById('themeSwitch');
    const chartContainer = document.getElementById('tradingview_chart_container');
    const body = document.body;
    const tradingViewSymbol = `${tokenA}${tokenB}`;

    /**
     * GHI CHÚ QUAN TRỌNG:
     * Dữ liệu thị trường dưới đây là GIẢ LẬP.
     * Trong một ứng dụng thực tế, bạn cần gọi API từ một nhà cung cấp dữ liệu
     * (ví dụ: CoinGecko, CoinMarketCap) để lấy dữ liệu thật.
     */
    function updateMarketInfo() {
        // --- BẮT ĐẦU VÙNG GIẢ LẬP DỮ LIỆU ---
        const lastPrice = 69420.55;
        const priceChange = (Math.random() - 0.5) * 2000;
        const currentPrice = lastPrice + priceChange;
        const priceChangePercent = (priceChange / lastPrice) * 100;
        const high24h = lastPrice + (Math.random() * 1500);
        const low24h = lastPrice - (Math.random() * 1800);
        const volumeToken = 2500 + Math.random() * 500;
        const volumeQuote = volumeToken * currentPrice;
        // --- KẾT THÚC VÙNG GIẢ LẬP DỮ LIỆU ---

        // Cập nhật DOM
        const priceDisplayEl = document.getElementById('price-display');
        const priceChangeEl = document.getElementById('price-change-24h');
        
        priceDisplayEl.textContent = `$${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        const changeText = `${priceChange > 0 ? '+' : ''}${priceChange.toFixed(2)} (${priceChangePercent.toFixed(2)}%)`;
        priceChangeEl.textContent = changeText;

        priceChangeEl.classList.remove('positive', 'negative');
        priceChangeEl.classList.add(priceChange >= 0 ? 'positive' : 'negative');
        
        document.getElementById('high-24h').textContent = `$${high24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        document.getElementById('low-24h').textContent = `$${low24h.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        document.getElementById('volume-24h-token').textContent = `${volumeToken.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        document.getElementById('volume-24h-quote').textContent = `$${volumeQuote.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }

    /**
     * Tạo hoặc tải lại biểu đồ TradingView với theme được chỉ định
     */
    function createTradingViewWidget(theme) {
        // Hiển thị loader trong khi chờ biểu đồ tải
        chartContainer.innerHTML = `<div class="chart-loader"><div class="spinner"></div><p>Đang tải dữ liệu biểu đồ...</p></div>`;
        
        // Thêm một độ trễ nhỏ để đảm bảo DOM được cập nhật
        setTimeout(() => {
            new TradingView.widget({
                "autosize": true,
                "symbol": tradingViewSymbol,
                "interval": "D",
                "timezone": "Asia/Ho_Chi_Minh",
                "theme": theme,
                "style": "1",
                "locale": "en",
                "toolbar_bg": theme === 'light' ? "#ffffff" : "#1e222d",
                "enable_publishing": false,
                "allow_symbol_change": true,
                "container_id": "tradingview_chart_container",
                "studies": [ "RSI@tv-basicstudies", "MACD@tv-basicstudies" ],
                "withdateranges": true,
                "hide_side_toolbar": false,
                "details": true,
                "hotlist": true,
                "calendar": true,
            });
        }, 100);
    }

    /**
     * Áp dụng theme (sáng/tối) cho toàn trang và lưu lựa chọn
     */
    function applyTheme(isDark) {
        localStorage.setItem('isDarkTheme', isDark);
        themeSwitch.checked = isDark;
        body.setAttribute('data-theme', isDark ? 'dark' : 'light');
        createTradingViewWidget(isDark ? 'dark' : 'light');
    }

    // --- KHỞI CHẠY CÁC CHỨC NĂNG ---

    // Gán sự kiện cho công tắc theme
    themeSwitch.addEventListener('change', (event) => applyTheme(event.target.checked));

    // Cập nhật thông tin thị trường ngay lập tức và sau mỗi 5 giây
    updateMarketInfo(); 
    setInterval(updateMarketInfo, 5000);

    // Thiết lập theme ban đầu dựa trên lựa chọn đã lưu hoặc cài đặt của hệ thống
    const savedTheme = localStorage.getItem('isDarkTheme');
    let isDark = savedTheme !== null ? (savedTheme === 'true') : window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(isDark);
});