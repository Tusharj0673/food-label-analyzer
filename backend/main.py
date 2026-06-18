# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles
# from routes import auth, scan, profile
# from database import connect_db
# import os

# app = FastAPI(
#     title="Food Label Analyzer API",
#     description="FSSAI Compliance Verification System",
#     version="1.0.0"
# )

# @app.on_event("startup")
# async def startup_event():
#     await connect_db()


# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:5173",
#         "http://127.0.0.1:5173",
#         "http://192.168.1.2:5173",  # ← your IP
#     ],
#     allow_credentials=True,
#     allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
#     allow_headers=["*"],
#     expose_headers=["*"]
# )

# os.makedirs("uploads", exist_ok=True)
# app.mount(
#     "/uploads",
#     StaticFiles(directory="uploads"),
#     name="uploads"
# )

# app.include_router(
#     auth.router,
#     prefix="/api/auth",
#     tags=["Auth"]
# )
# app.include_router(
#     scan.router,
#     prefix="/api/scan",
#     tags=["Scan"]
# )
# app.include_router(
#     profile.router,
#     prefix="/api/profile",
#     tags=["Profile"]
# )

# @app.get("/")
# def root():
#     return {
#         "message": "Food Label Analyzer API running"
#     }


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes import auth, scan, profile
from database import connect_db
import os

app = FastAPI(
    title="Food Label Analyzer API",
    description="FSSAI Compliance Verification System",
    version="1.0.0"
)

@app.on_event("startup")
async def startup_event():
    await connect_db()

# Custom CORS handler that allows any origin
# during development — fixes multi-network issues
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

class DynamicCORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        origin = request.headers.get("origin", "")

        # Handle preflight OPTIONS request
        if request.method == "OPTIONS":
            from starlette.responses import Response
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

os.makedirs("uploads", exist_ok=True)
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

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

@app.get("/")
def root():
    return {
        "message": "Food Label Analyzer API running"
    }