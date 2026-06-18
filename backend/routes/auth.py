from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import db
from auth_utils import (
    hash_password,
    verify_password,
    create_token
)
from firebase_admin import auth as firebase_auth
import firebase_admin

router = APIRouter()

# ── Request Models ──────────────────────────

class RegisterRequest(BaseModel):
    name:     str
    email:    str
    password: str

class LoginRequest(BaseModel):
    email:    str
    password: str

class GoogleAuthRequest(BaseModel):
    id_token: str

# ── Routes ──────────────────────────────────

@router.post("/register")
async def register(data: RegisterRequest):
    existing = await db.users.find_one(
        {"email": data.email}
    )
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user = {
        "name":     data.name,
        "email":    data.email,
        "password": hash_password(data.password),
        "authProvider": "email",
        "healthProfile": {
            "diabetic":           False,
            "hypertensive":       False,
            "pku":                False,
            "pregnant":           False,
            "lactose_intolerant": False,
            "pcos":               False,
            "celiac":             False,
            "heart":              False,
            "ibs":                False,
            "uric_acid":          False
        }
    }
    await db.users.insert_one(user)
    return {"message": "Registration successful"}


@router.post("/login")
async def login(data: LoginRequest):
    user = await db.users.find_one(
        {"email": data.email}
    )
    if not user or not verify_password(
        data.password,
        user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_token(
        {"userId": str(user["_id"])}
    )
    return {
        "token": token,
        "name":  user["name"],
        "email": user["email"]
    }


@router.post("/google")
async def google_auth(data: GoogleAuthRequest):
    print(f"📨 Received Google token — length: {len(data.id_token)}")

    # Check Firebase is initialized before using it
    if not firebase_admin._apps:
        raise HTTPException(
            status_code=500,
            detail="Firebase not initialized — check server configuration"
        )

    try:
        decoded = firebase_auth.verify_id_token(
            data.id_token,
            check_revoked=False,
            clock_skew_seconds=10
        )
        print(f"✅ Token decoded for: {decoded.get('email')}")

    except firebase_admin.auth.ExpiredIdTokenError:
        print("❌ Token expired")
        raise HTTPException(
            status_code=401,
            detail="Token expired — please sign in again"
        )
    except firebase_admin.auth.InvalidIdTokenError as e:
        print(f"❌ Invalid token: {e}")
        raise HTTPException(
            status_code=401,
            detail=f"Invalid token: {str(e)}"
        )
    except Exception as e:
        print(f"❌ Google auth error: {type(e).__name__}: {e}")
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )

    email = decoded.get("email")
    name  = decoded.get(
        "name",
        email.split("@")[0] if email else "User"
    )

    user = await db.users.find_one({"email": email})

    if not user:
        new_user = {
            "name":         name,
            "email":        email,
            "password":     "",
            "authProvider": "google",
            "healthProfile": {
                "diabetic":           False,
                "hypertensive":       False,
                "pku":                False,
                "pregnant":           False,
                "lactose_intolerant": False,
                "pcos":               False,
                "celiac":             False,
                "heart":              False,
                "ibs":                False,
                "uric_acid":          False
            }
        }
        result  = await db.users.insert_one(new_user)
        user_id = str(result.inserted_id)
        print(f"✅ New Google user created: {user_id}")
    else:
        user_id = str(user["_id"])
        print(f"✅ Existing Google user: {user_id}")

    token = create_token({"userId": user_id})

    return {
        "token": token,
        "name":  name,
        "email": email
    }