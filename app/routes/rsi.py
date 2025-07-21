from flask import Blueprint, request, jsonify, render_template
from rsi.fetcher import update_price_history, price_cache
from rsi.calculator import compute_rsi

bp = Blueprint("rsi", __name__)

@bp.route("/rsi")

def get_rsi():
    tokens = request.args.get("tokens")           # ví dụ: "SOL/USDC"
    interval = int(request.args.get("interval"))  # ví dụ: 60

    results = {}
    for pair in tokens.split(","):
        update_price_history(pair, interval)
        key = f"{pair}_{interval}"
        prices = [p for _, p in price_cache.get(key, [])]
        rsi = compute_rsi(prices)
        results[pair] = {f"rsi_{interval}s": rsi}

    return jsonify(results)
