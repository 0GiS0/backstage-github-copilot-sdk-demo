# FastAPI Service Template

Template for creating FastAPI microservices and APIs using Python.

## Overview

This Backstage software template helps developers quickly create new FastAPI service projects following our organization's standards and best practices.

## Template Information

**Template Type:** Backend Service
**Primary Technology:** Python + FastAPI
**Purpose:** Create high-performance Python APIs and microservices

This template generates projects with:

- Modern FastAPI project structure
- Async/await support throughout
- Pydantic models for data validation
- OpenAPI/Swagger documentation
- Database integration with SQLAlchemy
- Authentication and authorization
- Testing with pytest
- Complete documentation structure with TechDocs
- CI/CD pipeline configuration
- Development environment setup

## Quick Start

### Using this Template in Backstage

1. **Navigate to Backstage:** Open your Backstage instance
2. **Create Component:** Click "Create Component"
3. **Select Template:** Choose "FastAPI Service Template"
4. **Fill Form:** Complete the required information
5. **Create:** Click "Create" to generate your new project

### Template Parameters

| Parameter | Description | Required |
|-----------|-------------|----------|
| **Name** | Service name (kebab-case) | ✅ |
| **Description** | Service description | ✅ |
| **Owner** | Service owner (team or user) | ✅ |
| **System** | System this service belongs to | ✅ |
| **Repository URL** | GitHub repository location | ✅ |

## Generated Project Structure

```
my-fastapi-service/
├── README.md                 # Project documentation
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore patterns
├── catalog-info.yaml       # Backstage catalog registration
├── mkdocs.yml              # TechDocs configuration
├── requirements.txt        # Python dependencies
├── pyproject.toml         # Python project configuration
├── docs/                   # Project documentation
├── .github/workflows/     # CI/CD pipelines
├── src/
│   ├── main.py           # FastAPI application entry point
│   ├── models/           # Pydantic models
│   ├── routers/          # API route handlers
│   ├── services/         # Business logic services
│   ├── database/         # Database configuration
│   └── core/             # Core utilities and config
├── tests/                # Test files
└── docker/
    ├── Dockerfile        # Container configuration
    └── docker-compose.yml # Local development setup
```

## Features

### ⚡ FastAPI Framework

- **High performance** async Python framework
- **Automatic API documentation** with OpenAPI
- **Type hints** and automatic validation
- **Dependency injection** system
- **WebSocket support** for real-time features

### 🔧 Development Tools

- **SQLAlchemy** for database ORM
- **Alembic** for database migrations
- **Pytest** for testing
- **Black** and **isort** for code formatting
- **Uvicorn** as ASGI server

## Getting Started After Creation

1. **Install Python 3.11+** and create virtual environment
2. **Install dependencies:** `pip install -r requirements.txt`
3. **Configure environment variables** in `.env`
4. **Run the application:** `uvicorn src.main:app --reload`
5. **Access API documentation** at `http://localhost:8000/docs`

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Python Best Practices](../python-best-practices.md)
