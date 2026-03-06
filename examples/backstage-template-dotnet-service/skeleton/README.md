# BACKSTAGE_ENTITY_NAME

[![🚀 CI](https://github.com/${{values.destination.owner}}/${{values.destination.repo}}/actions/workflows/ci.yml/badge.svg)](https://github.com/${{values.destination.owner}}/${{values.destination.repo}}/actions/workflows/ci.yml)
[![🔎 Docker Image Analysis](https://github.com/${{values.destination.owner}}/${{values.destination.repo}}/actions/workflows/docker-analyze.yml/badge.svg)](https://github.com/${{values.destination.owner}}/${{values.destination.repo}}/actions/workflows/docker-analyze.yml)

A modern ASP.NET Core Web API template featuring meme management, built with .NET 9.0 and comprehensive testing.

> ℹ️ Security Learning Aid: This template intentionally includes an insecure `Dockerfile` (single-stage, root user, hard‑coded secret, latest tags, no healthcheck) so the automated Docker Image Analysis workflow can surface findings. Treat it as a training artifact—do **not** deploy it to production. See “Hardening the Docker Image” below for remediation guidance.

## 🚀 Quick Start

### Prerequisites

- .NET 9.0 SDK or higher
- (Optional) Docker for containerized development

### Development

1. **Clone and navigate to the project:**

   ```bash
   git clone <repository-url>
   cd BACKSTAGE_ENTITY_NAME
   ```

2. **Restore dependencies:**

   ```bash
   dotnet restore
   ```

3. **Build the project:**

   ```bash
   dotnet build
   ```

4. **Start the development server:**

   ```bash
   dotnet run --project src
   ```

5. **Run tests:**

   ```bash
   dotnet test
   ```

The API will be available at:

- HTTP: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/docs`

### Docker Development

This project includes a dev container configuration for consistent development environments:

1. Open the project in Visual Studio Code
2. Install the "Dev Containers" extension
3. Run "Dev Containers: Reopen in Container"

### 🔒 Docker Image Analysis & Hardening

An automated workflow (`docker-analyze.yml`) builds the provided insecure image and scans it with Trivy plus SBOM generation. It is configured to **not fail the build** initially (`exit_on_findings: false`) so you can review issues first.

Common issues intentionally present:

| Category | Insecure Pattern | Why it's bad | How to fix |
|----------|------------------|--------------|------------|
| Base image | `mcr.microsoft.com/dotnet/sdk:latest` single-stage | Large attack surface & mutable tag | Use multi-stage: sdk for build, aspnet runtime for final. Pin digest or minor version. |
| Privilege | Runs as root | Increases impact of compromise | Add a non-root user and `USER` instruction. |
| Secrets | `ARG FAKE_API_KEY` baked into image | Exposed in layers/history | Use runtime secrets / env injection (not in image). |
| Health | No `HEALTHCHECK` | Orchestrator can't detect failure | Add a lightweight `/health` probe. |
| Build context | `COPY . /app` | Copies unnecessary files | Use a `.dockerignore` and copy only needed project files. |
| Startup | `dotnet watch run` | Dev tool in prod image | Publish (`dotnet publish`) and run compiled DLL. |

To harden, create a new `Dockerfile.secure` (multi-stage) and update the workflow input `dockerfile: Dockerfile.secure`, then set `exit_on_findings: true` once clean.

## 📋 API Endpoints

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Root endpoint with service information |
| `GET` | `/health` | Health check endpoint (JSON response) |
| `GET` | `/api/hello` | Hello world endpoint |
| `GET` | `/api/status` | Detailed service status |

### Memes Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/memes` | Get all memes |
| `GET` | `/api/memes/{id}` | Get meme by ID |
| `POST` | `/api/memes` | Create new meme |
| `DELETE` | `/api/memes/{id}` | Delete meme |

### Example API Usage

```bash
# Get all memes
curl -X GET http://localhost:8080/api/memes

# Get specific meme
curl -X GET http://localhost:8080/api/memes/1

# Create new meme
curl -X POST http://localhost:8080/api/memes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chad Energy",
    "description": "Peak confidence and dominance",
    "category": "Attitude",
    "rating": 8.9,
    "views": 2100000,
    "maxShares": 750000
  }'
```

## 🏗️ Architecture

### Project Structure

```text
BACKSTAGE_ENTITY_NAME/
├── src/                          # Main application code
│   ├── Controllers/              # API controllers
│   │   ├── MemesController.cs
│   │   ├── HealthController.cs
│   │   ├── HelloController.cs
│   │   └── StatusController.cs
│   ├── Models/                   # Data models
│   │   └── ApiModels.cs
│   ├── Program.cs                # Application entry point
│   └── BACKSTAGE_ENTITY_NAME.csproj
├── tests/                        # Test suite
│   ├── ApiTests.cs               # Integration tests
│   └── BACKSTAGE_ENTITY_NAME.Tests.csproj
├── docs/                         # Documentation
├── .devcontainer/                # Development container config
├── .github/                      # GitHub workflows
└── README.md
```

### Technology Stack

- **Framework**: ASP.NET Core 9.0
- **Language**: C# 13
- **Documentation**: OpenAPI/Swagger
- **Testing**: xUnit with WebApplicationFactory
- **Development**: Dev Containers support
- **CI/CD**: GitHub Actions

### Key Features

- **RESTful API**: Full CRUD operations for memes
- **OpenAPI/Swagger**: Interactive API documentation
- **Health Checks**: Built-in health monitoring
- **CORS Support**: Cross-origin resource sharing
- **Structured Logging**: Comprehensive logging with ASP.NET Core
- **Integration Testing**: Full test coverage with WebApplicationFactory
- **Dev Containers**: Consistent development environment

## 🧪 Testing

The project includes comprehensive integration tests covering all API endpoints.

### Run Tests

```bash
# Run all tests
dotnet test

# Run tests with detailed output
dotnet test --verbosity detailed

# Run specific test
dotnet test --filter "Get_ApiMemes_ReturnsMemesList"

# Run tests with coverage
dotnet test --collect:"XPlat Code Coverage"
```

### Test Coverage

- ✅ All API endpoints
- ✅ HTTP status codes validation
- ✅ JSON response validation
- ✅ Error scenarios
- ✅ CRUD operations

## � Deployment

### Production Build

```bash
dotnet publish src -c Release -o ./publish
```

### Run Production Build

```bash
cd publish
dotnet BACKSTAGE_ENTITY_NAME.dll
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ASPNETCORE_ENVIRONMENT` | Runtime environment | `Production` |
| `ASPNETCORE_URLS` | Binding URLs | `http://localhost:8080` |

## �📦 Dependencies

### Main Dependencies

- **Microsoft.AspNetCore.OpenApi** (9.0.0): OpenAPI support
- **Swashbuckle.AspNetCore** (7.2.0): Swagger UI and documentation
- **Microsoft.Extensions.Diagnostics.HealthChecks** (9.0.0): Health checks
- **Microsoft.Extensions.Logging** (9.0.0): Structured logging

### Test Dependencies

- **Microsoft.AspNetCore.Mvc.Testing** (9.0.0): Integration testing
- **Microsoft.NET.Test.Sdk** (17.12.0): Test framework
- **xunit** (2.9.2): Testing framework
- **xunit.runner.visualstudio** (2.8.2): Visual Studio test runner

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📖 Documentation

Detailed documentation is available in the `/docs` directory and can be viewed using MkDocs:

```bash
mkdocs serve
```

## 🔗 Links

- [API Documentation](http://localhost:8080/docs)
- [Health Check](http://localhost:8080/health)
- [Backstage Component](./catalog-info.yaml)
