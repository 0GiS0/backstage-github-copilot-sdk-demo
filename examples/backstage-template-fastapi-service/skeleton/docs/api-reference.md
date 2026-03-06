# API Reference

This page provides comprehensive documentation for all API endpoints available in the ${{values.name}} service.

## Base URL

```
http://localhost:8000
```

For production deployments, replace with your actual domain.

## Authentication

Currently, this service does not implement authentication. All endpoints are publicly accessible. 

!!! warning "Production Considerations"
    In a production environment, you should implement proper authentication and authorization mechanisms.

## Data Models

### Excursion

The main data model representing an excursion.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | integer | Yes (read-only) | Unique identifier |
| `name` | string | Yes | Name of the excursion (min length: 1) |
| `description` | string | No | Detailed description |
| `location` | string | Yes | Where the excursion takes place (min length: 1) |
| `price` | number | Yes | Price in currency units (> 0) |
| `duration` | integer | Yes | Duration in hours (> 0) |
| `max_participants` | integer | Yes | Maximum number of participants (> 0) |
| `created_at` | string | Yes (read-only) | ISO timestamp of creation |
| `updated_at` | string | Yes (read-only) | ISO timestamp of last update |

### Example Excursion Object

```json
{
  "id": 1,
  "name": "Mountain Hiking Adventure",
  "description": "A thrilling hike through the scenic mountain trails with breathtaking views",
  "location": "Rocky Mountains",
  "price": 75.00,
  "duration": 6,
  "max_participants": 12,
  "created_at": "2023-12-01T10:00:00.000Z",
  "updated_at": "2023-12-01T10:00:00.000Z"
}
```

## Health & Status Endpoints

### Health Check

Check if the service is healthy and running.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "OK",
  "service": "${{values.name}}",
  "timestamp": "2023-12-01T10:00:00.000Z",
  "version": "1.0.0"
}
```

**Status Codes:**
- `200 OK`: Service is healthy

### Service Status

Get detailed service status including uptime.

**Endpoint:** `GET /api/status`

**Response:**
```json
{
  "service": "${{values.name}}",
  "status": "running",
  "uptime": 3600.5,
  "environment": "development"
}
```

**Status Codes:**
- `200 OK`: Status retrieved successfully

### Root Information

Get service information and available endpoints.

**Endpoint:** `GET /`

**Response:**
```json
{
  "service": "${{values.name}}",
  "message": "Welcome to the Excursions API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "hello": "/api/hello",
    "status": "/api/status",
    "excursions": "/api/excursions",
    "docs": "/docs",
    "redoc": "/redoc"
  },
  "excursion_endpoints": {
    "get_all_excursions": "GET /api/excursions",
    "get_excursion_by_id": "GET /api/excursions/{id}",
    "create_excursion": "POST /api/excursions",
    "update_excursion": "PUT /api/excursions/{id}",
    "delete_excursion": "DELETE /api/excursions/{id}"
  }
}
```

### Hello World

Simple greeting endpoint.

**Endpoint:** `GET /api/hello`

**Response:**
```json
{
  "message": "Hello from ${{values.name}}!",
  "timestamp": "2023-12-01T10:00:00.000Z"
}
```

## Excursions API

### List All Excursions

Retrieve all available excursions.

**Endpoint:** `GET /api/excursions/`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Mountain Hiking Adventure",
    "description": "A thrilling hike through the scenic mountain trails",
    "location": "Rocky Mountains",
    "price": 75.00,
    "duration": 6,
    "max_participants": 12,
    "created_at": "2023-12-01T10:00:00.000Z",
    "updated_at": "2023-12-01T10:00:00.000Z"
  }
]
```

**Status Codes:**
- `200 OK`: Excursions retrieved successfully

### Get Excursion by ID

Retrieve a specific excursion by its ID.

**Endpoint:** `GET /api/excursions/{excursion_id}`

**Path Parameters:**
- `excursion_id` (integer): The ID of the excursion to retrieve

