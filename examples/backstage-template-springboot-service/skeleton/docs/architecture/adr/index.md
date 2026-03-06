# Architecture Decision Records

## What is an ADR?

An Architecture Decision Record (ADR) captures an important architectural decision made along with its context and consequences.

## ADR Template

```markdown
# ADR-XXX: Title

## Status
Proposed | Accepted | Deprecated | Superseded

## Context
What is the issue that we're seeing that is motivating this decision or change?

## Decision
What is the change that we're proposing and/or doing?

## Consequences
What becomes easier or more difficult to do because of this change?
```

## Index

| ID | Title | Status | Date |
|----|-------|--------|------|
| ADR-001 | Use Spring Boot 3.x | Accepted | 2024-01-01 |
| ADR-002 | Use PostgreSQL for persistence | Accepted | 2024-01-01 |
| ADR-003 | Use Flyway for migrations | Accepted | 2024-01-01 |

---

## ADR-001: Use Spring Boot 3.x

### Status
Accepted

### Context
We need a robust framework for building REST APIs with Java.

### Decision
Use Spring Boot 3.x as the application framework.

### Consequences
- **Positive**: Well-documented, large community, extensive ecosystem
- **Positive**: Built-in support for observability, security, and data access
- **Negative**: Requires Java 17+ (addressed by using Java 21)

---

## ADR-002: Use PostgreSQL for persistence

### Status
Accepted

### Context
We need a reliable database for storing application data.

### Decision
Use PostgreSQL as the primary database.

### Consequences
- **Positive**: Open source, reliable, excellent performance
- **Positive**: Rich feature set including JSONB, full-text search
- **Negative**: Requires database administration

---

## ADR-003: Use Flyway for migrations

### Status
Accepted

### Context
We need a way to manage database schema changes.

### Decision
Use Flyway for database migrations.

### Consequences
- **Positive**: Version-controlled schema changes
- **Positive**: Repeatable, automated migrations
- **Negative**: Learning curve for SQL migrations
