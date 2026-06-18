from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from routes import auth, scan, profile
from database import connect_db
import os
import json

# ── Firebase Init ─────────────────────────────
# Reads from env variable on Render (deployed)
# Falls back to file for local development
import firebase_admin
from firebase_admin import credentials

def init_firebase():
    if firebase_admin._apps:
        # Already initialized — skip
        return

    # Try env variable first (Render deployment)
    firebase_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON")
    if firebase_json:
        try:
            cred_dict = json.loads(firebase_json)
            cred      = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
            print("✅ Firebase initialized from environment variable")
            return
        except Exception as e:
            print(f"❌ Firebase env init failed: {e}")

    # Fall back to file (local development)
    service_account_path = os.path.join(
        os.path.dirname(__file__),
        "firebase-service-account.json"
    )
    print(f"🔍 Looking for service account at: {service_account_path}")

    if os.path.exists(service_account_path):
        try:
            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred)
            print("✅ Firebase initialized from file")
        except Exception as e:
            print(f"❌ Firebase file init failed: {e}")
    else:
        print("⚠️  Firebase service account not found — Google OAuth will not work")

init_firebase()

# ── App ───────────────────────────────────────
app = FastAPI(
    title="Food Label Analyzer API",
    description="FSSAI Compliance Verification System",
    version="1.0.0"
)

# ── Startup ───────────────────────────────────
@app.on_event("startup")
async def startup_event():
    await connect_db()

# ── CORS ──────────────────────────────────────
# Dynamic CORS — works on any origin
# Handles localhost, network IP, and deployed domain
class DynamicCORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        origin = request.headers.get("origin", "")

        # Handle preflight OPTIONS request
        if request.method == "OPTIONS":
            response = Response()
            response.headers["Access-Control-Allow-Origin"]      = origin or "*"
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Methods"]     = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
            response.headers["Access-Control-Allow-Headers"]     = "Content-Type, Authorization, Accept, Origin, X-Requested-With"
            response.headers["Access-Control-Max-Age"]           = "86400"
            return response

        # Handle normal request
        response = await call_next(request)
        response.headers["Access-Control-Allow-Origin"]      = origin or "*"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"]     = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
        response.headers["Access-Control-Allow-Headers"]     = "Content-Type, Authorization, Accept, Origin, X-Requested-With"
        return response

app.add_middleware(DynamicCORSMiddleware)

# ── Static Files ──────────────────────────────
os.makedirs("uploads", exist_ok=True)
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

# ── Routes ────────────────────────────────────
app.include_router(
    auth.router,
    prefix="/api/auth",
    tags=["Auth"]
)
app.include_router(
    scan.router,
    prefix="/api/scan",
    tags=["Scan"]
)
app.include_router(
    profile.router,
    prefix="/api/profile",
    tags=["Profile"]
)

# ── Health Check ──────────────────────────────
@app.get("/")
def root():
    return {
        "message": "Food Label Analyzer API running",
        "status":  "healthy"
    }