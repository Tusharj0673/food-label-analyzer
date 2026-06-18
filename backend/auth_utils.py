from jose import jwt
from datetime import datetime, timedelta
from fastapi import Header, HTTPException
from dotenv import load_dotenv
import bcrypt, os

load_dotenv()

SECRET_KEY = os.getenv(
    "JWT_SECRET",
    "fallback-secret"
)
ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    return bcrypt.hashpw(
        password.encode(),
        bcrypt.gensalt()
    ).decode()

def verify_password(
    plain: str,
    hashed: str
) -> bool:
    return bcrypt.checkpw(
        plain.encode(),
        hashed.encode()
    )

def create_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = (
        datetime.utcnow() + timedelta(days=7)
    )
    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

def decode_token(token: str):
    try:
        return jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
    except:
        return None

async def get_current_user(
    authorization: str = Header(...)
) -> str:
    token = authorization.replace("Bearer ", "")
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )
    return payload["userId"]