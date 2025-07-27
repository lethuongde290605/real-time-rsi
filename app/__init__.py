from flask import Flask
from rsi.ws_client import ensure_ws_running

def create_app():
    app = Flask(__name__)

    from .routes import main, search, watchlist, rsi
    app.register_blueprint(main.bp)
    app.register_blueprint(search.bp)
    app.register_blueprint(watchlist.bp)
    app.register_blueprint(rsi.bp)

    ensure_ws_running()

    return app 