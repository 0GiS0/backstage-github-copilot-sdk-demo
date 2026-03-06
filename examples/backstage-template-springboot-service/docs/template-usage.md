# Template Usage Guide

This guide explains how to use the Spring Boot Service template effectively.

## Prerequisites

Before using this template, ensure you have:

- Access to the Backstage portal
- Permissions to create repositories in the organization
- Understanding of the system your service belongs to

## Creating a New Service

### Step 1: Access the Template

1. Go to the Backstage Software Catalog
2. Click the **"Create"** button
3. Search for **"Spring Boot Service"**
4. Click **"Choose"** to start

### Step 2: Fill in Basic Information

| Field | Description | Example |
|-------|-------------|---------|
| **Project Name** | Kebab-case name for your service | `order-service` |
| **Description** | Brief description (max 340 chars) | `Manages customer orders and fulfillment` |
| **Owner** | Your team in Backstage | `platform-team` |
| **System** | The system this service belongs to | `ecommerce-platform` |
| **Service Tier** | Operational importance level | `tier-2` |
| **Team Owner** | GitHub team for maintenance | `backend-team` |

### Step 3: Choose Java Configuration

| Field | Description | Options |
|-------|-------------|---------|
| **Java Version** | JDK version for the project | `17` (LTS), `21` (LTS - Recommended) |
| **Spring Boot Version** | Framework version | `3.3.6` (Stable), `3.4.0` (Latest) |

### Step 4: Select Repository Destination

Choose where to create the repository:

- **Organization**: Your GitHub organization
- **Repository Name**: Auto-generated from project name

### Step 5: Review and Create

1. Review all entered information
2. Click **"Create"**
3. Wait for the scaffolding to complete

## After Creation

### Clone the Repository

```bash
git clone https://github.com/your-org/your-service.git
cd your-service
```

### Open in DevContainer (Recommended)

1. Open VS Code
2. Install the "Dev Containers" extension
3. Click "Reopen in Container"
4. Wait for the container to build

### Run the Application

```bash
# Using Maven
mvn spring-boot:run

# Or with specific profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Access the Application

- **API Base URL**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **Actuator**: http://localhost:8080/actuator/health

## Customization

### Adding New Endpoints

1. Create a new controller in `src/main/java/com/example/demo/controller/`
2. Add corresponding service in `service/`
3. If needed, add repository and model classes
4. Update tests in `src/test/java/`

### Database Configuration

Edit `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mydb
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:postgres}
```

### Adding Dependencies

Edit `pom.xml` and add to the `<dependencies>` section:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

## Best Practices

### Code Organization

- Keep controllers thin - move logic to services
- Use DTOs for API contracts
- Validate input with Bean Validation annotations
- Use constructor injection for dependencies

### Testing

- Write unit tests for services
- Use `@WebMvcTest` for controller tests
- Use Testcontainers for integration tests
- Aim for 80%+ code coverage

### Configuration

- Use environment variables for secrets
- Define profiles for different environments
- Externalize all configuration

## Troubleshooting

### Common Issues

**Application won't start**
- Check if port 8080 is available
- Verify database connection settings
- Review logs for detailed error messages

**Tests failing**
- Ensure test database is running (or Testcontainers is configured)
- Check for missing test dependencies
- Verify mock configurations

**Build failures**
- Run `mvn clean` and rebuild
- Check Java version matches pom.xml
- Verify Maven is installed correctly

## Getting Help

- Check the [Spring Boot Documentation](https://docs.spring.io/spring-boot/reference/)
- Review the generated README.md in your repository
- Contact the Platform Team for template issues
