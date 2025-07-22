from flask import Blueprint, request, jsonify, render_template
import json, os
from rsi.fetcher import update_price_history, price_cache
from rsi.calculator import compute_rsi

bp = Blueprint("rsi", __name__)
rsi_cache_file = "data/rsi_cache.json"

def load_rsi_cache():
    if not os.path.exists(rsi_cache_file):
        return {}

    # Kiểm tra nếu file rỗng thì trả về dict rỗng luôn
    if os.path.getsize(rsi_cache_file) == 0:
        return {}

    with open(rsi_cache_file, "r") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            # Nếu file hỏng → ghi đè lại file rỗng
            print("⚠️ File rsi_cache.json bị lỗi, đang reset lại.")
            return {}

# Lưu cache RSI vào file
def save_rsi_cache(cache):
    os.makedirs(os.path.dirname(rsi_cache_file), exist_ok=True)
    with open(rsi_cache_file, "w") as f:
        json.dump(cache, f)

@bp.route("/rsi")
def get_rsi(period = 14):
    tokens = request.args.get("tokens", "BTC/USDC")
    interval = int(request.args.get("interval", 60))

    rsi_cache = load_rsi_cache()
    results = {}

    for pair in tokens.split(","):
        update_price_history(pair, interval)
        key = f"{pair}_{interval}"
        prices = [p for _, p in price_cache.get(key, [])]

        if len(prices) >= period + 1:
            rsi_value = compute_rsi(prices)

            # Thêm RSI mới vào cache mảng
            if key not in rsi_cache:
                rsi_cache[key] = []
            rsi_cache[key].append(rsi_value)
            # Cắt bớt nếu dài quá
            rsi_cache[key] = rsi_cache[key][-100:]

            results[pair] = {
                f"rsi_{interval}s": rsi_cache[key]
            }

            save_rsi_cache(rsi_cache)
    return jsonify(results)
