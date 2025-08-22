from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    full_name: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    preferred_language: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    is_admin: bool
    preferred_language: str
