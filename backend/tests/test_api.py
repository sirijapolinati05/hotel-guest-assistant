import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

@patch("app.api.endpoints.process_chat")
def test_chat_faq(mock_process_chat):
    mock_process_chat.return_value = {
        "intent": "faq",
        "reply": "Check-in time is 2:00 PM."
    }
    
    response = client.post("/api/chat", json={
        "message": "What time is check-in?",
        "conversation": []
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "faq"
    assert "2:00 PM" in data["reply"]

@patch("app.api.endpoints.process_chat")
def test_chat_availability_intent(mock_process_chat):
    mock_process_chat.return_value = {
        "intent": "availability_request",
        "reply": "Sure, I can help with that. Please provide your dates and the number of guests."
    }
    
    response = client.post("/api/chat", json={
        "message": "Are there rooms for 3 adults this weekend?",
        "conversation": []
    })
    
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "availability_request"

@patch("app.api.endpoints.check_availability")
def test_availability_success(mock_check_availability):
    mock_check_availability.return_value = [
        {
            "id": "1",
            "name": "Executive Room",
            "price_per_night": 7000,
            "beds": "King Bed + Sofa Bed",
            "max_guests": 3,
            "available_count": 2
        }
    ]
    
    response = client.post("/api/availability", json={
        "check_in": "2026-10-05",
        "check_out": "2026-10-08",
        "adults": 3
    })
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Executive Room"

def test_availability_invalid_dates():
    response = client.post("/api/availability", json={
        "check_in": "2026-10-10",
        "check_out": "2026-10-08",
        "adults": 3
    })
    
    assert response.status_code == 400
    assert "Check-out date must be after check-in date" in response.json()["detail"]
