import pandas as pd

def compute_rsi(prices, period=14):
    if len(prices) < period + 1:
        return None  # Chưa đủ dữ liệu để tính

    df = pd.Series(prices[-(period+1):])
    delta = df.diff()

    gain = delta.where(delta > 0, 0).rolling(window=period).mean()
    loss = -delta.where(delta < 0, 0).rolling(window=period).mean()

    rs = gain / loss
    rsi = 100 - (100 / (1 + rs))
    return round(rsi.iloc[-1], 2) if not pd.isna(rsi.iloc[-1]) else None