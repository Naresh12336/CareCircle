"""Health-check endpoint tests."""

from fastapi.testclient import TestClient


def test_api_v1_health_check(client: TestClient):
    """Test the primary API v1 health-check endpoint."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["project"] == "CareCircle"
    assert data["version"] == "0.1.0"
    assert "environment" in data
    assert "database" in data
    assert "timestamp" in data


def test_root_health_check(client: TestClient):
    """Test the root health check endpoint for orchestrators."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["project"] == "CareCircle"
