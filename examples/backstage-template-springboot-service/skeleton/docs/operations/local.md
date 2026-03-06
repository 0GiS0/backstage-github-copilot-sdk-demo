# Local Development

## Development Setup

### Prerequisites

1. **Java 21**: Install from [Adoptium](https://adoptium.net/) or use SDKMAN
2. **Maven 3.9+**: Bundled with most IDEs or install separately
3. **IDE**: IntelliJ IDEA, VS Code, or Eclipse

### Using SDKMAN (Recommended)

```bash
# Install SDKMAN
curl -s "https://get.sdkman.io" | bash

# Install Java 21
sdk install java 21-tem

# Install Maven
sdk install maven
```

## Running the Application

### Development Mode

```bash
# Run with dev profile (H2 database)
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Or set environment variable
export SPRING_PROFILES_ACTIVE=dev
mvn spring-boot:run
```

### With PostgreSQL

```bash
# Start PostgreSQL with Docker
docker run -d \
  --name postgres-dev \
  -e POSTGRES_DB=demo \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16-alpine

# Run with prod profile
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

## Testing

```bash
# Run all tests
mvn test

# Run with coverage
mvn test jacoco:report

# View coverage report
open target/site/jacoco/index.html

# Run specific test class
mvn test -Dtest=ItemControllerTest

# Run integration tests
mvn verify
```

## Hot Reload

Spring DevTools enables automatic restart on code changes:

```bash
# DevTools is included in dev dependencies
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Changes to Java files trigger automatic restart.

## Database Console

When using H2 with dev profile:

1. Navigate to http://localhost:8080/h2-console
2. Use JDBC URL: `jdbc:h2:file:./data/devdb`
3. Username: `sa`, Password: (empty)

## Debugging

### VS Code

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "java",
      "name": "Debug Spring Boot",
      "request": "launch",
      "mainClass": "com.example.demo.Application",
      "args": "--spring.profiles.active=dev"
    }
  ]
}
```

### IntelliJ IDEA

1. Right-click `Application.java`
2. Select "Debug 'Application'"
3. Set VM options: `-Dspring.profiles.active=dev`

## Common Commands

```bash
# Clean build
mvn clean

# Package without tests
mvn package -DskipTests

# Update dependencies
mvn versions:display-dependency-updates

# Check for security vulnerabilities
mvn dependency-check:check

# Format code (if configured)
mvn spotless:apply
```
