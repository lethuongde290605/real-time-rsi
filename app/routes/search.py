from flask import Blueprint, request, jsonify

bp = Blueprint('search', __name__)

@bp.route('/search')
def search():
    query = request.args.get('q', '')
    # mock data
    return jsonify([f"{query.upper()}/USDC", f"{query.upper()}/USDT"]) 