import time

price_cache = {}  # { "BTC/USDC_60": [(timestamp, price), ...] }

def handle_price_update(data):
    token = data.get("pair").upper()
    price = float(data.get("priceUsd"))
    current_time = time.time()  # Timestamp chính xác

    for interval in [1, 5, 30, 60]:  # Các khung 1s, 5s, 30s, 60s
        key = f"{token}_{interval}"
        if key not in price_cache:
            price_cache[key] = []

        # Tính thời điểm bắt đầu của khung hiện tại (ví dụ: khung 5s sẽ có các mốc 0, 5, 10,... giây)
        interval_start = int(current_time) // interval * interval

        # Chỉ lưu giá CUỐI CÙNG của mỗi khung
        if not price_cache[key] or interval_start > price_cache[key][-1][0]:
            price_cache[key].append((interval_start, price))
        else:
            # Cập nhật giá cuối cùng nếu cùng khung thời gian
            price_cache[key][-1] = (interval_start, price)

        # Giới hạn bộ nhớ
        if len(price_cache[key]) > 200:
            price_cache[key] = price_cache[key][-200:]
