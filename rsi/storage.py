import json
import os

RSI_FILE = "rsi_data.json"

def save_rsi_cache_to_file(rsi_cache):
    with open(RSI_FILE, "w") as f:
        json.dump(rsi_cache, f)

def load_rsi_cache_from_file():
    if not os.path.exists(RSI_FILE):
        return {}
    with open(RSI_FILE, "r") as f:
        return json.load(f)
