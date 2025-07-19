from flask import Blueprint, request, jsonify
import random

bp = Blueprint('rsi', __name__)

@bp.route('/rsi')
def rsi():
    pair = request.args.get('pair')
    return jsonify({"pair": pair, "rsi": random.randint(0, 100)}) 