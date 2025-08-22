import pytest
from tortoise.contrib.test import initializer, finalizer
from app.models.user import User
from app.core.security import get_password_hash, verify_password

@pytest.fixture(scope="module")
async def initialize_tests():
    await initializer(["app.models.user"])
    yield
    await finalizer()

@pytest.fixture
async def create_user():
    user = await User.create(
        username="testuser",
        email="test@example.com",
        password_hash=get_password_hash("password123"),
        full_name="Test User"
    )
    yield user
    await user.delete()

@pytest.mark.asyncio
async def test_create_user(initialize_tests):
    user = await User.create_user(
        username="newuser",
        email="new@example.com",
        password="securepassword",
        full_name="New User"
    )

    assert user.id is not None
    assert user.username == "newuser"
    assert user.email == "new@example.com"
    assert user.full_name == "New User"
    assert user.verify_password("securepassword")
    assert not user.verify_password("wrongpassword")

    # Limpiar
    await user.delete()

@pytest.mark.asyncio
async def test_user_password_verification(initialize_tests, create_user):
    user = await create_user

    # Verificar contraseña correcta
    assert user.verify_password("password123")

    # Verificar contraseña incorrecta
    assert not user.verify_password("wrongpassword")

@pytest.mark.asyncio
async def test_get_user_by_username(initialize_tests, create_user):
    user = await create_user

    # Buscar usuario por nombre de usuario
    found_user = await User.get_or_none(username="testuser")
    assert found_user is not None
    assert found_user.id == user.id

    # Buscar usuario inexistente
    not_found_user = await User.get_or_none(username="nonexistent")
    assert not_found_user is None

@pytest.mark.asyncio
async def test_get_user_by_email(initialize_tests, create_user):
    user = await create_user

    # Buscar usuario por email
    found_user = await User.get_or_none(email="test@example.com")
    assert found_user is not None
    assert found_user.id == user.id

    # Buscar usuario inexistente
    not_found_user = await User.get_or_none(email="nonexistent@example.com")
    assert not_found_user is None
