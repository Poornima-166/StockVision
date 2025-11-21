# app/models/train_model.py
import yfinance as yf
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os

STOCKS = ["AAPL", "MSFT", "TSLA", "GOOGL", "AMZN","BMY", "WMT", "GILD", "LLY", "NVDA",
          "JPM", "V", "MA", "DIS", "NFLX", "PYPL", "ADBE", "INTC", "CSCO",
          "PFE", "MRK", "ABBV", "T", "VZ", "KO", "PEP", "NKE", "MCD", "SBUX",
          "BA", "CAT", "GE", "F", "GM", "XOM", "CVX", "SLB", "COP", "C",
          "WFC", "BAC", "GS", "MS", "AXP", "BK", "USB", "TD", "RY", "BNS"]

def train_stock(symbol):
    print(f" Training model for {symbol} ...")
    data = yf.download(symbol, period="2y", interval="1d")

    data["Return"] = data["Close"].pct_change()
    data["SMA5"] = data["Close"].rolling(window=5).mean()
    data["SMA20"] = data["Close"].rolling(window=20).mean()
    data.dropna(inplace=True)

    if len(data) < 40:
        print(f"⚠️ Not enough data for {symbol}")
        return

    # Target: 1 if next day close > current close
    data["Target"] = (data["Close"].shift(-1) > data["Close"]).astype(int)

    X = data[["Close", "Volume", "SMA5", "SMA20", "Return"]]
    y = data["Target"]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_scaled, y)

    # Save model and scaler
    os.makedirs("app/models", exist_ok=True)
    joblib.dump(model, f"app/models/{symbol}_model.pkl")
    joblib.dump(scaler, f"app/models/{symbol}_scaler.pkl")

    print(f"✅ Saved model for {symbol}")

def train_all():
    for symbol in STOCKS:
        try:
            train_stock(symbol)
        except Exception as e:
            print(f"❌ Failed for {symbol}: {e}")

if __name__ == "__main__":
    train_all()
    print("\n🎯 All models trained successfully!")
