from fastapi import APIRouter, Depends, HTTPException
from app.models.user import User
from app.schemas.auth import UserCreate, UserResponse, UserUpdate
from app.api.auth import get_current_active_user
from app.core.security import get_password_hash

router = APIRouter()

@router.post("/users/", response_model=UserResponse)
async def create_user(user: UserCreate):
    existing_user = await User.get_or_none(username=user.username) or await User.get_or_none(email=user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    new_user = await User.create_user(
        username=user.username,
        email=user.email,
        password=user.password,
        full_name=user.full_name
    )
    return new_user

@router.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

@router.put("/users/me", response_model=UserResponse)
async def update_user(user_update: UserUpdate, current_user: User = Depends(get_current_active_user)):
    if user_update.full_name:
        current_user.full_name = user_update.full_name
    if user_update.email:
        existing_user = await User.get_or_none(email=user_update.email)
        if existing_user and existing_user.id != current_user.id:
            raise HTTPException(status_code=400, detail="Email already registered")
        current_user.email = user_update.email
    if user_update.password:
        current_user.password_hash = get_password_hash(user_update.password)
    if user_update.preferred_language:
        current_user.preferred_language = user_update.preferred_language

    await current_user.save()
    return current_user
