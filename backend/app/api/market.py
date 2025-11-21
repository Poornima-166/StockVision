# APIRouter → lets you create separate route groups for better organization (for example, /stocks, /live, /highlights).
# HTTPException → used to return errors in proper HTTP format (like 404 Not Found).
# yfinance → library to get real-time and historical stock data from Yahoo Finance.

from fastapi import APIRouter, HTTPException
import yfinance as yf
import asyncio
import traceback  # ✅ NEW: so we can print full error in backend logs

router = APIRouter()

@router.get("/stocks")
async def get_stocks():
    """Return some popular stocks"""
    stocks = [
        {"symbol": "AAPL", "name": "Apple Inc."},
        {"symbol": "MSFT", "name": "Microsoft Corp."},
        {"symbol": "GOOGL", "name": "Google Inc."},
        {"symbol": "AMZN", "name": "Amazon.com Inc."},
        {"symbol": "TSLA", "name": "Tesla Inc."},

        {"symbol": "META", "name": "Meta Platforms"},
        {"symbol": "NFLX", "name": "Netflix"},
        {"symbol": "NVDA", "name": "Nvidia Corp."},
        {"symbol": "AMD", "name": "Advanced Micro Devices"},
        {"symbol": "INTC", "name": "Intel Corp."},
        {"symbol": "IBM", "name": "IBM"},
        {"symbol": "ORCL", "name": "Oracle"},
        {"symbol": "CRM", "name": "Salesforce"},
        {"symbol": "ADBE", "name": "Adobe"},
        {"symbol": "QCOM", "name": "Qualcomm"},

        # 🟢 Finance / Banking
        {"symbol": "JPM", "name": "JPMorgan Chase"},
        {"symbol": "BAC", "name": "Bank of America"},
        {"symbol": "WFC", "name": "Wells Fargo"},
        {"symbol": "C", "name": "Citigroup"},
        {"symbol": "GS", "name": "Goldman Sachs"},
        {"symbol": "MS", "name": "Morgan Stanley"},
        {"symbol": "V", "name": "Visa Inc."},
        {"symbol": "MA", "name": "Mastercard"},
        {"symbol": "AXP", "name": "American Express"},
        {"symbol": "PYPL", "name": "PayPal"},

        # 🔥 Energy & Auto
        {"symbol": "XOM", "name": "ExxonMobil"},
        {"symbol": "CVX", "name": "Chevron"},
        {"symbol": "BP", "name": "British Petroleum"},
        {"symbol": "F", "name": "Ford"},
        {"symbol": "GM", "name": "General Motors"},
        {"symbol": "RIVN", "name": "Rivian"},
        {"symbol": "NEE", "name": "NextEra Energy"},
        {"symbol": "SHEL", "name": "Shell"},
        {"symbol": "COP", "name": "ConocoPhillips"},
        {"symbol": "PSX", "name": "Phillips 66"},

        #  Healthcare / Pharma
        {"symbol": "PFE", "name": "Pfizer"},
        {"symbol": "MRNA", "name": "Moderna"},
        {"symbol": "JNJ", "name": "Johnson & Johnson"},
        {"symbol": "UNH", "name": "UnitedHealth"},
        {"symbol": "ABBV", "name": "AbbVie"},
        {"symbol": "LLY", "name": "Eli Lilly"},
        {"symbol": "GILD", "name": "Gilead Sciences"},
        {"symbol": "BMY", "name": "Bristol-Myers Squibb"},

        # Consumer / Retail
        {"symbol": "WMT", "name": "Walmart"},
        {"symbol": "TGT", "name": "Target"},
        {"symbol": "COST", "name": "Costco"},
        {"symbol": "KO", "name": "Coca-Cola"},
        {"symbol": "PEP", "name": "PepsiCo"},
        {"symbol": "PG", "name": "Procter & Gamble"},
        {"symbol": "HD", "name": "Home Depot"},
        {"symbol": "NKE", "name": "Nike"},
        {"symbol": "MCD", "name": "McDonald's"},
        {"symbol": "SBUX", "name": "Starbucks"}
    ]
    return {"stocks": stocks}


# @router.get("/live/{ticker}")
# async def live_ticker(ticker: str, interval: str = "1h", range: str = "5d"):
#     """
#     Fetch recent stock prices for a ticker.
#     interval: 1m, 5m, 15m, 1h, 1d, etc.
#     range: 1d, 5d, 1mo, 3mo, 6mo, 1y, etc.
#     """
#     try:
#         # 🔹 Fix bad values coming from frontend
#         if not interval or interval == "undefined":
#             interval = "1h"     # default
#         if not range or range == "undefined":
#             range = "5d"        # default

#         loop = asyncio.get_event_loop()

#         def fetch_history():
#             t = yf.Ticker(ticker)
#             return t.history(period=range, interval=interval)

#         info = await loop.run_in_executor(None, fetch_history)

#         if info is None or info.empty:
#             raise HTTPException(
#                 status_code=404,
#                 detail=f"No data found for {ticker} (interval={interval}, range={range})"
#             )

#         prices = [
#             {"time": int(ts.timestamp()), "close": float(row["Close"])}
#             for ts, row in info.iterrows()
#         ]

#         return {"symbol": ticker.upper(), "prices": prices}

#     except HTTPException:
#         raise

