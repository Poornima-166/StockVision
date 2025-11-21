# backend/app/api/portfolio.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional

router = APIRouter(tags=["Portfolio"])

# In-memory storage (replace with DB later)
_trades: List[dict] = []
_portfolio_cache = None  # optional cache (not used heavily here)


class TradeRequest(BaseModel):
    symbol: str = Field(..., example="AAPL")
    action: str = Field(..., example="buy")  # "buy", "sell", or "recommendation"
    quantity: Optional[int] = Field(None, example=1)  # not required for recommendation
    price: Optional[float] = Field(None, example=270.5)
    note: Optional[str] = None


@router.post("/trade")
def trade_stock(data: TradeRequest):
    """Create a buy/sell trade entry."""
    act = data.action.lower()
    if act not in ("buy", "sell", "recommendation"):
        raise HTTPException(status_code=400, detail="Invalid action (use buy|sell|recommendation)")

    if act in ("buy", "sell") and (not data.quantity or data.quantity <= 0):
        raise HTTPException(status_code=400, detail="Quantity required and must be > 0 for buy/sell")

    entry = {
        "id": len(_trades) + 1,
        "symbol": data.symbol.upper(),
        "action": act,
        "quantity": data.quantity if data.quantity is not None else 0,
        "price": data.price if data.price is not None else None,
        "note": data.note,
        "time": datetime.utcnow().isoformat() + "Z",
    }
    _trades.append(entry)
    return {"message": f"{act.title()} recorded", "trade": entry}


@router.get("/portfolio")
def get_portfolio():
    """
    Returns aggregated holdings and the trade history.
    holdings: [{symbol, quantity}]
    trades: list of trades
    """
    holdings = {}
    for t in _trades:
        if t["action"] == "recommendation":
            continue  # recommendations shouldn't affect holdings
        qty = t["quantity"] if t["action"] == "buy" else -t["quantity"]
        holdings[t["symbol"]] = holdings.get(t["symbol"], 0) + qty

    holdings_list = [{"symbol": s, "quantity": q} for s, q in holdings.items()]
    return {"portfolio": holdings_list, "trades": list(reversed(_trades))}  # reversed = newest first


@router.post("/save")
def save_recommendation(payload: dict):
    """
    Lightweight endpoint used by AI to auto-save a recommendation.
    Expects a JSON object with at least 'symbol' and 'reason' keys. We'll store as action='recommendation'.
    """
    symbol = payload.get("symbol")
    if not symbol:
        raise HTTPException(status_code=400, detail="Missing 'symbol' in payload")

    entry = {
        "id": len(_trades) + 1,
        "symbol": symbol.upper(),
        "action": "recommendation",
        "quantity": 0,
        "price": payload.get("price"),
        "note": payload.get("reason") or payload.get("note"),
        "time": datetime.utcnow().isoformat() + "Z",
    }
    _trades.append(entry)
    return {"message": "Recommendation saved", "trade": entry}
