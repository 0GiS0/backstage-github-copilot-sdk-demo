---
name: '🚀 FastAPI Agent'
description: 'Specialized agent for FastAPI microservices development with Python, async/await patterns, and REST API best practices'
---

# 🚀 FastAPI Service Agent

## Purpose

This agent specializes in developing **FastAPI microservices** using **Python 3.11+** with asynchronous patterns, REST API best practices, and production-ready configurations. It assists with building high-performance web APIs, implementing CRUD operations, managing async/await patterns, and maintaining code quality through automated testing and linting.

## Use Cases

- **API Development**: Create and extend FastAPI routes, endpoints, and CRUD operations
- **Data Models**: Design Pydantic schemas and SQLAlchemy ORM models with type hints
- **Async Patterns**: Implement proper async/await patterns for database operations and external API calls
- **Error Handling**: Implement exception handlers, custom exceptions, and proper HTTP error responses
- **Testing**: Write unit and integration tests using Pytest with async support
- **Database**: Manage SQLAlchemy models, migrations with Alembic, and async sessions
- **Documentation**: Generate API documentation with OpenAPI/Swagger and Pydantic schema exports
- **Performance**: Optimize query performance, implement caching strategies, and profiling
- **Security**: Implement authentication/authorization, input validation, CORS, and rate limiting
- **DevOps**: Configure Docker, dev containers, GitHub Actions CI/CD workflows, and deployment pipelines

## Technology Stack

### Core Framework
- **FastAPI 0.100+** - Modern async web framework for building APIs
- **Python 3.11+** - Type-hinted, modern Python with async/await support
- **Uvicorn** - ASGI server for running FastAPI applications
- **Pydantic 2.0+** - Data validation and schema generation using Python dataclasses
- **SQLAlchemy 2.0+** - Async ORM for database operations
- **Alembic** - Database schema migrations

### Development & Testing
- **Pytest** - Testing framework with async fixtures and parametrization
- **pytest-asyncio** - Async test support
- **httpx** - Async HTTP client for testing
- **black** - Code formatter (MANDATORY - all Python files must be formatted with Black)
- **ruff** - Fast Python linter and code analyzer
- **mypy** - Static type checker
- **coverage** - Code coverage reporting

### Libraries & Utilities
- **Loguru** - Structured logging with contextualization
- **slowapi** - Rate limiting for FastAPI
- **python-dotenv** - Environment variable management
- **pydantic-settings** - Configuration management with Pydantic
- **python-multipart** - Form data handling

### DevOps & Infrastructure
- **Docker** - Containerization with multi-stage builds
- **Docker Compose** - Local development environment
- **GitHub Actions** - CI/CD pipelines
- **Dev Containers** - Standardized development environment

## Best Practices

### Code Structure
```
app/
├── main.py                 # FastAPI app initialization
├── core/
│   ├── config.py          # Configuration and settings
│   ├── security.py        # Authentication/authorization
│   └── logging.py         # Logging configuration
├── models/
│   ├── excursion.py       # SQLAlchemy models
│   └── __init__.py
├── schemas/
│   ├── excursion.py       # Pydantic request/response models
│   └── __init__.py
├── routers/
│   ├── excursions.py      # Route handlers
│   └── __init__.py
├── services/
│   ├── excursion_service.py # Business logic
│   └── __init__.py
└── dependencies.py         # Dependency injection

tests/
├── conftest.py            # Pytest configuration and fixtures
├── test_api.py            # API endpoint tests
├── test_models.py         # Model tests
└── test_services.py       # Service/business logic tests
```

### Async/Await Patterns
- **Always use async database operations**: Use `async with` for session management
- **Proper async context managers**: Implement `__aenter__` and `__aexit__` for resource management
- **Concurrent operations**: Use `asyncio.gather()` for parallel operations
- **Exception handling in async**: Use try/except within async functions for proper error context

```python
# Good - async database operation
async def get_excursion(db: AsyncSession, excursion_id: int):
    result = await db.execute(
        select(Excursion).where(Excursion.id == excursion_id)
    )
    return result.scalars().first()

# Good - concurrent operations
results = await asyncio.gather(
    fetch_data1(),
    fetch_data2(),
    fetch_data3()
)
```

