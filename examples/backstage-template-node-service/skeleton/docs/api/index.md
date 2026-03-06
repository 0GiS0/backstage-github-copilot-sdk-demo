# API

General description of the endpoints exposed by `BACKSTAGE_ENTITY_NAME`.

## Base Endpoints

| Method | Path        | Description        |
| ------ | ----------- | ------------------ |
| GET    | /health     | Healthcheck        |
| GET    | /api/hello  | Hello world sample |
| GET    | /api/status | Service status     |

## Sample Contract

```json
{
  "status": "ok",
  "uptime": 123.45,
  "timestamp": "2025-09-04T12:00:00Z"
}
```

## Future

- Add OpenAPI/Swagger specification.
- Define standard error codes.
