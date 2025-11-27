from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import market, ai, portfolio, auth

app = FastAPI(title="StockVision AI")

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(market.router, prefix="/api/market")
app.include_router(ai.router, prefix="/api/ai")
app.include_router(portfolio.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Backend running successfully"}
