from flask import Blueprint, request, jsonify

bp = Blueprint('watchlist', __name__)
watchlist_data = []

@bp.route('/watchlist/add', methods=['POST'])
def add():
    data = request.json
    watchlist_data.append(data['pair'])
    return jsonify(success=True)

@bp.route('/watchlist')
def get_watchlist():
    return jsonify(watchlist_data) 