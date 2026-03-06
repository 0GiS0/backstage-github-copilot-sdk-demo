# API Documentation

## Overview

This service exposes a REST API for managing items. The API follows REST conventions and returns JSON responses.

## Base URL

- **Local**: `http://localhost:8080`
- **Production**: `https://api.example.com`

## Authentication

Currently, the API does not require authentication. In production, implement OAuth2 or JWT authentication.

## Endpoints

### Items API

#### List All Items

```http
GET /api/items
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `activeOnly` | boolean | Filter only active items (default: false) |

**Response:**

```json
[
  {
    "id": 1,
    "name": "Sample Item",
    "description": "A sample item",
    "active": true,
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00"
  }
]
```

#### Get Item by ID

```http
GET /api/items/{id}
```

#### Create Item

```http
POST /api/items
Content-Type: application/json

{
  "name": "New Item",
  "description": "Item description"
}
```

#### Update Item

```http
PUT /api/items/{id}
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description",
  "active": true
}
```

#### Delete Item

```http
DELETE /api/items/{id}
```

## Error Responses

### 400 Bad Request

```json
{
  "timestamp": "2024-01-01T00:00:00",
  "status": 400,
  "error": "Validation Failed",
  "message": "Input validation failed",
  "errors": {
    "name": "Name is required"
  }
}
```

### 404 Not Found

```json
{
  "timestamp": "2024-01-01T00:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Item not found with id: 123"
}
```

## Interactive Documentation

Visit `/swagger-ui.html` for interactive API documentation powered by OpenAPI/Swagger.
