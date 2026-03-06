# AI Assistant Template

Template for creating AI assistants based on Python and FastAPI.

## Overview

This Backstage software template helps developers quickly create new AI assistant projects following our organization's standards and best practices.

## Template Information

**Template Type:** AI Assistant
**Primary Technology:** Python + FastAPI
**Purpose:** Create conversational AI assistants

This template generates projects with:

- Pre-configured project structure for AI
- FastAPI as web framework
- ML/AI dependencies configuration
- Standard configuration files
- Complete documentation structure with TechDocs
- CI/CD pipeline configuration
- Development environment setup

## Quick Start

### Using this Template in Backstage

1. **Navigate to Backstage:** Open your Backstage instance
2. **Create Component:** Click "Create Component"
3. **Select Template:** Choose "AI Assistant Template"
4. **Fill Form:** Complete the required information
5. **Create:** Click "Create" to generate your new project

### Template Parameters

When using this template, you'll be prompted for:

| Parameter | Description | Required |
|-----------|-------------|----------|
| **Name** | Project name (kebab-case) | ✅ |
| **Description** | Project description | ✅ |
| **Owner** | Project owner (team or user) | ✅ |
| **System** | System this component belongs to | ✅ |
| **Repository URL** | GitHub repository location | ✅ |

## Generated Project Structure

The template creates a complete project with:

```
my-ai-assistant/
├── README.md                 # Project documentation
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore patterns
├── catalog-info.yaml       # Backstage catalog registration
├── mkdocs.yml              # TechDocs configuration
├── requirements.txt        # Python dependencies
├── pyproject.toml         # Python project configuration
├── docs/                   # Project documentation
│   ├── index.md           # Main documentation page
│   ├── getting-started.md # Setup and installation guide
│   ├── development.md     # Development guidelines
│   ├── api-reference.md   # API documentation
│   └── deployment.md      # Deployment guide
├── .github/
│   └── workflows/         # CI/CD pipelines
├── src/                   # Source code
│   ├── main.py           # Application entry point
│   ├── models/           # Data models
│   ├── routers/          # API routes
│   ├── services/         # AI assistant services
│   └── utils/            # Utilities
└── tests/                 # Test files
```

## Features

### 🤖 AI Capabilities

- **FastAPI framework** for fast REST APIs
- **AI model integration** (OpenAI, Hugging Face, etc.)
- **Conversation management** and context handling
- **Prompt configuration** and templates
- **Interaction logging** and monitoring

### 📚 TechDocs Integration

- **MkDocs configuration** for documentation generation
- **Comprehensive documentation structure** with multiple sections
- **Material theme** for professional documentation appearance
- **Search functionality** and navigation features
- **Automatic integration** with Backstage TechDocs

### 🔧 Development Environment

- **Dev Container configuration** for consistent development environments
- **Environment variables template** with example values
- **Linting and formatting tools** pre-configured (black, flake8)
- **Testing framework setup** and example tests
- **Dependency management** with pip-tools

### 🚀 CI/CD Pipeline

- **GitHub Actions workflows** for automated testing and deployment
- **Code quality checks** including linting and testing
- **Security scanning** with CodeQL and secret detection
- **Automated deployments** for different environments

## Typical Use Cases

This template is ideal for:

- **Corporate chatbots** for customer support
- **Code assistants** for development
- **Document analysis tools** with AI
- **Natural language processing APIs**
- **Intelligent recommendation systems**

## Included Technologies

- **Python 3.11+** as primary language
- **FastAPI** for web framework
- **Pydantic** for data validation
- **Uvicorn** as ASGI server
- **Pytest** for testing
- **Black** and **Flake8** for formatting and linting
- **OpenAPI/Swagger** for API documentation

## Getting Started After Creation

1. **Configure environment variables** in `.env`
2. **Install dependencies:** `pip install -r requirements.txt`
3. **Configure API keys** for AI services
4. **Run the application:** `uvicorn src.main:app --reload`
5. **Access documentation** at `http://localhost:8000/docs`

## Support

### Getting Help

- **Template Issues:** Contact `@platform-team`
- **Backstage Issues:** Contact `@platform-team`
- **Generated Project Issues:** Contact the project owner
- **Security Concerns:** Contact `@security`

## Contributing

To contribute to this template:

1. **Fork the repository**
2. **Create a feature branch**
3. **Make changes** to skeleton files or template configuration
4. **Test thoroughly** with local Backstage instance
5. **Submit pull request** with detailed description

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Backstage Software Templates Documentation](https://backstage.io/docs/features/software-templates/)
- [AI Development Guidelines](../organization-ai-guidelines.md)
- [Python Best Practices](../python-best-practices.md)