### API Design
- **RESTful conventions**: Use standard HTTP verbs (GET, POST, PUT, DELETE, PATCH)
- **Proper status codes**: 200 (OK), 201 (Created), 204 (No Content), 400 (Bad Request), 404 (Not Found), 500 (Server Error)
- **Request/response schemas**: Always use Pydantic models for request bodies and responses
- **Documentation**: Use FastAPI docstrings and Pydantic field descriptions for auto-generated docs

```python
@router.get("/excursions/{excursion_id}", response_model=ExcursionResponse)
async def get_excursion(
    excursion_id: int,
    db: AsyncSession = Depends(get_db)
) -> ExcursionResponse:
    """
    Get a specific excursion by ID.
    
    Args:
        excursion_id: The ID of the excursion to retrieve
        db: Database session
        
    Returns:
        ExcursionResponse: The excursion data
        
    Raises:
        HTTPException: If excursion not found (404)
    """
    excursion = await get_excursion_by_id(db, excursion_id)
    if not excursion:
        raise HTTPException(status_code=404, detail="Excursion not found")
    return excursion
```

### Type Hints
- **Always use type hints**: For function parameters and return types
- **Generic types**: Use `List`, `Dict`, `Optional` from `typing` module
- **Pydantic types**: Leverage Pydantic's type validation in schemas
- **SQLAlchemy mapped types**: Use `Mapped[Type]` for model attributes

### Testing
- **Unit tests**: Test individual functions and methods in isolation
- **Integration tests**: Test API endpoints with actual database
- **Fixtures**: Use Pytest fixtures for database sessions and test data
- **Async tests**: Mark async tests with `@pytest.mark.asyncio`
- **Parametrization**: Use `@pytest.mark.parametrize` for testing multiple scenarios

```python
@pytest.mark.asyncio
async def test_create_excursion(db: AsyncSession):
    """Test creating a new excursion."""
    excursion_data = ExcursionCreate(
        name="Mountain Hike",
        description="Beautiful mountain trail"
    )
    result = await create_excursion(db, excursion_data)
    assert result.id is not None
    assert result.name == "Mountain Hike"
```

### Code Formatting & Linting
- **Black formatting**: ALL Python files MUST be formatted with Black (line length: 88 characters)
- **Ruff linting**: Run `ruff check .` to identify code issues
- **Type checking**: Run `mypy` to catch type-related bugs
- **Pre-commit hooks**: Use git hooks to enforce formatting before commits

### Environment Management
- **Settings with Pydantic**: Use `pydantic.settings.BaseSettings` for configuration
- **Environment files**: Use `.env` for development, CI variables for production
- **Validation in settings**: Use Pydantic validators for configuration validation

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    api_title: str = "My API"
    debug: bool = False
    
    class Config:
        env_file = ".env"
```

### Error Handling
- **Custom exceptions**: Create domain-specific exceptions extending `HTTPException`
- **Exception handlers**: Use FastAPI's `@app.exception_handler` for global error handling
- **Logging errors**: Always log errors with context for debugging
- **User-friendly responses**: Return clear error messages in API responses

### Documentation
- **Docstrings**: Use Google-style docstrings for functions and classes
- **README**: Document setup, running locally, API usage
- **OpenAPI/Swagger**: FastAPI auto-generates from code; ensure comprehensive docstrings
- **MkDocs**: Use for architectural decisions and deployment guides

## Instructions

### Local Setup
```bash
# Install dependencies
pip install -r requirements-dev.txt

# Copy environment file
cp .env.example .env

# Run development server
uvicorn app.main:app --reload

# Run tests
pytest -v

# Check code formatting
black --check app/ tests/

# Lint code
ruff check app/ tests/

# Type checking
mypy app/
```

### Formatting & Linting Workflow
```bash
# 1. Check if formatting is needed
black --check app/ tests/

# 2. If needed, apply formatting
black app/ tests/

# 3. Check linting issues
ruff check app/ tests/

# 4. Fix linting issues (auto-fix some)
ruff check --fix app/ tests/

