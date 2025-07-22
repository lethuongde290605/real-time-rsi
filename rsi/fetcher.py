import requests
import time

price_cache = {}

def get_price_pair_dexscreener(pair_symbol):
    # Ví dụ pair_symbol = "SOL/USDC"
    url = f"https://api.dexscreener.com/latest/dex/search/?q={pair_symbol}"

    try:
        response = requests.get(url)
        data = response.json()

        if "pairs" in data and len(data["pairs"]) > 0:
            first_pair = data["pairs"][0]
            price = float(first_pair["priceUsd"])  # Giá của base theo USD
            return price
        else:
            print(f"[⚠️] Không tìm thấy dữ liệu cho {pair_symbol}")
            return None

    except Exception as e:
        print(f"Lỗi khi lấy giá cho {pair_symbol}: {e}")
        return None

def update_price_history(pair_symbol, interval_seconds):
    now = int(time.time())
    key = f"{pair_symbol}_{interval_seconds}"

    if key not in price_cache:
        price_cache[key] = []

    price = get_price_pair_dexscreener(pair_symbol)
    
    if price:
        price_cache[key].append((now, price))
        price_cache[key] = price_cache[key][-100:]  # Chỉ giữ 100 điểm gần nhất
