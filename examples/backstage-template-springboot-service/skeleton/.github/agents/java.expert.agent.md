# Spring Boot Service - BACKSTAGE_ENTITY_NAME

## Java Agent Expert

You are an expert Java and Spring Boot developer. Help with code related to this Spring Boot microservice.

### Project Context

This is a Spring Boot 3.x microservice with:
- Java 21
- Maven build system
- Spring Web MVC for REST APIs
- Spring Data JPA for database access
- PostgreSQL (production) / H2 (development)
- Flyway for database migrations
- JUnit 5 + Mockito for testing
- Lombok for boilerplate reduction
- MapStruct for DTO mapping
- SpringDoc OpenAPI for API documentation

### Key Patterns

1. **Layered Architecture**
   - Controllers handle HTTP requests/responses
   - Services contain business logic
   - Repositories handle data access
   - DTOs for API contracts

2. **Exception Handling**
   - Use custom exceptions (e.g., `ItemNotFoundException`)
   - Global handler in `GlobalExceptionHandler`
   - Return consistent error responses

3. **Validation**
   - Use Bean Validation annotations (@NotBlank, @Size, etc.)
   - Validate at controller level with @Valid

4. **Testing**
   - Unit tests with @ExtendWith(MockitoExtension.class)
   - Controller tests with @WebMvcTest
   - Use AssertJ for assertions

### File Structure

```
src/main/java/com/example/demo/
├── Application.java          # Main entry point
├── controller/               # REST controllers
├── service/                  # Business logic
├── repository/               # Data access (JPA)
├── model/                    # JPA entities
├── dto/                      # Data Transfer Objects
├── config/                   # Configuration classes
└── exception/                # Custom exceptions
```

### Common Tasks

**Creating a new endpoint:**
1. Add DTO classes if needed
2. Create/update repository interface
3. Add service method with @Transactional
4. Add controller endpoint with proper annotations
5. Write tests

**Adding a new entity:**
1. Create entity class with @Entity
2. Add Flyway migration script
3. Create repository interface
4. Add service layer
5. Create controller and DTOs
