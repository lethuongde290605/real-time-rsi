# rsi/ws_client.py

import websocket
import json
import threading
import time
from rsi.fetcher import handle_price_update

subscribed_pairs = set()        # Danh sách cặp đã subscribe
current_ws = None               # WebSocket connection object
ws_started = False              # Trạng thái đã khởi động chưa
lock = threading.Lock()         # Tránh race condition


def normalize_pair(pair):
    return pair.replace("/", "").upper()  # Xóa gạch chéo và viết hoa


def subscribe_pair(pair):
    norm = pair
    with lock:
        if norm in subscribed_pairs:
            return

        subscribed_pairs.add(norm)
        if current_ws:
            stream_name = f"{norm.lower()}@trade"  # btcusdc@trade
            msg = {
                "method": "SUBSCRIBE",
                "params": [stream_name],
                "id": int(time.time())
            }
            current_ws.send(json.dumps(msg))

# Trong ws_client.py
def unsubscribe_pair(pair):
    norm = normalize_pair(pair)
    with lock:
        if norm not in subscribed_pairs:
            return

        subscribed_pairs.remove(norm)
        if current_ws:
            msg = {
                "method": "UNSUBSCRIBE",
                "params": [f"{norm}@trade"],
                "id": int(time.time())
            }
            current_ws.send(json.dumps(msg))
            print(f"📡 Đã hủy subscribe: {pair}")

def on_message(ws, message):
    try:
        data = json.loads(message)
        pair = data.get("s", "")
        price = float(data.get("p", 0))
        
        payload = {
            "pair": pair,
            "priceUsd": price
        }

        handle_price_update(payload)
    except Exception as e:
        print("❌ Lỗi tin nhắn WebSocket:", e, message)



def on_error(ws, error):
    print("❌ WebSocket error:", error)


def on_close(ws, code, msg):
    print(f"❗ WebSocket đóng lại! Code: {code}, Message: {msg}")


def on_open(ws):
    global current_ws
    current_ws = ws
    print("✅ WebSocket Binance đã kết nối")

    if subscribed_pairs:
        print("Còn cặp")
        params = [f"{pair}@trade" for pair in subscribed_pairs]
        msg = {
            "method": "SUBSCRIBE",
            "params": params,
            "id": int(time.time())
        }
        ws.send(json.dumps(msg))

def start_ws():
    print("🌐 Start WebSocket Binance!")
    ws = websocket.WebSocketApp(
        "wss://stream.binance.com:9443/ws",
        on_open=on_open,
        on_message=on_message,
        on_close=on_close,
        on_error=on_error
    )
    ws.run_forever()


def ensure_ws_running():
    global ws_started
    if not ws_started:
        thread = threading.Thread(target=start_ws)
        thread.daemon = True
        thread.start()
        ws_started = True
