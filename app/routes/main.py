from flask import Blueprint, render_template

bp = Blueprint('main', __name__)

@bp.route('/')
def index():
    return render_template('index.html')

@bp.route('/chart/<tokenA>/<tokenB>')
def chart(tokenA, tokenB):
    return render_template('chart.html', tokenA=tokenA, tokenB=tokenB)

@bp.route('/watchlist')
def watchlist():
    return render_template('watchlist.html')

@bp.route('/rsi')
def rsi():
    return render_template('multi_rsi.html') 