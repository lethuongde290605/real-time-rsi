from flask import Blueprint, render_template, jsonify

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    try:
        return render_template('index.html')
    except Exception as e:
        # Fallback if template fails
        return jsonify({
            "message": "Real-time RSI Tracker API",
            "status": "running",
            "endpoints": [
                "/rsi?tokens=BTC/USDC&interval=60",
                "/health"
            ]
        })

@bp.route('/chart/<tokenA>/<tokenB>')
def chart(tokenA, tokenB):
    try:
        return render_template('chart.html', tokenA=tokenA, tokenB=tokenB)
    except Exception as e:
        return jsonify({"error": f"Chart not available: {str(e)}"}), 500

@bp.route('/watchlist')
def watchlist():
    try:
        return render_template('watchlist.html')
    except Exception as e:
        return jsonify({"error": f"Watchlist not available: {str(e)}"}), 500

@bp.route("/multi_rsi")
def show_multi_rsi():
    try:
        return render_template("multi_rsi.html")
    except Exception as e:
        return jsonify({"error": f"Multi RSI not available: {str(e)}"}), 500