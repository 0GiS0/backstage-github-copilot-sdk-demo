# AI Assistant Template

[![Template CI/CD](https://github.com/${github_organization}/${repository_name}/actions/workflows/ci-template.yml/badge.svg)](https://github.com/${github_organization}/${repository_name}/actions/workflows/ci-template.yml)


This template allows you to create to new AI assistant service with Python, FastAPI, and development best practices.

## What does this template include?

### Technologies and frameworks
- **Python 3.11+** with **FastAPI** for web APIs
- **OpenAI API** integración for capacidades of IA
- **Pydantic** for validación of datos
- **uvicorn** como ASGI server
- **pytest** for testing
- **black** and **isort** for formateo of código

### Project structure
- `src/` - Código fuente of the aplicación
  - `main.py` - Archivo principal of the aplicación
  - `models/` - Modethe of datos and DTOs
  - `services/` - Lógicto of negocio and servicios IA
  - `api/` - Endpoints of the API
- `tests/` - Automated tests
- `.devcontainer/` - Configuración for development in contenedores

### Included features
- **API REST** with endpoints for interacción with IA
- **Chat interface** for conversaciones
- **Health checks** integrados with FastAPI
- **Logging estructurado** with Python logging
- **Validación of modelos** with Pydantic
- **Manejo of errores** personalizado
- **CORS** configured for development
- **Rate limiting** for protection of APIs
- **Documentation automática** with Swagger UI

### DevOps and CI/CD
- **GitHub Actions** for CI/CD
- **Docker** multi-stage build
- **DevContainer** for development consistente
- **Dependabot** for actualizaciones of pip
- **CodeQL** for análisis of seguridad
- **MkDocs** for technical documentation

## Usage

1. Use this template from Backstage
2. Complete the form with:
   - Project name (in kebab-case)
   - Service description
   - System it belongs to
   - Service tier (1-3 or experimental)
   - Responsible team

3. The template will create:
   - Repositorand with complete structure Python
   - Branch protection configuration
   - Configured CI/CD pipelines
   - Initial documentation

## Generated structure

```
my-ai-assistant/
├── src/
│   ├── main.py
│   ├── models/
│   │   └── chat.py
│   ├── services/
│   │   └── ai_service.py
│   └── api/
│       └── chat.py
├── tests/
│   ├── test_api.py
│   └── test_services.py
├── .devcontainer/
│   └── devcontainer.json
├── .github/
│   └── workflows/
│       └── ci.yml
├── docs/
│   ├── index.md
│   └── api.md
├── requirements.txt
├── requirements-dev.txt
├── Dockerfile
└── README.md
```

## Included best practices

- **Clean Architecture** principles
- **Async/await** for operaciones concurrentes
- **Environment variables** for configuration
- **Error handling** robusto
- **API keand management** seguro
- **Response caching** for optimización
- **Input validation** exhaustiva
- **Logging** estructurado
- **Health checks** for Kubernetes

## Development configuration

- **Hot reload** with uvicorn
- **Interactive API docs** in `/docs`
- **Environment variables** for configuration local
- **Docker Compose** for servicios dependientes
- **Pre-commit hooks** for calidad of código

## Support

- **Documentation**: Check the generated documentation in `docs/`
- **Issues**: Report problems in the template repository
- **Slack**: #platform-team channthe for support