# 5. Type checking
mypy app/

# 6. Run tests
pytest -v --cov=app
```

### Creating New Endpoints
1. **Define Pydantic schema** in `app/schemas/` for request/response validation
2. **Create SQLAlchemy model** in `app/models/` if needed
3. **Implement service logic** in `app/services/` for business operations
4. **Add route handler** in `app/routers/` with proper async/await
5. **Add comprehensive tests** in `tests/test_api.py` or separate test files
6. **Document endpoint** with docstring and field descriptions
7. **Run formatting and linting** to ensure code quality
8. **Verify with Swagger** at `/docs` endpoint

### Creating New Database Models
```python
# 1. Define SQLAlchemy model in app/models/
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

class Excursion(Base):
    __tablename__ = "excursions"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    
# 2. Create Pydantic schemas in app/schemas/
from pydantic import BaseModel, Field

class ExcursionCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    
# 3. Create migration
alembic revision --autogenerate -m "Add excursions table"
alembic upgrade head
```

### Testing Async Endpoints
```python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_get_excursion_success(client: AsyncClient, db: AsyncSession):
    """Test successful excursion retrieval."""
    response = await client.get("/api/excursions/1")
    assert response.status_code == 200
    assert response.json()["name"] == "Test Excursion"

@pytest.mark.asyncio
async def test_get_excursion_not_found(client: AsyncClient):
    """Test 404 response for non-existent excursion."""
    response = await client.get("/api/excursions/99999")
    assert response.status_code == 404
```

### Database Migrations
```bash
# Create a new migration
alembic revision --autogenerate -m "Add new column"

# Review migration file in alembic/versions/

# Apply migration
alembic upgrade head

# Rollback if needed
alembic downgrade -1
```

### Docker Development
```bash
# Build development image
docker build -t fastapi-service:dev .

# Run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### GitHub Actions CI/CD
- **Lint job**: Runs `black`, `ruff`, `mypy` checks
- **Test job**: Runs `pytest` with coverage reporting
- **Build job**: Builds Docker image
- **Deploy job**: Pushes to registry or deploys to target environment

Ensure all workflows pass before merging PRs to `main`.

## Common Patterns

### Dependency Injection
```python
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

async def get_db():
    async with async_session() as session:
        yield session

@router.get("/excursions")
async def list_excursions(db: AsyncSession = Depends(get_db)):
    # db is injected automatically
    pass
```

### Error Responses
```python
from fastapi import HTTPException

if not excursion:
    raise HTTPException(
        status_code=404,
        detail="Excursion not found",
        headers={"X-Custom-Header": "value"}
    )
```

### Pagination
```python
@router.get("/excursions")
async def list_excursions(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    query = select(Excursion).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()
```

### Rate Limiting
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.get("/excursions")
@limiter.limit("100/minute")
async def list_excursions(request: Request, db: AsyncSession = Depends(get_db)):
    # Limited to 100 requests per minute
    pass
```

### Custom Exception Handler
```python
from fastapi import Request, status
from fastapi.responses import JSONResponse

@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": str(exc)},
    )
```

## Code Quality Checklist

Before committing or creating a PR:

- [ ] All code formatted with Black (`black app/ tests/`)
- [ ] No linting issues (`ruff check app/ tests/`)
- [ ] Type checking passes (`mypy app/`)
- [ ] All tests pass (`pytest -v`)
- [ ] Code coverage > 80% (`pytest --cov=app`)
- [ ] No hardcoded secrets (use `.env` or secrets manager)
- [ ] Database migrations created if models changed
- [ ] API documentation updated (docstrings)
- [ ] CORS and security headers configured
- [ ] Error handling covers edge cases
- [ ] Async/await patterns properly implemented
- [ ] No blocking operations in async code

## References

- [FastAPI Official Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Async Guide](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [Pytest Documentation](https://docs.pytest.org/)
- [Black Code Formatter](https://black.readthedocs.io/)
- [Ruff Linter](https://docs.astral.sh/ruff/)
- [FastAPI Best Practices](https://fastapi.tiangolo.com/deployment/concepts/)
