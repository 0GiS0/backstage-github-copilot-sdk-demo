import pytest
from fastapi.testclient import TestClient
from app.main import app

# Test configuration
SERVICE_NAME = "${{values.name}}"

client = TestClient(app)


class TestAPI:
    def test_health_endpoint(self):
        """Test health check endpoint."""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "OK"
        assert data["service"] == SERVICE_NAME
        assert "timestamp" in data
        assert "version" in data

    def test_hello_endpoint(self):
        """Test hello endpoint."""
        response = client.get("/api/hello")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == f"Hello from {SERVICE_NAME}!"
        assert "timestamp" in data

    def test_status_endpoint(self):
        """Test status endpoint."""
        response = client.get("/api/status")
        assert response.status_code == 200
        data = response.json()
        assert data["service"] == SERVICE_NAME
        assert data["status"] == "running"
        assert "uptime" in data
        assert "environment" in data

    def test_root_endpoint(self):
        """Test root endpoint."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["service"] == SERVICE_NAME
        assert data["message"] == "Welcome to the Memes API"
        assert "endpoints" in data
        assert "meme_endpoints" in data
        assert data["endpoints"]["memes"] == "/api/memes"

    def test_docs_endpoint(self):
        """Test OpenAPI docs endpoint."""
        response = client.get("/docs")
        assert response.status_code == 200

    def test_openapi_json(self):
        """Test OpenAPI schema endpoint."""
        response = client.get("/openapi.json")
        assert response.status_code == 200
        data = response.json()
        assert data["info"]["title"] == SERVICE_NAME


class TestMemesAPI:
    def test_get_all_memes(self):
        """Test getting all memes."""
        response = client.get("/api/memes/")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 2  # Should have at least 2 default memes

        # Check structure of first meme
        first_meme = data[0]
        assert "id" in first_meme
        assert "name" in first_meme
        assert "description" in first_meme
        assert "category" in first_meme
        assert "rating" in first_meme
        assert "views" in first_meme
        assert "max_shares" in first_meme
        assert "created_at" in first_meme
        assert "updated_at" in first_meme

    def test_get_meme_by_id(self):
        """Test getting a specific meme by ID."""
        response = client.get("/api/memes/1")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == 1
        assert "name" in data
        assert "category" in data

    def test_get_meme_by_invalid_id(self):
        """Test getting a meme with invalid ID."""
        response = client.get("/api/memes/999")
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data

    def test_create_meme(self):
        """Test creating a new meme."""
        new_meme = {
            "name": "Laughing Tom Cruise",
            "description": "Tom Cruise laughing uncontrollably",
            "category": "Celebrity",
            "rating": 8.0,
            "views": 500000,
            "max_shares": 250000,
        }

        response = client.post("/api/memes/", json=new_meme)
        assert response.status_code == 201
        data = response.json()
        assert "id" in data
        assert data["name"] == "Laughing Tom Cruise"
        assert data["category"] == "Celebrity"
        assert data["rating"] == 8.0
        assert "created_at" in data
        assert "updated_at" in data

    def test_create_meme_validation_error(self):
        """Test creating a meme with invalid data."""
        invalid_meme = {
            "name": "",  # Empty name should fail validation
            "description": "Test description",
            "category": "",  # Empty category should fail validation
            "rating": 15.0,  # Rating > 10 should fail validation
            "views": -100,  # Negative views should fail validation
            "max_shares": -50,  # Negative max_shares should fail validation
        }

        response = client.post("/api/memes/", json=invalid_meme)
        assert response.status_code == 422  # Validation error
        data = response.json()
        assert "detail" in data

    def test_update_meme(self):
        """Test updating an existing meme."""
        updated_data = {
            "name": "Updated Distracted Boyfriend",
            "description": "Updated description with epic vibes",
            "category": "Iconic",
            "rating": 9.8,
            "views": 2000000,
            "max_shares": 1500000,
        }

        response = client.put("/api/memes/1", json=updated_data)
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == 1
        assert data["name"] == "Updated Distracted Boyfriend"
        assert data["rating"] == 9.8
        assert "updated_at" in data

    def test_update_nonexistent_meme(self):
        """Test updating a non-existent meme."""
        updated_data = {
            "name": "Updated Name",
            "description": "Updated description",
            "category": "Updated",
            "rating": 5.0,
            "views": 100000,
            "max_shares": 50000,
        }

        response = client.put("/api/memes/999", json=updated_data)
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data

    def test_delete_meme(self):
        """Test deleting a meme."""
        # First create a meme to delete
        new_meme = {
            "name": "Test Meme for Deletion",
            "description": "This will be deleted",
            "category": "Test",
            "rating": 5.0,
            "views": 1000,
            "max_shares": 500,
        }

        create_response = client.post("/api/memes/", json=new_meme)
        assert create_response.status_code == 201
        meme_id = create_response.json()["id"]

        # Now delete it
        delete_response = client.delete(f"/api/memes/{meme_id}")
        assert delete_response.status_code == 204

        # Verify it's gone
        get_response = client.get(f"/api/memes/{meme_id}")
        assert get_response.status_code == 404

    def test_delete_nonexistent_meme(self):
        """Test deleting a non-existent meme."""
        response = client.delete("/api/memes/999")
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data
