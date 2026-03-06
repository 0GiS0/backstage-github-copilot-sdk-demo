# Reference

## Configuration Properties

### Application Properties

| Property | Description | Default |
|----------|-------------|---------|
| `server.port` | Server port | `8080` |
| `spring.application.name` | Application name | `demo` |
| `spring.profiles.active` | Active profile | `default` |

### Database Properties

| Property | Description | Default |
|----------|-------------|---------|
| `spring.datasource.url` | Database URL | H2 in-memory |
| `spring.datasource.username` | Database username | `sa` |
| `spring.datasource.password` | Database password | (empty) |

### JPA Properties

| Property | Description | Default |
|----------|-------------|---------|
| `spring.jpa.hibernate.ddl-auto` | Schema generation | `validate` |
| `spring.jpa.show-sql` | Show SQL queries | `false` |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SERVER_PORT` | Override server port | No |
| `DB_HOST` | Database host | For prod |
| `DB_PORT` | Database port | For prod |
| `DB_NAME` | Database name | For prod |
| `DB_USERNAME` | Database username | For prod |
| `DB_PASSWORD` | Database password | For prod |
| `SPRING_PROFILES_ACTIVE` | Active profiles | No |

## Dependencies

### Runtime Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| Spring Boot | 3.4.x | Application framework |
| Spring Web | 6.x | REST API support |
| Spring Data JPA | 3.x | Data access |
| PostgreSQL Driver | 42.x | Database driver |
| Flyway | 10.x | Database migrations |
| Lombok | 1.18.x | Boilerplate reduction |
| SpringDoc OpenAPI | 2.x | API documentation |

### Test Dependencies

| Dependency | Purpose |
|------------|---------|
| JUnit 5 | Testing framework |
| Mockito | Mocking framework |
| AssertJ | Fluent assertions |
| Testcontainers | Integration testing |

## API Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Internal Server Error |

## Profiles

| Profile | Description | Database |
|---------|-------------|----------|
| `default` | Default configuration | H2 in-memory |
| `dev` | Development | H2 file |
| `test` | Testing | H2 in-memory |
| `prod` | Production | PostgreSQL |
