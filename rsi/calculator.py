import pandas as pd

def compute_rsi(prices, period=14):
    if len(prices) < period:
        return None  # Không đủ dữ liệu

    deltas = [prices[i] - prices[i - 1] for i in range(1, len(prices))]
    gains = [delta if delta > 0 else 0 for delta in deltas]
    losses = [-delta if delta < 0 else 0 for delta in deltas]

    avg_gain = sum(gains[:period]) / period
    avg_loss = sum(losses[:period]) / period

    if avg_loss == 0:
        return 100.0  # RSI max
    if avg_gain == 0:
        return 0.0    # RSI min

    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    return round(rsi, 2)
