# Quick Start Guide

## Prerequisites

- Java 21 or higher
- Maven 3.9+
- (Optional) Docker

## Option 1: Run with Maven

```bash
# Clone the repository
git clone https://github.com/${{values.destination.owner}}/${{values.destination.repo}}.git
cd ${{values.destination.repo}}

# Build the project
mvn clean package

# Run with H2 database (default)
mvn spring-boot:run

# Or run with dev profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

## Option 2: Run with Docker

```bash
# Build and run with docker-compose
docker-compose up --build

# Or build image manually
docker build -t ${{values.name}} .
docker run -p 8080:8080 ${{values.name}}
```

## Option 3: Use DevContainer

1. Open the project in VS Code
2. Install the "Dev Containers" extension
3. Click "Reopen in Container" when prompted
4. Wait for the container to build
5. The application starts automatically

## Verify Installation

```bash
# Check health endpoint
curl http://localhost:8080/actuator/health

# Expected response
{"status":"UP"}
```

## Access the API

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Docs**: http://localhost:8080/v3/api-docs
- **Health Check**: http://localhost:8080/actuator/health

## First API Call

```bash
# Create an item
curl -X POST http://localhost:8080/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"My First Item","description":"Created via API"}'

# List all items
curl http://localhost:8080/api/items
```

## Next Steps

- Review the [API Documentation](../api/index.md)
- Understand the [Architecture](../architecture/overview.md)
- Set up [Local Development](../operations/local.md)
