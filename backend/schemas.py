from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List


class UserLogin(BaseModel):
    """Request model for user login."""
    email: EmailStr
    password: str = Field(..., min_length=1)


class UserCreate(BaseModel):
    """Request model for user registration."""
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserResponse(BaseModel):
    """Response model for user data."""
    id: int
    email: str
    is_admin: bool

    class Config:
        orm_mode = True


class ResumeResponse(BaseModel):
    """Response model for resume data."""
    id: int
    filename: str

    class Config:
        orm_mode = True


class AnalysisResponse(BaseModel):
    """Response model for resume analysis."""
    score: int
    skills_found: List[str]


class TokenResponse(BaseModel):
    """Response model for login."""
    success: bool
    token: str
    redirect_to: str
    role: str

