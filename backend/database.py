import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_DETAILS")

if not MONGO_DETAILS:
    raise ValueError("MONGO_DETAILS environment variable not found")

client = AsyncIOMotorClient(MONGO_DETAILS)

database = client.resume_helper

user_collection = database.get_collection("users")
resume_collection = database.get_collection("resumes")