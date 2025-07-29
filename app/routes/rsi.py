# app/routes/rsi.py
from flask import Blueprint, request, jsonify
from rsi.fetcher import price_cache
from rsi.calculator import compute_rsi
from rsi.ws_client import subscribe_pair, unsubscribe_pair
from rsi.storage import load_rsi_cache_from_file
import os
import json

bp = Blueprint("rsi", __name__)

@bp.route("/rsi_data")
def rsi_data():
    interval = int(request.args.get("interval", 60))
    all_data = load_rsi_cache_from_file()
    result = {}

    for key, rsi_list in all_data.items():
        if not key.endswith(f"_{interval}"):
            continue
        token = key.rsplit("_", 1)[0]
        result[token] = {
            f"rsi_{interval}s": rsi_list[-100:]  # Lấy 100 điểm cuối
        }
    return jsonify(result)

@bp.route("/rsi_history")
def get_rsi_history():
    token = request.args.get("token")
    interval = request.args.get("interval")
    filename = f"rsi_data/{token.replace('/', '')}_{interval}s.json"

    if not os.path.exists(filename):
        return jsonify([])

    with open(filename, "r") as f:
        return jsonify(json.load(f))


@bp.route("/unsubscribe")
def unsubscribe():
    token = request.args.get("token")
    unsubscribe_pair(token)
    return jsonify({"status": "success"})

@bp.route("/rsi")
def get_rsi():
    tokens = request.args.get("tokens", "BTC/USDC")
    interval = int(request.args.get("interval", 60))

    for token in tokens.split(","):
        subscribe_pair(token.strip().upper())  # 🔁 Đăng ký từng cặp
    
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

    return jsonify(results)
