from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# simple in-memory portfolio for demo
portfolio = []

class TradeRequest(BaseModel):
    symbol: str
    action: str
    quantity: int

@router.post("/trade")
async def trade_stock(req: TradeRequest):
    if req.action not in ["buy", "sell"]:
        raise HTTPException(status_code=400, detail="Invalid trade action")

    portfolio.append(req.dict())
    return {"message": f"{req.action.capitalize()} order placed for {req.quantity} shares of {req.symbol}"}

@router.get("/portfolio")
async def get_portfolio():
    return {"portfolio": portfolio}
