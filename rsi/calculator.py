def compute_rsi(prices, period=14):
    """Tính RSI từ chuỗi giá đóng cửa các khung thời gian"""
    if len(prices) < period + 1:
        return None

    # Lấy giá đóng cửa (bỏ qua timestamp)
    closing_prices = [p[1] for p in prices] if isinstance(prices[0], (list, tuple)) else prices

    # Tính toán RSI theo công thức gốc
    deltas = [closing_prices[i] - closing_prices[i-1] for i in range(1, len(closing_prices))]
    avg_gain = sum(max(0, d) for d in deltas[:period]) / period
    avg_loss = sum(max(0, -d) for d in deltas[:period]) / period

    if avg_loss == 0:
        return 100.0
    rs = avg_gain / avg_loss
    return round(100 - (100 / (1 + rs)), 2)