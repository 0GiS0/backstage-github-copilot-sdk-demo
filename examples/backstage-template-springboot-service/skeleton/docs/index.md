# ${{values.name}}

> ${{values.description}}

## Overview

This is a Spring Boot microservice created from the organization's standard template.

## Quick Links

- [API Documentation](api/index.md)
- [Architecture Overview](architecture/overview.md)
- [Quick Start Guide](guide/quickstart.md)
- [Local Development](operations/local.md)

## Service Information

| Property | Value |
|----------|-------|
| **Owner** | ${{values.teamOwner}} |
| **System** | ${{values.system}} |
| **Service Tier** | ${{values.serviceTier}} |
| **Language** | Java 21 |
| **Framework** | Spring Boot 3.x |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/${{values.destination.owner}}/${{values.destination.repo}}.git

# Navigate to directory
cd ${{values.destination.repo}}

# Run with Maven
mvn spring-boot:run
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | List all items |
| GET | `/api/items/{id}` | Get item by ID |
| POST | `/api/items` | Create new item |
| PUT | `/api/items/{id}` | Update item |
| DELETE | `/api/items/{id}` | Delete item |

## Health & Monitoring

- Health Check: `GET /actuator/health`
- Metrics: `GET /actuator/metrics`
- API Docs: `GET /swagger-ui.html`
