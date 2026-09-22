import uuid
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "philosophy" in data
    assert data["philosophy"] == "AI plans. Locals advise. Concierge executes."


def test_register_and_login():
    unique_id = uuid.uuid4().hex[:8]
    test_email = f"traveler_{unique_id}@example.com"
    test_password = "SecurePassword123!"

    # 1. Register
    register_payload = {
        "name": "Test Traveler",
        "email": test_email,
        "password": test_password,
        "role": "traveler",
        "bio": "Exploring historic gardens"
    }
    reg_response = client.post("/api/auth/register", json=register_payload)
    assert reg_response.status_code == 201
    reg_data = reg_response.json()
    assert "access_token" in reg_data
    assert reg_data["user"]["email"] == test_email
    assert reg_data["user"]["role"] == "traveler"

    token = reg_data["access_token"]

    # 2. Get Me with Token
    me_response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_response.status_code == 200
    assert me_response.json()["email"] == test_email

    # 3. Login with Credentials
    login_payload = {
        "email": test_email,
        "password": test_password
    }
    login_response = client.post("/api/auth/login", json=login_payload)
    assert login_response.status_code == 200
    login_data = login_response.json()
    assert "access_token" in login_data
    assert login_data["user"]["name"] == "Test Traveler"


def test_duplicate_registration():
    payload = {
        "name": "Duplicate User",
        "email": "admin@planrupee.com",  # Already seeded
        "password": "Password123!",
        "role": "traveler"
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]


def test_login_invalid_password():
    payload = {
        "email": "admin@planrupee.com",
        "password": "WrongPassword123!"
    }
    response = client.post("/api/auth/login", json=payload)
    assert response.status_code == 401


def test_unauthorized_me():
    response = client.get("/api/auth/me")
    assert response.status_code == 401
