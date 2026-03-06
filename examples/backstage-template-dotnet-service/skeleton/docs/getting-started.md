# Getting Started

This guide will help you set up and run the BACKSTAGE_ENTITY_NAME API in your local development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **.NET 9.0 SDK** or higher
- **Git** for version control
- **Visual Studio Code** (recommended) or any preferred IDE
- **(Optional)** Docker for containerized development

### Verify Prerequisites

```bash
# Check .NET version
dotnet --version

# Should output 9.0.x or higher
```

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd BACKSTAGE_ENTITY_NAME
```

### 2. Restore Dependencies

```bash
dotnet restore
```

### 3. Build the Project

```bash
dotnet build
```

### 4. Run the Application

```bash
dotnet run --project src
```

The API will start and be available at:

- **HTTP**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/docs

## Development with Dev Containers

For a consistent development environment, use the included dev container:

1. Install the **Dev Containers** extension in VS Code
2. Open the project in VS Code
3. Press `F1` and select **"Dev Containers: Reopen in Container"**
4. Wait for the container to build and start

The dev container includes all necessary tools and dependencies.

## First API Calls

Once the application is running, try these endpoints:

### Root Endpoint
```bash
curl http://localhost:8080/
```

**Response:**
```json
{
  "service": "BACKSTAGE_ENTITY_NAME",
  "message": "Welcome to BACKSTAGE_ENTITY_NAME API",
  "docs": "/docs",
  "health": "/health"
}
```

### Health Check
```bash
curl http://localhost:8080/health
```

**Response:**
```json
{
  "status": "OK",
  "service": "BACKSTAGE_ENTITY_NAME",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0"
}
```

### Get All Memes
```bash
curl http://localhost:8080/api/memes
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Mountain Hiking Adventure",
    "description": "A thrilling hike through the scenic mountain trails",
    "location": "Rocky Mountains",
    "price": 75.00,
    "duration": 6,
    "maxParticipants": 12
  },
  {
    "id": 2,
    "name": "City Food Tour",
    "description": "Explore the city's culinary delights",
    "location": "Downtown",
    "price": 45.00,
    "duration": 3,
    "maxParticipants": 8
  }
]
```

## Interactive API Documentation

Visit http://localhost:8080/docs to access the Swagger UI, where you can:

- Browse all available endpoints
- View request/response schemas
- Test API calls directly from the browser
- Download the OpenAPI specification

## Running Tests

Execute the test suite to verify everything is working:

```bash
# Run all tests
dotnet test

# Run tests with detailed output
dotnet test --verbosity detailed
```

## Project Structure Overview

```text
BACKSTAGE_ENTITY_NAME/
├── src/                    # Main application code
│   ├── Controllers/        # API controllers
│   ├── Models/            # Data models
│   ├── Program.cs         # Application entry point
│   └── *.csproj          # Project file
├── tests/                 # Test suite
│   ├── ApiTests.cs       # Integration tests
│   └── *.csproj         # Test project file
├── docs/                 # Documentation
├── .devcontainer/        # Dev container config
└── README.md            # Project overview
```

## Next Steps

- **[API Reference](api-reference.md)**: Explore all available endpoints
- **[Architecture](architecture.md)**: Understand the technical design
- **[Testing](testing.md)**: Learn about the testing strategy
- **[Contributing](contributing.md)**: Start contributing to the project

## Troubleshooting

### Port Already in Use

If port 8080 is already in use, you can specify a different port:

```bash
dotnet run --project src --urls "http://localhost:5000"
```

### Build Errors

If you encounter build errors:

1. Ensure you have .NET 9.0 SDK installed
2. Clear the NuGet cache: `dotnet nuget locals all --clear`
3. Restore dependencies: `dotnet restore`
4. Clean and rebuild: `dotnet clean && dotnet build`

### Test Failures

If tests fail:

1. Ensure the application builds successfully
2. Check that no other instance is running on the test port
3. Review test output for specific error details