**Response:**
```json
{
  "id": 1,
  "name": "Mountain Hiking Adventure",
  "description": "A thrilling hike through the scenic mountain trails",
  "location": "Rocky Mountains",
  "price": 75.00,
  "duration": 6,
  "max_participants": 12,
  "created_at": "2023-12-01T10:00:00.000Z",
  "updated_at": "2023-12-01T10:00:00.000Z"
}
```

**Status Codes:**
- `200 OK`: Excursion found and returned
- `404 Not Found`: Excursion with specified ID not found

**Error Response (404):**
```json
{
  "detail": "Excursion with id 999 not found"
}
```

### Create New Excursion

Create a new excursion.

**Endpoint:** `POST /api/excursions/`

**Request Body:**
```json
{
  "name": "Beach Walking Tour",
  "description": "A relaxing walk along beautiful beaches",
  "location": "Coastal Area",
  "price": 35.00,
  "duration": 2,
  "max_participants": 15
}
```

**Response:**
```json
{
  "id": 3,
  "name": "Beach Walking Tour",
  "description": "A relaxing walk along beautiful beaches",
  "location": "Coastal Area",
  "price": 35.00,
  "duration": 2,
  "max_participants": 15,
  "created_at": "2023-12-01T10:00:00.000Z",
  "updated_at": "2023-12-01T10:00:00.000Z"
}
```

**Status Codes:**
- `201 Created`: Excursion created successfully
- `422 Unprocessable Entity`: Validation error

**Validation Rules:**
- `name`: Must not be empty
- `location`: Must not be empty
- `price`: Must be greater than 0
- `duration`: Must be greater than 0
- `max_participants`: Must be greater than 0

### Update Excursion

Update an existing excursion.

**Endpoint:** `PUT /api/excursions/{excursion_id}`

**Path Parameters:**
- `excursion_id` (integer): The ID of the excursion to update

**Request Body:**
```json
{
  "name": "Updated Mountain Adventure",
  "description": "Updated description for mountain hiking",
  "location": "Updated Rocky Mountains",
  "price": 85.00,
  "duration": 7,
  "max_participants": 10
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Updated Mountain Adventure",
  "description": "Updated description for mountain hiking",
  "location": "Updated Rocky Mountains",
  "price": 85.00,
  "duration": 7,
  "max_participants": 10,
  "created_at": "2023-12-01T10:00:00.000Z",
  "updated_at": "2023-12-01T11:30:00.000Z"
}
```

**Status Codes:**
- `200 OK`: Excursion updated successfully
- `404 Not Found`: Excursion with specified ID not found
- `422 Unprocessable Entity`: Validation error

### Delete Excursion

Delete an existing excursion.

**Endpoint:** `DELETE /api/excursions/{excursion_id}`

**Path Parameters:**
- `excursion_id` (integer): The ID of the excursion to delete

**Response:** No content

**Status Codes:**
- `204 No Content`: Excursion deleted successfully
- `404 Not Found`: Excursion with specified ID not found

## Error Handling

The API uses standard HTTP status codes and returns error details in JSON format.

### Common Error Responses

**404 Not Found:**
```json
{
  "detail": "Excursion with id 999 not found"
}
```

**422 Validation Error:**
```json
{
  "detail": [
    {
      "loc": ["body", "price"],
      "msg": "ensure this value is greater than 0",
      "type": "value_error.number.not_gt",
      "ctx": {"limit_value": 0}
    }
  ]
}
```

**500 Internal Server Error:**
```json
{
  "detail": "Internal server error"
}
```

## Interactive Documentation

The service provides interactive API documentation through Swagger UI and ReDoc:

- **Swagger UI**: `GET /docs` - Interactive interface to test endpoints
- **ReDoc**: `GET /redoc` - Clean, three-panel documentation
- **OpenAPI Schema**: `GET /openapi.json` - Raw OpenAPI specification

## Rate Limiting

Currently, no rate limiting is implemented. In production, consider implementing rate limiting to prevent abuse.

## CORS

Cross-Origin Resource Sharing (CORS) is enabled for all origins in development. Configure appropriately for production use.
