# Spring Boot Service Template

Welcome to the **Spring Boot Service Template** documentation. This template enables you to quickly scaffold a production-ready Spring Boot microservice with best practices built-in.

## Overview

This template creates a fully functional Spring Boot application with:

- ☕ **Java 21** with latest language features (records, pattern matching, virtual threads)
- 🍃 **Spring Boot 3.4** with auto-configuration
- 🌐 **REST API** with Spring Web MVC
- 📊 **Database access** with Spring Data JPA
- 📈 **Observability** with Spring Actuator
- 📝 **API Documentation** with SpringDoc OpenAPI
- 🧪 **Testing** with JUnit 5 and Testcontainers
- 🐳 **Containerization** with Docker and DevContainers

## Quick Start

1. Navigate to the Backstage Software Catalog
2. Click "Create" and select "Spring Boot Service"
3. Fill in the required information
4. Wait for the repository to be created
5. Clone and start developing!

## Architecture

The generated service follows a layered architecture:

```
┌─────────────────────────────────────┐
│          REST Controllers           │
│   (Handle HTTP requests/responses)  │
├─────────────────────────────────────┤
│            Services                 │
│    (Business logic & validation)    │
├─────────────────────────────────────┤
│           Repositories              │
│      (Data access with JPA)         │
├─────────────────────────────────────┤
│            Database                 │
│    (PostgreSQL with Flyway)         │
└─────────────────────────────────────┘
```

## Features

### Production-Ready

- Health checks for Kubernetes deployments
- Graceful shutdown handling
- Externalized configuration
- Structured logging with correlation IDs

### Developer Experience

- Hot reload with Spring DevTools
- Pre-configured DevContainer
- REST Client files for API testing
- Comprehensive test examples

### Security

- Input validation with Bean Validation
- CORS configuration
- Security headers
- Dependency vulnerability scanning

## Next Steps

- [Template Usage Guide](template-usage.md) - Detailed instructions for using this template
