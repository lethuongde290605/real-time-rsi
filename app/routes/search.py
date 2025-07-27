from flask import Blueprint, request, jsonify
import requests

bp = Blueprint('search', __name__)

@bp.route('/search')
def search():
    query = request.args.get('q', '').strip()
    if not query:
        return jsonify([])

    try:
        url = f"https://api.dexscreener.com/latest/dex/search/?q={query}"
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()

        results = []
        for item in data.get("pairs", [])[:10]:
            base = item.get("baseToken", {})
            quote = item.get("quoteToken", {})
            results.append({
                "name": f"{base.get('symbol')}/{quote.get('symbol')}",
                "symbol": base.get("symbol"),
                "logo": base.get("icon"),
                "price": item.get("priceUsd"),
                "volume": item.get("volume", {}).get("h24", "0"),
                "chain": item.get("chainId") or item.get("chain"),
                "address": item.get("pairAddress") or item.get("url")
            })

        return jsonify(results)

    except Exception as e:
        print(f"Search error: {e}")
        return jsonify([]), 500
