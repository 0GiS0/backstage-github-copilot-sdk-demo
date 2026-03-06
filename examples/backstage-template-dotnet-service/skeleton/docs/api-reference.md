# API Reference

Complete reference for all API endpoints available in the BACKSTAGE_ENTITY_NAME service.

## Base URL

```
http://localhost:8080
```

## Authentication

Currently, this API does not require authentication. All endpoints are publicly accessible.

## Response Format

All API responses follow a consistent JSON format:

- **Success responses**: Return the requested data directly or wrapped in appropriate structure
- **Error responses**: Include error details with appropriate HTTP status codes

## Core Endpoints

### Root Endpoint

Get basic service information.

**Endpoint:** `GET /`

**Response:**
```json
{
  "service": "BACKSTAGE_ENTITY_NAME",
  "message": "Welcome to BACKSTAGE_ENTITY_NAME API",
  "docs": "/docs",
  "health": "/health"
}
```

**Status Codes:**
- `200 OK`: Service information retrieved successfully

---

### Health Check

Check the health status of the service.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "OK",
  "service": "BACKSTAGE_ENTITY_NAME",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0"
}
```

**Status Codes:**
- `200 OK`: Service is healthy

---

### Hello World

Simple hello world endpoint for testing.

**Endpoint:** `GET /api/hello`

**Response:**
```json
{
  "message": "Hello from BACKSTAGE_ENTITY_NAME!",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Status Codes:**
- `200 OK`: Hello message retrieved successfully

---

### Service Status

Get detailed service status information.

**Endpoint:** `GET /api/status`

**Response:**
```json
{
  "service": "BACKSTAGE_ENTITY_NAME",
  "status": "running",
  "uptime": "2.15:30:45",
  "environment": "Development",
  "version": "1.0.0"
}
```

**Status Codes:**
- `200 OK`: Status information retrieved successfully

## Memes API

Complete CRUD operations for managing memes.

### Get All Memes

Retrieve a list of all available memes.

**Endpoint:** `GET /api/memes`

**Response:**
```json
[
  {
    "id": 1,
    "name": "Distracted Boyfriend",
    "description": "Classic meme of a man looking at another woman while his girlfriend looks on disapprovingly",
    "category": "Classic",
    "rating": 9.5,
    "views": 5000000,
    "maxShares": 1500000
  },
  {
    "id": 2,
    "name": "Laughing Tom Cruise",
    "description": "Tom Cruise laughing uncontrollably at something",
    "category": "Celebrity",
    "rating": 8.7,
    "views": 3200000,
    "maxShares": 890000
  }
]
```

**Status Codes:**
- `200 OK`: Memes retrieved successfully

---

### Get Meme by ID

Retrieve details of a specific meme.

**Endpoint:** `GET /api/memes/{id}`

**Path Parameters:**
- `id` (integer, required): The unique identifier of the meme

**Response:**
```json
{
  "id": 1,
  "name": "Distracted Boyfriend",
  "description": "Classic meme of a man looking at another woman while his girlfriend looks on disapprovingly",
  "category": "Classic",
  "rating": 9.5,
  "views": 5000000,
  "maxShares": 1500000
}
```

**Status Codes:**
- `200 OK`: Meme found and retrieved successfully
- `404 Not Found`: Meme with specified ID does not exist

**Example Error Response:**
```json
{
  "error": "Meme with id 999 not found"
}
```

---

### Create New Meme

Create a new meme.

**Endpoint:** `POST /api/memes`

**Request Headers:**
- `Content-Type: application/json`

**Request Body:**
```json
{
  "name": "Chad Energy",
  "description": "A meme expressing confidence and dominance",
  "category": "Attitude",
  "rating": 8.9,
  "views": 2100000,
  "maxShares": 750000
}
```

**Request Body Schema:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Name of the meme (max 100 characters) |
| `description` | string | Yes | Detailed description (max 500 characters) |
| `category` | string | Yes | Category/genre of the meme |
| `rating` | decimal | Yes | Rating from 0 to 10 |
| `views` | integer | Yes | Number of views (must be >= 0) |
| `maxShares` | integer | Yes | Maximum shares (must be >= 0) |

**Response:**
```json
{
  "id": 3,
  "name": "Chad Energy",
  "description": "A meme expressing confidence and dominance",
  "category": "Attitude",
  "rating": 8.9,
  "views": 2100000,
  "maxShares": 750000
}
```

**Status Codes:**
- `201 Created`: Meme created successfully
- `400 Bad Request`: Invalid input data

**Example Error Response:**
```json
{
  "error": "Invalid meme data: Name is required"
}
```

---

### Delete Meme

Delete an existing meme.

**Endpoint:** `DELETE /api/memes/{id}`

**Path Parameters:**
- `id` (integer, required): The unique identifier of the meme to delete

**Response:** No content body

**Status Codes:**
- `204 No Content`: Meme deleted successfully
- `404 Not Found`: Meme with specified ID does not exist

## Error Handling

The API uses standard HTTP status codes and provides descriptive error messages.

### Common Error Codes

| Status Code | Description |
|------------|-------------|
| `200 OK` | Request successful |
| `201 Created` | Resource created successfully |
| `204 No Content` | Request successful, no content to return |
| `400 Bad Request` | Invalid request data |
| `404 Not Found` | Resource not found |
| `500 Internal Server Error` | Unexpected server error |

### Error Response Format

```json
{
  "error": "Detailed error message explaining what went wrong"
}
```

## Rate Limiting

Currently, no rate limiting is implemented. This may be added in future versions.

## Examples

### cURL Examples

**Get all memes:**
```bash
curl -X GET http://localhost:8080/api/memes
```

**Get specific meme:**
```bash
curl -X GET http://localhost:8080/api/memes/1
```

**Create new meme:**
```bash
curl -X POST http://localhost:8080/api/memes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ultimate Chad Energy",
    "description": "The peak of confidence and dominance",
    "category": "Attitude",
    "rating": 9.5,
    "views": 4500000,
    "maxShares": 1200000
  }'
```

**Delete meme:**
```bash
curl -X DELETE http://localhost:8080/api/memes/3
```

### JavaScript Examples

**Using fetch API:**

```javascript
// Get all memes
const memes = await fetch('http://localhost:8080/api/memes')
  .then(response => response.json());

// Create new meme
const newMeme = await fetch('http://localhost:8080/api/memes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Laughing Tom Cruise',
    description: 'Tom Cruise laughing uncontrollably',
    category: 'Celebrity',
    rating: 8.7,
    views: 3200000,
    maxShares: 890000
  })
}).then(response => response.json());
```

## Interactive Documentation

For interactive API testing and exploration, visit the Swagger UI at:
[http://localhost:8080/docs](http://localhost:8080/docs) (when running locally)

The Swagger UI provides:
- Interactive endpoint testing
- Request/response schema validation
- Code generation examples
- OpenAPI specification download
