import pytest
from httpx import AsyncClient
from fastapi.testclient import TestClient
from tortoise.contrib.test import initializer, finalizer
from app.models.user import User
from app.core.security import get_password_hash
from main import app

@pytest.fixture(scope="module")
async def initialize_tests():
    await initializer(["app.models.user", "app.models.inventory", "app.models.loan"])
    yield
    await finalizer()

@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

@pytest.fixture
async def admin_user():
    user = await User.create(
        username="admin",
        email="admin@example.com",
        password_hash=get_password_hash("adminpassword"),
        full_name="Admin User",
        is_admin=True
    )
    yield user
    await user.delete()

@pytest.fixture
async def normal_user():
    user = await User.create(
        username="user",
        email="user@example.com",
        password_hash=get_password_hash("userpassword"),
        full_name="Normal User",
        is_admin=False
    )
    yield user
    await user.delete()

@pytest.mark.asyncio
async def test_root_endpoint(initialize_tests, client):
    response = await client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()

@pytest.mark.asyncio
async def test_login(initialize_tests, client, normal_user):
    response = await client.post(
        "/token",
        data={
            "username": "user",
            "password": "userpassword"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_login_invalid_credentials(initialize_tests, client):
    response = await client.post(
        "/token",
        data={
            "username": "nonexistent",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_create_user(initialize_tests, client):
    response = await client.post(
        "/api/users/",
        json={
            "username": "newuser",
            "email": "new@example.com",
            "password": "newpassword",
            "full_name": "New User"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "newuser"
    assert data["email"] == "new@example.com"
    assert data["full_name"] == "New User"
    assert "password_hash" not in data

    # Limpiar
    user = await User.get(username="newuser")
    await user.delete()

@pytest.mark.asyncio
async def test_get_current_user(initialize_tests, client, normal_user):
    # Primero obtener token
    login_response = await client.post(
        "/token",
        data={
            "username": "user",
            "password": "userpassword"
        }
    )
    token = login_response.json()["access_token"]

    # Usar token para obtener usuario actual
    response = await client.get(
        "/api/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "user"
    assert data["email"] == "user@example.com"

@pytest.mark.asyncio
async def test_get_current_user_no_token(initialize_tests, client):
    response = await client.get("/api/users/me")
    assert response.status_code == 401
