# rsi/fetcher.py

import time
from rsi.calculator import compute_rsi
from rsi.storage import save_rsi_cache_to_file

price_cache = {}     # { "BTC/USDC_60": [(timestamp, price), ...] }
rsi_cache = {}       # { "BTC/USDC_60": [(timestamp, rsi), ...] }

def handle_price_update(data):
    token = data.get("pair").upper()
    price = float(data.get("priceUsd"))
    current_time = time.time()

    for interval in [1, 5, 30, 60]:
        key = f"{token}_{interval}"
        interval_start = int(current_time) // interval * interval

        # --- Cập nhật price_cache (giữ nguyên)
        if key not in price_cache:
            price_cache[key] = []
        if not price_cache[key] or interval_start > price_cache[key][-1][0]:
            price_cache[key].append((interval_start, price))
        else:
            price_cache[key][-1] = (interval_start, price)

        # --- Kiểm tra và lưu RSI (thêm điều kiện trùng lặp)
        if len(price_cache[key]) >= 15:
            rsi_val = compute_rsi(price_cache[key][-15:])
            if rsi_val is not None:
                if key not in rsi_cache:
                    rsi_cache[key] = []

                # Ghi đè nếu đã có timestamp, append nếu chưa
                found = False
                for i, (ts, _) in enumerate(rsi_cache[key]):
                    if ts == interval_start:
                        rsi_cache[key][i] = (interval_start, rsi_val)
                        found = True
                        break
                if not found:
                    rsi_cache[key].append((interval_start, rsi_val))
                    
                    # Giới hạn cache
                    if len(rsi_cache[key]) > 100:
                        rsi_cache[key] = rsi_cache[key][-100:]

    save_rsi_cache_to_file(rsi_cache)  # Lưu file (nếu cần)
