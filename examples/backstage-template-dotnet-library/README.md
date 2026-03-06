# 📦 .NET Library Template

This Backstage template creates a reusable .NET class library with NuGet packaging support.

## What does this template include?

### Project Structure

- **Solution file** (`.sln`) - Visual Studio solution
- **Library project** (`src/`) - Main library code with NuGet configuration
- **Test project** (`tests/`) - xUnit tests with FluentAssertions
- **Documentation** (`docs/`) - TechDocs-compatible documentation

### Features

- ✅ .NET 9.0 (latest LTS)
- ✅ NuGet package configuration ready
- ✅ XML documentation generation
- ✅ Unit testing with xUnit and FluentAssertions
- ✅ Code coverage with Coverlet
- ✅ GitHub Actions CI/CD pipeline
- ✅ Dependabot for dependency updates
- ✅ Dev Container for consistent development environment

### CI/CD Pipeline

The template includes a GitHub Actions workflow that:

1. Builds the library
2. Runs tests with code coverage
3. Creates NuGet packages on main branch
4. Uploads packages as artifacts

## Parameters

| Parameter | Description | Required |
|-----------|-------------|----------|
| `name` | Library name (kebab-case) | Yes |
| `description` | Short description | Yes |
| `owner` | Backstage group owner | Yes |
| `system` | System the library belongs to | Yes |
| `teamOwner` | Team responsible for maintenance | Yes |
| `enableNuGet` | Enable NuGet packaging | No (default: true) |

## Usage

After creating a library from this template:

```bash
# Build
dotnet build

# Test
dotnet test

# Create NuGet package
dotnet pack -c Release
```

## Technologies

- .NET 9.0
- C# with nullable reference types
- xUnit for testing
- FluentAssertions for test assertions
- Coverlet for code coverage
- GitHub Actions for CI/CD
