# from motor.motor_asyncio import AsyncIOMotorClient
# from dotenv import load_dotenv
# import os

# load_dotenv()

# MONGODB_URI = os.getenv(
#     "MONGODB_URI"
# )

# client = AsyncIOMotorClient(MONGODB_URI)
# db = client["foodlabel"]
# #mongodb+srv://Tushar:<db_password>@label-iq.yy0dsas.mongodb.net/?appName=Label-IQ
# # Test connection on startup
# async def connect_db():
#     try:
#         await client.admin.command("ping")
#         print("✅ MongoDB connected successfully")
#     except Exception as e:
#         print(f"❌ MongoDB connection failed: {e}")

import motor.motor_asyncio
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv(
    "MONGODB_URI",
    "mongodb://localhost:27017"
)

print(f"🔗 Connecting to MongoDB: {MONGODB_URI[:40]}...")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
db     = client.foodlabeldb

async def connect_db():
    try:
        await client.admin.command("ping")
        print("✅ MongoDB connected successfully")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")