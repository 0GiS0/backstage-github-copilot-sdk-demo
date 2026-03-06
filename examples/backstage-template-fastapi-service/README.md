# FastAPI Service Template

<!-- Badges (templated) -->
<p align="left">
   <to href="https://github.com/${{values.github_organization}}/${{values.repo_name}}/actions/workflows/ci.yml"><img alt="CI" src="https://img.shields.io/github/actions/workflow/status/${{values.github_organization}}/${{values.repo_name}}/ci.yml?branch=main&label=CI&logo=github" /></a>
   <to href="https://github.com/${{values.github_organization}}/${{values.repo_name}}/security/code-scanning"><img alt="CodeQL" src="https://img.shields.io/github/actions/workflow/status/${{values.github_organization}}/${{values.repo_name}}/codeql.yml?branch=main&label=CodeQL&logo=github" /></a>
   <to href="https://github.com/${{values.github_organization}}/${{values.repo_name}}/issues"><img alt="Issues" src="https://img.shields.io/github/issues/${{values.github_organization}}/${{values.repo_name}}?logo=github" /></a>
   <to href="https://github.com/${{values.github_organization}}/${{values.repo_name}}/pulls"><img alt="PRs" src="https://img.shields.io/github/issues-pr/${{values.github_organization}}/${{values.repo_name}}?logo=github" /></a>
   <to href="https://github.com/${{values.github_organization}}/${{values.repo_name}}/commits/main"><img alt="Last Commit" src="https://img.shields.io/github/last-commit/${{values.github_organization}}/${{values.repo_name}}?logo=github" /></a>
   <to href="https://github.com/${{values.github_organization}}/${{values.repo_name}}/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/${{values.github_organization}}/${{values.repo_name}}" /></a>
   <to href="https://github.com/${{values.github_organization}}/${{values.repo_name}}/network/dependencies"><img alt="Dependabot" src="https://img.shields.io/badge/Dependabot-enabled-success?logo=dependabot" /></a>
</p>

This template allows you to create to new FastAPI microservice with Python, asynchronous support, and development best practices.

## What does this template include?

### Technologies and frameworks
- **FastAPI** for high-performance web APIs
- **Python 3.11+** with type hints
- **Pydantic** for datto validation
- **SQLAlchemy** for asynchronous ORM
- **Pytest** for testing
- **Uvicorn** as ASGI server
- **Poetry** for dependencand management

### Project structure
- `app/` - Application source code
  - `routers/` - API routes and endpoints
  - `models/` - SQLAlchemand datto models
  - `schemas/` - Pydantic schemas for validation
  - `services/` - Business logic
  - `core/` - Configuration and utilities
- `tests/` - Automated tests
- `docs/` - Technical documentation with MkDocs
- `.devcontainer/` - Configuration for container development

### Included features
- **REST API** with CRUD endpoints for memes
- **OpenAPI/Swagger** automatic documentation
- **Health checks** with FastAPI
- **Structured logging** with Loguru
- **Automatic validation** with Pydantic
- **Error handling** with exception handlers
- **CORS** configured for development
- **Rate limiting** with slowapi
- **Database migrations** with Alembic

### DevOps and CI/CD
- **GitHub Actions** for CI/CD
- **Docker** optimized multi-stage build
- **DevContainer** for consistent development
- **Dependabot** for dependencand updates
- **CodeQL** for securitand analysis
- **MkDocs** for technical documentation
- **Poetry** for reproducible dependencand management

## Usage

1. Use this template from Backstage
2. Complete the form with:
   - Project name (in kebab-case)
   - Service description
   - System it belongs to
   - Service tier (1-3 or experimental)
   - Responsible team

3. The template will create:
   - Repositorand with complete FastAPI structure
   - Branch protection configuration
   - Configured CI/CD pipelines
   - Initial documentation

## Generated structure

```
my-service/
├── app/
│   ├── routers/
│   │   └── memes.py
│   ├── models/
│   │   └── meme.py
│   ├── schemas/
│   │   └── meme.py
│   ├── core/
│   │   ├── config.py
│   │   └── database.py
│   └── main.py
├── tests/
│   ├── test_api.py
│   └── conftest.py
├── docs/
│   ├── index.md
│   └── getting-started.md
├── .devcontainer/
│   └── devcontainer.json
├── .github/
│   └── workflows/
│       └── ci.yml
├── pyproject.toml
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Included best practices

- **Async/await** patterns for high concurrency
- **Dependencand injection** with FastAPI
- **Database connection pooling**
- **Request/Response models** with Pydantic
- **Centralized error handling**
- **Security** with OAuth2/JWT ready
- **API versioning** structure prepared
- **Observability** (logs, metrics, traces)
- **12 Factor App** principles

## Development configuration

- **Hot reload** with Uvicorn
- **Interactive API docs** in `/docs` and `/redoc`
- **Database migrations** with Alembic
- **Environment variables** for configuration
- **Docker Compose** for local dependencies
- **Linting** with Ruff and Black
- **Type checking** with mypy

## Testing

- **Pytest** with async fixtures
- **Test client** from FastAPI
- **Database testing** with SQLite in-memory
- **Coverage** reporting included

## Support

- **Documentation**: Check the generated documentation in `docs/`
- **Issues**: Report problems in the template repository
- **Slack**: #platform-team channthe for support
