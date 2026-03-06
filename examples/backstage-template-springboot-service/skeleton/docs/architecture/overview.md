# Architecture Overview

## System Context

This service is a Spring Boot microservice that provides REST APIs for managing items.

```
┌─────────────────────────────────────────────────────────┐
│                      Clients                            │
│  (Web Apps, Mobile Apps, Other Services)                │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTP/REST
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   This Service                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │              REST Controllers                    │    │
│  │         (Handle HTTP requests)                   │    │
│  └─────────────────────────┬───────────────────────┘    │
│                            │                            │
│  ┌─────────────────────────▼───────────────────────┐    │
│  │               Service Layer                      │    │
│  │         (Business logic & validation)            │    │
│  └─────────────────────────┬───────────────────────┘    │
│                            │                            │
│  ┌─────────────────────────▼───────────────────────┐    │
│  │             Repository Layer                     │    │
│  │           (Data access with JPA)                 │    │
│  └─────────────────────────┬───────────────────────┘    │
└────────────────────────────┼────────────────────────────┘
                             │ JDBC
                             ▼
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │    Database     │
                    └─────────────────┘
```

## Layers

### Controller Layer

- Handles HTTP requests and responses
- Input validation using Bean Validation
- Maps between DTOs and domain objects
- Returns appropriate HTTP status codes

### Service Layer

- Contains business logic
- Manages transactions
- Orchestrates operations across repositories
- Throws domain-specific exceptions

### Repository Layer

- Data access using Spring Data JPA
- Defines custom queries when needed
- Manages entity persistence

## Key Technologies

| Technology | Purpose |
|------------|---------|
| Spring Boot | Application framework |
| Spring Web | REST API support |
| Spring Data JPA | Data access |
| PostgreSQL | Database |
| Flyway | Database migrations |
| Lombok | Reduce boilerplate |
| OpenAPI | API documentation |

## Design Patterns

- **DTO Pattern**: Separate API contracts from domain models
- **Repository Pattern**: Abstract data access
- **Service Layer**: Encapsulate business logic
- **Global Exception Handler**: Centralized error handling