#     except Exception as e:
#         print("ERROR IN /live ENDPOINT:", e)
#         import traceback; traceback.print_exc()
#         raise HTTPException(
#             status_code=500,
#             detail=f"Error fetching data for {ticker}: {str(e)}"
#         )
@router.get("/live/{ticker}")
async def live_ticker(ticker: str, range: str = "5d"):
    """
    Fetch recent stock prices for a ticker.
    Client controls only `range`, backend picks safe `interval`.
    range: 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y
    """
    try:
        if not range or range == "undefined":
            range = "5d"

        # 🔹 Backend decides interval based on range
        def pick_interval(range: str) -> str:
            if range == "5d":
                return "1h"      # intraday candles
            if range == "1mo":
                return "1d"      # daily candles
            if range == "3mo":
                return "1d"
            if range in {"6mo", "1y"}:
                return "1d"
            if range in {"2y", "5y"}:
                return "1wk"     # weekly candles
            return "1d"          # fallback

        interval = pick_interval(range)

        print(f"[live] ticker={ticker}, range={range}, interval={interval}")

        loop = asyncio.get_event_loop()

        def fetch_history():
            t = yf.Ticker(ticker)
            return t.history(period=range, interval=interval)

        info = await loop.run_in_executor(None, fetch_history)

        if info is None or info.empty:
            raise HTTPException(
                status_code=404,
                detail=f"No data found for {ticker} (range={range})"
            )

        prices = [
            {"time": int(ts.timestamp()), "close": float(row["Close"])}
            for ts, row in info.iterrows()
        ]

        return {"symbol": ticker.upper(), "prices": prices}

    except HTTPException:
        raise

    except Exception as e:
        print("ERROR IN /live ENDPOINT:", e)
        import traceback; traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching data for {ticker}: {str(e)}"
        )


# @router.get("/live/{ticker}")
# async def live_ticker(ticker: str, interval: str = "1h", range: str = "5d"):
#     """
#     Fetch recent stock prices for a ticker.
#     interval: 1m, 5m, 15m, 1h, 1d
#     range: 1d, 5d, 1mo, 3mo, 6mo, 1y, etc.
#     """
#     try:
#         loop = asyncio.get_event_loop()

#         # ✅ Wrap into a function for run_in_executor
#         def fetch_history():
#             t = yf.Ticker(ticker)
#             return t.history(period=range, interval=interval)

#         # ✅ Run blocking yfinance call in a thread executor
#         info = await loop.run_in_executor(None, fetch_history)

#         if info is None or info.empty:
#             # ✅ More clear 404 message
#             raise HTTPException(
#                 status_code=404,
#                 detail=f"No data found for {ticker} (interval={interval}, range={range})"
#             )

#         prices = [
#             {"time": int(ts.timestamp()), "close": float(row["Close"])}
#             for ts, row in info.iterrows()
#         ]

#         return {"symbol": ticker.upper(), "prices": prices}

#     except HTTPException:
#         # ✅ If we already raised HTTPException (404 etc), just pass it through
#         raise

#     except Exception as e:
#         # ✅ Print full traceback in backend logs so you can see the REAL cause
#         print("ERROR IN /live ENDPOINT:", e)
#         traceback.print_exc()
#         raise HTTPException(
#             status_code=500,
#             detail=f"Error fetching data for {ticker}: {str(e)}"
#         )


@router.get("/highlights")
async def get_market_highlights():
    """Fetch real-time top gainers and losers"""
    try:
        tickers = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NFLX", "META", "NVDA"]
        loop = asyncio.get_event_loop()

        def fetch_data(symbol: str):
            t = yf.Ticker(symbol)
            hist = t.history(period="2d")
            if hist.empty or len(hist) < 2:
                return None
            prev_close = hist["Close"].iloc[-2]
            last_close = hist["Close"].iloc[-1]
            change_percent = ((last_close - prev_close) / prev_close) * 100
            return {
                "symbol": symbol,
                "price": round(float(last_close), 2),
                "change": round(float(change_percent), 2),
            }

        # ✅ Run blocking work in executor for all tickers
        tasks = [loop.run_in_executor(None, fetch_data, s) for s in tickers]
        results = await asyncio.gather(*tasks)
        results = [r for r in results if r is not None]

        # Sort gainers and losers
        # gainers = sorted(
        #     [r for r in results if r["change"] > 0],
        #     key=lambda x: x["change"],
        #     reverse=True
        # )[:3]

        # losers = sorted(
        #     [r for r in results if r["change"] < 0],
        #     key=lambda x: x["change"]
        # )[:3]

        # return {"gainers": gainers, "losers": losers}
        # 🔹 First try: real positive gainers
        positive = [r for r in results if r["change"] > 0]
        negative = [r for r in results if r["change"] < 0]

        # Top gainers: highest % change
        if positive:
            gainers = sorted(positive, key=lambda x: x["change"], reverse=True)[:6]
        else:
            # 🟡 If no stock actually went up, show "least bad" ones
            gainers = sorted(results, key=lambda x: x["change"], reverse=True)[:3]

        # Top losers: lowest % change
        if negative:
            losers = sorted(negative, key=lambda x: x["change"])[:3]
        else:
            # If no one lost (rare), just show the smallest moves
            losers = sorted(results, key=lambda x: x["change"])[:3]

        return {"gainers": gainers, "losers": losers}

    except Exception as e:
        print("ERROR IN /highlights ENDPOINT:", e)
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching highlights: {str(e)}"
        )
