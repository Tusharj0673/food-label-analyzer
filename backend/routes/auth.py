from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import db
from auth_utils import (
    hash_password,
    verify_password,
    create_token
)
import firebase_admin
from firebase_admin import credentials, auth
import os

router = APIRouter()

try:
    if not firebase_admin._apps:
        service_account_path = os.path.join(
            os.path.dirname(__file__),
            '../firebase-service-account.json'
        )
        print(f"🔍 Looking for service account at: {service_account_path}")
        print(f"🔍 File exists: {os.path.exists(service_account_path)}")
        
        cred = credentials.Certificate(service_account_path)
        firebase_admin.initialize_app(cred)
        print("✅ Firebase Admin initialized successfully")
except Exception as e:
    print(f"❌ Firebase init error: {e}")
# Initialize Firebase Admin — only once
if not firebase_admin._apps:
    cred = credentials.Certificate(
        os.path.join(
            os.path.dirname(__file__),
            '../firebase-service-account.json'
        )
    )
    firebase_admin.initialize_app(cred)

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
            "diabetic":     False,
            "hypertensive": False,
            "pku":          False,
            "pregnant":     False
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
    print(f"📨 Received token length: {len(data.id_token)}")
    print(f"📨 Token preview: {data.id_token[:50]}...")
    
    try:
        decoded = auth.verify_id_token(
            data.id_token,
            check_revoked=False,
            clock_skew_seconds=10
        )
        print(f"✅ Decoded: {decoded.get('email')}")
        
    except firebase_admin.auth.ExpiredIdTokenError:
        print("❌ Token expired")
        raise HTTPException(
            status_code=401,
            detail="Token expired"
        )
    except firebase_admin.auth.InvalidIdTokenError as e:
        print(f"❌ Invalid token: {e}")
        raise HTTPException(
            status_code=401,
            detail=f"Invalid token: {str(e)}"
        )
    except Exception as e:
        print(f"❌ Unknown error: {type(e).__name__}: {e}")
        raise HTTPException(
            status_code=401,
            detail=str(e)
        )

    email = decoded.get("email")
    name  = decoded.get(
        "name",
        email.split("@")[0]
    )

    user = await db.users.find_one({"email": email})

    if not user:
        new_user = {
            "name":         name,
            "email":        email,
            "password":     "",
            "authProvider": "google",
            "healthProfile": {
                "diabetic":     False,
                "hypertensive": False,
                "pku":          False,
                "pregnant":     False
            }
        }
        result = await db.users.insert_one(new_user)
        user_id = str(result.inserted_id)
        print(f"✅ New user created: {user_id}")
    else:
        user_id = str(user["_id"])
        print(f"✅ Existing user: {user_id}")

    token = create_token({"userId": user_id})

    return {
        "token": token,
        "name":  name,
        "email": email
    }