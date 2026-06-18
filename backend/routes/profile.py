from fastapi import APIRouter, Depends
from pydantic import BaseModel
from auth_utils import get_current_user
from database import db
from bson import ObjectId

router = APIRouter()

class ProfileUpdate(BaseModel):
  diabetic:           bool = False
  hypertensive:       bool = False
  pku:                bool = False
  pregnant:           bool = False
  lactose_intolerant: bool = False
  pcos:               bool = False
  celiac:             bool = False
  heart:              bool = False
  ibs:                bool = False
  uric_acid:          bool = False

@router.get("/")
async def get_profile(
  user_id: str = Depends(get_current_user)
):
  user = await db.users.find_one(
    {"_id": ObjectId(user_id)}
  )
  if not user:
    return {}
  user["_id"] = str(user["_id"])
  user.pop("password", None)
  return user

@router.put("/health")
async def update_health_profile(
  data: ProfileUpdate,
  user_id: str = Depends(get_current_user)
):
  await db.users.update_one(
    {"_id": ObjectId(user_id)},
    {"$set": {"healthProfile": data.dict()}}
  )
  return {"message": "Health profile updated"}