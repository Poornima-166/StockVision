# app/api/ai.py

#This API takes a stock symbol → fetches recent stock data → applies your trained ML model → and gives a BUY / SELL / HOLD recommendation with confidence.


#APIRouter helps organize routes (like separate mini APIs).
#HTTPException is used to return proper error messages with HTTP status codes
#import yfinance as yf -Imports the Yahoo Finance API library to fetch real-time or historical stock data.
#import joblib-Used to load and save ML models (trained models are stored as .pkl files).
#import os-Helps in file path checking (to see if model files exist).
#import numpy as np-Used for numeric operations (though not much used here directly).
from fastapi import APIRouter, HTTPException
import yfinance as yf
import joblib
import os
import numpy as np


#This creates a router object so you can define routes like /recommend/{symbol} inside it.
# Later, this router will be included in the main FastAPI app.
router = APIRouter()

def load_model(symbol):
    # Construct file paths for model and scaler
    model_path = f"app/models/{symbol}_model.pkl"
    scaler_path = f"app/models/{symbol}_scaler.pkl"
    # Check if model files exist
    if not os.path.exists(model_path) or not os.path.exists(scaler_path):
        raise HTTPException(status_code=404, detail=f"No model found for {symbol}. Please train it first.")
# Load the model and scaler
    model = joblib.load(model_path)
    scaler = joblib.load(scaler_path)
    return model, scaler #Return the loaded model and scaler so that it can be used for predictions later.

# Define a GET endpoint /recommend/{symbol} to get stock recommendations
@router.get("/recommend/{symbol}")
# The function takes a stock symbol as input and returns a recommendation.
def recommend(symbol: str):
    try:
        # Load the model and scaler for the given stock symbol
        model, scaler = load_model(symbol)
        data = yf.download(symbol, period="1mo", interval="1d")
        #Calculates daily percentage return = (today_close - yesterday_close) / yesterday_close.
        data["Return"] = data["Close"].pct_change()
        #Calculates 5-day and 20-day Simple Moving Averages (SMA).
        data["SMA5"] = data["Close"].rolling(window=5).mean()
        data["SMA20"] = data["Close"].rolling(window=20).mean()
        # Drop rows with NaN values that may have resulted from calculations
        data.dropna(inplace=True)
        #gives error if no data is available
        if data.empty:
            raise HTTPException(status_code=404, detail="No data available for this stock")
        # Prepare the latest data point for prediction
        #.reshape(1, -1) → reshapes it into a 2D array (since models expect that format).
        latest = data[["Close", "Volume", "SMA5", "SMA20", "Return"]].iloc[-1].values.reshape(1, -1)
        # Scale the latest data point-Uses the saved scaler to normalize this data (so it matches the format used during training).
        latest_scaled = scaler.transform(latest)
        # Make prediction
        prediction = model.predict(latest_scaled)[0]
        # Get prediction probability
        prob = model.predict_proba(latest_scaled)[0][1]

        if prediction == 1:
            action = "BUY" if prob > 0.55 else "HOLD"
        else:
            action = "SELL" if prob < 0.45 else "HOLD"

        return {
            "symbol": symbol,
            "action": action,
            "confidence": round(float(prob) * 100, 2),  # as percentage
            "short": round(float(data["SMA5"].iloc[-1]), 2),
            "long": round(float(data["SMA20"].iloc[-1]), 2),
            "reason": f"Predicted next-day rise probability: {round(float(prob)*100, 2)}%",
            "risk": "Medium"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
