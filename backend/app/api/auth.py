from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
import jwt
import hashlib

router = APIRouter()

# Secret key for JWT encoding (change this in production!)
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"

# Simple in-memory user storage (in production, use a real database)
users_db = {}

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str

class LoginRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    token: str
    user: dict

def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_token(user_id: str, email: str, name: str) -> str:
    """Create JWT token"""
    payload = {
        "id": user_id,
        "email": email,
        "name": name,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

@router.post("/register", response_model=AuthResponse)
async def register(req: RegisterRequest):
    """Register a new user"""
    # Check if user already exists
    if req.email in users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Simple user ID generation (in production, use UUID)
    user_id = str(len(users_db) + 1)
    
    # Hash password and store user
    hashed_password = hash_password(req.password)
    users_db[req.email] = {
        "id": user_id,
        "email": req.email,
        "name": req.name,
        "password": hashed_password
    }
    
    # Create and return token
    token = create_token(user_id, req.email, req.name)
    
    return AuthResponse(
        token=token,
        user={"id": user_id, "email": req.email, "name": req.name}
    )

@router.post("/login", response_model=AuthResponse)
async def login(req: LoginRequest):
    """Login user"""
    # Check if user exists
    if req.email not in users_db:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    user = users_db[req.email]
    
    # Verify password
    hashed_password = hash_password(req.password)
    if user["password"] != hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create and return token
    token = create_token(user["id"], user["email"], user["name"])
    
    return AuthResponse(
        token=token,
        user={"id": user["id"], "email": user["email"], "name": user["name"]}
    )
