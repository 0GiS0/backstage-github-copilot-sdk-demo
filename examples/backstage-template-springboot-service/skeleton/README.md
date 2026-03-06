# BACKSTAGE_ENTITY_NAME

> BACKSTAGE_ENTITY_DESCRIPTION

[![CI](https://github.com/${{values.destination.owner}}/${{values.destination.repo}}/actions/workflows/ci.yml/badge.svg)](https://github.com/${{values.destination.owner}}/${{values.destination.repo}}/actions/workflows/ci.yml)

## 🚀 Quick Start

### Prerequisites

- Java 21 or higher
- Maven 3.9+
- Docker (optional)

### Running locally

```bash
# Build the project
mvn clean package

# Run the application
mvn spring-boot:run

# Run with dev profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Using DevContainer

1. Open in VS Code
2. Click "Reopen in Container" when prompted
3. Wait for container to build
4. Run `mvn spring-boot:run`

## 📚 API Documentation

Once running, access:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI Spec**: http://localhost:8080/v3/api-docs
- **Health Check**: http://localhost:8080/actuator/health

## 🧪 Testing

```bash
# Run all tests
mvn test

# Run with coverage
mvn test jacoco:report

# Run integration tests
mvn verify
```

## 🏗️ Project Structure

```
src/
├── main/
│   ├── java/com/example/demo/
│   │   ├── Application.java          # Main entry point
│   │   ├── controller/                # REST controllers
│   │   ├── service/                   # Business logic
│   │   ├── repository/                # Data access
│   │   ├── model/                     # Domain entities
│   │   ├── dto/                       # Data Transfer Objects
│   │   ├── config/                    # Configuration
│   │   └── exception/                 # Exception handling
│   └── resources/
│       ├── application.yml            # Main configuration
│       ├── application-dev.yml        # Dev profile
│       └── db/migration/              # Flyway migrations
└── test/
    └── java/com/example/demo/         # Tests
```

## 🔧 Configuration

Environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `SERVER_PORT` | Server port | `8080` |
| `SPRING_PROFILES_ACTIVE` | Active profile | `default` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `demo` |
| `DB_USERNAME` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |

## 📦 Build & Deploy

```bash
# Build JAR
mvn clean package -DskipTests

# Build Docker image
docker build -t BACKSTAGE_ENTITY_NAME .

# Run Docker container
docker run -p 8080:8080 BACKSTAGE_ENTITY_NAME
```

## 📖 Documentation

For more information, see:

- [TechDocs](./docs/) - Technical documentation
- [API Reference](./docs/api/) - API documentation
- [Architecture](./docs/architecture/) - Architecture decisions

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests: `mvn test`
4. Submit a pull request

## 📄 License

This project is proprietary and confidential.
