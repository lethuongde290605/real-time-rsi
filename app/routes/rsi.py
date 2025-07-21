from flask import Blueprint, request, jsonify
from rsi.fetcher import update_price_history, price_cache
from rsi.calculator import compute_rsi

bp = Blueprint("rsi", __name__)

@bp.route("/rsi")
def get_rsi():
    tokens = request.args.get("tokens")
    interval = int(request.args.get("interval", 60))

    if not tokens:
        return jsonify({"error": "Missing tokens param"}), 400

    results = {}
    for pair in tokens.split(","):
        update_price_history(pair, interval)
        key = f"{pair}_{interval}"
        prices = [p for _, p in price_cache.get(key, [])]
        rsi = compute_rsi(prices)
        results[pair] = {f"rsi_{interval}s": rsi}

    return jsonify(results)
