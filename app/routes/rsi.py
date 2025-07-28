# app/routes/rsi.py
from flask import Blueprint, request, jsonify
from rsi.fetcher import price_cache
from rsi.calculator import compute_rsi
from rsi.ws_client import subscribe_pair, unsubscribe_pair

bp = Blueprint("rsi", __name__)

def get_latest_price(pair):
    for interval in [1, 5, 30, 60]:
        key = f"{pair}_{interval}"
        if key in price_cache and price_cache[key]:
            return price_cache[key][-1][1]
    return None

@bp.route("/unsubscribe")
def unsubscribe():
    token = request.args.get("token")
    unsubscribe_pair(token)
    return jsonify({"status": "success"})

@bp.route("/rsi")
def get_rsi():
    tokens = request.args.get("tokens", "BTC/USDC")
    interval = int(request.args.get("interval", 60))
    subscribe_pair(tokens)
    print(tokens)
    
    results = {}
    for pair in tokens.split(","):
        pair = pair.strip().upper()
        key = f"{pair}_{interval}"
        
        if key not in price_cache or len(price_cache[key]) < 15:  # Cần ít nhất 14 khung + 1 giá mới
            continue
            
        # Lấy dữ liệu 14 khung gần nhất + giá hiện tại
        price_data = price_cache[key][-15:]
        rsi_val = compute_rsi(price_data)
        
        if rsi_val is not None:
            results[pair] = {f"rsi_{interval}s": rsi_val}

    print(results)
    return jsonify(results)
