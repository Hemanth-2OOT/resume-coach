import os
from dotenv import load_dotenv

load_dotenv()

# JWT Configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Password Hashing
BCRYPT_ROUNDS = 12

# Database
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///resume_coach.db")

# CORS
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
