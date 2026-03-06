# Template Usage Guide

## Creating a New Library

### Step 1: Access the Template

Navigate to the Backstage Software Catalog and select "Create" > ".NET Library".

### Step 2: Fill in Parameters

| Field | Description | Example |
|-------|-------------|---------|
| Library Name | Unique name in kebab-case | `my-awesome-lib` |
| Description | Brief description | `A library for common utilities` |
| Team Owner | Your team | `platform-team` |
| System | Parent system | `core-platform` |
| Target Framework | .NET version | `net8.0` |

### Step 3: Repository Creation

The template will:
1. Create a GitHub repository
2. Set up the project structure
3. Configure CI/CD
4. Register in Backstage catalog

## Project Structure

```
my-library/
├── src/
│   ├── MyLibrary.csproj
│   ├── Library.cs
│   └── StringExtensions.cs
├── tests/
│   ├── MyLibrary.Tests.csproj
│   ├── LibraryTests.cs
│   └── StringExtensionsTests.cs
├── docs/
│   ├── index.md
│   ├── api-reference.md
│   └── contributing.md
├── .devcontainer/
│   └── devcontainer.json
├── .github/
│   ├── workflows/ci.yml
│   └── dependabot.yml
├── MyLibrary.sln
├── README.md
├── catalog-info.yaml
└── mkdocs.yml
```

## Development Workflow

### Local Development

```bash
# Restore dependencies
dotnet restore

# Build
dotnet build

# Run tests
dotnet test

# Create package
dotnet pack -c Release
```

### Using Dev Container

1. Open in VS Code
2. Click "Reopen in Container"
3. Wait for container to build
4. Start developing!

## Publishing to NuGet

### Manual Publishing

```bash
dotnet nuget push ./src/bin/Release/*.nupkg \
  --api-key YOUR_API_KEY \
  --source https://api.nuget.org/v3/index.json
```

### Automated Publishing

Modify the CI workflow to publish on release tags.

## Best Practices

1. **Versioning**: Use SemVer for package versions
2. **Documentation**: Keep XML docs up to date
3. **Testing**: Aim for high code coverage
4. **Dependencies**: Keep dependencies minimal
