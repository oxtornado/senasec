import pytest
from httpx import AsyncClient
from tortoise.contrib.test import initializer, finalizer
from app.models.user import User
from app.models.inventory import InventoryItem, ItemStatus
from app.models.loan import Loan, LoanStatus
from app.core.security import get_password_hash
from datetime import datetime, timedelta
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
async def admin_token(client):
    # Crear usuario administrador
    admin = await User.create(
        username="admin_integration",
        email="admin_integration@example.com",
        password_hash=get_password_hash("adminpassword"),
        full_name="Admin Integration",
        is_admin=True
    )

    # Obtener token
    response = await client.post(
        "/token",
        data={
            "username": "admin_integration",
            "password": "adminpassword"
        }
    )
    token = response.json()["access_token"]

    yield token

    # Limpiar
    await admin.delete()

@pytest.fixture
async def user_token(client):
    # Crear usuario normal
    user = await User.create(
        username="user_integration",
        email="user_integration@example.com",
        password_hash=get_password_hash("userpassword"),
        full_name="User Integration",
        is_admin=False
    )

    # Obtener token
    response = await client.post(
        "/token",
        data={
            "username": "user_integration",
            "password": "userpassword"
        }
    )
    token = response.json()["access_token"]

    yield token

    # Limpiar
    await user.delete()

@pytest.mark.asyncio
async def test_inventory_loan_flow(initialize_tests, client, admin_token, user_token):
    # 1. Administrador crea un elemento de inventario
    inventory_response = await client.post(
        "/api/inventory/",
        params={
            "name": "Proyector Test",
            "description": "Proyector para pruebas de integración",
            "location": "Aula 101"
        },
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert inventory_response.status_code == 200
    inventory_data = inventory_response.json()
    item_id = inventory_data["id"]

    # 2. Verificar que el elemento fue creado correctamente
    get_item_response = await client.get(
        f"/api/inventory/{item_id}",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert get_item_response.status_code == 200
    assert get_item_response.json()["name"] == "Proyector Test"

    # 3. Usuario solicita un préstamo
    start_time = datetime.now() + timedelta(hours=1)
    end_time = start_time + timedelta(hours=2)

    loan_response = await client.post(
        "/api/loans/",
        params={
            "item_id": item_id,
            "start_time": start_time.isoformat(),
            "end_time": end_time.isoformat(),
            "notes": "Préstamo de prueba"
        },
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert loan_response.status_code == 200
    loan_data = loan_response.json()
    loan_id = loan_data["id"]

    # 4. Administrador aprueba el préstamo
    approve_response = await client.put(
        f"/api/loans/{loan_id}/approve",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert approve_response.status_code == 200
    assert approve_response.json()["status"] == "active"

    # 5. Verificar que el estado del elemento ha cambiado a "en uso"
    item_status_response = await client.get(
        f"/api/inventory/{item_id}",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert item_status_response.status_code == 200
    assert item_status_response.json()["status"] == "in_use"

    # 6. Usuario devuelve el préstamo
    return_response = await client.put(
        f"/api/loans/{loan_id}/return",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert return_response.status_code == 200
    assert return_response.json()["status"] == "returned"

    # 7. Verificar que el estado del elemento ha vuelto a "disponible"
    final_status_response = await client.get(
        f"/api/inventory/{item_id}",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert final_status_response.status_code == 200
    assert final_status_response.json()["status"] == "available"

    # Limpiar
    await InventoryItem.filter(id=item_id).delete()
    await Loan.filter(id=loan_id).delete()

@pytest.mark.asyncio
async def test_i18n_endpoint(initialize_tests, client):
    # Verificar que el endpoint de i18n devuelve traducciones
    es_response = await client.get("/api/i18n/es")
    assert es_response.status_code == 200
    es_data = es_response.json()
    assert "welcome" in es_data

    en_response = await client.get("/api/i18n/en")
    assert en_response.status_code == 200
    en_data = en_response.json()
    assert "welcome" in en_data

    # Verificar que las traducciones son diferentes
    assert es_data["welcome"] != en_data["welcome"]
