# Contributing

Thank you for your interest in contributing to BACKSTAGE_ENTITY_NAME! This guide will help you get started with contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Code Style](#code-style)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Pledge

- **Be welcoming**: We welcome and encourage participation by everyone
- **Be respectful**: Disagreement is no excuse for poor manners
- **Be collaborative**: We work together to resolve conflicts
- **Be helpful**: We support each other in learning and growing

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/) or preferred IDE
- [Docker](https://www.docker.com/get-started) (optional, for containerized development)

### Development Environment

We recommend using the provided dev container for a consistent development environment:

1. Install [Docker](https://www.docker.com/get-started)
2. Install [VS Code Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
3. Open the project in VS Code
4. Reopen in container when prompted

Alternatively, you can set up the environment manually using the .NET SDK.

## Development Setup

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR-USERNAME/BACKSTAGE_ENTITY_NAME.git
cd BACKSTAGE_ENTITY_NAME
```

### Install Dependencies

```bash
# Restore NuGet packages
dotnet restore

# Verify the setup by running tests
dotnet test
```

### Run the Application

```bash
# Run in development mode
dotnet run --project src

# The API will be available at http://localhost:8080
# Swagger UI will be available at http://localhost:8080/swagger
```

## Making Changes

### Branch Naming

Create a descriptive branch name using one of these prefixes:

- `feature/` - New features or enhancements
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test improvements
- `chore/` - Maintenance tasks

Examples:
```bash
git checkout -b feature/add-meme-filtering
git checkout -b fix/health-check-timeout
git checkout -b docs/update-api-documentation
```

### Development Workflow

1. **Create a branch** from the main branch
2. **Make your changes** in small, logical commits
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Submit a pull request**

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation only changes
- `style:` - Changes that do not affect code meaning
- `refactor:` - Code change that neither fixes a bug nor adds a feature
- `test:` - Adding or correcting tests
- `chore:` - Changes to build process or auxiliary tools

Examples:
```bash
feat: add filtering support for memes endpoint
fix: resolve timeout issue in health check endpoint
docs: update API documentation with new endpoints
test: add integration tests for meme CRUD operations
```

## Testing

### Running Tests

```bash
# Run all tests
dotnet test

# Run tests with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run specific test class
dotnet test --filter "ClassName=ApiTests"

# Run tests in watch mode (during development)
dotnet watch test
```

### Writing Tests

We use xUnit for testing. All tests should be:

- **Fast**: Tests should run quickly
- **Independent**: Tests should not depend on each other
- **Repeatable**: Tests should produce the same result every time
- **Self-Validating**: Tests should have a clear pass/fail result
- **Timely**: Tests should be written at the appropriate time

#### Test Structure

```csharp
[Fact]
public async Task GetMemes_ReturnsAllMemes()
{
    // Arrange
    using var client = _factory.CreateClient();
    
    // Act
    var response = await client.GetAsync("/api/memes");
    
    // Assert
    response.EnsureSuccessStatusCode();
    var content = await response.Content.ReadAsStringAsync();
    var memes = JsonSerializer.Deserialize<List<Meme>>(content, _jsonOptions);
    
    Assert.NotNull(memes);
    Assert.NotEmpty(memes);
}
```

#### Test Categories

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions
- **API Tests**: Test HTTP endpoints end-to-end
- **Performance Tests**: Test performance characteristics

### Test Coverage

Aim for high test coverage:

- **Minimum**: 80% code coverage
- **Target**: 90%+ code coverage
- **Focus**: Critical business logic and edge cases

## Submitting Changes

### Pull Request Process

1. **Update your branch** with the latest changes from main:
```bash
git checkout main
git pull upstream main
git checkout your-feature-branch
git rebase main
```

2. **Push your changes**:
```bash
git push origin your-feature-branch
```

3. **Create a Pull Request** through GitHub with:
   - Clear title and description
   - Link to related issues
   - Screenshots (if applicable)
   - Test results

### Pull Request Template

```markdown
## Description

Brief description of changes made.

## Related Issues

Fixes #(issue number)

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?

- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## Checklist

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### Code Review Process

All submissions require review before merging:

1. **Automated checks** must pass (build, tests, linting)
2. **Peer review** by at least one maintainer
3. **Address feedback** promptly and professionally
4. **Final approval** from project maintainer

## Code Style

### .NET Coding Standards

Follow [Microsoft's C# Coding Conventions](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/inside-a-program/coding-conventions):

#### General Guidelines

- Use **PascalCase** for classes, methods, and properties
- Use **camelCase** for fields and variables
- Use **UPPER_CASE** for constants
- Use **descriptive names** for variables and methods
- Keep methods **small and focused**
- Use **async/await** for asynchronous operations

#### Example Code Style

```csharp
public class MemeService
{
    private readonly ILogger<MemeService> _logger;
    private const int MAX_MEMES = 10000;
    
    public MemeService(ILogger<MemeService> logger)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }
    
    public async Task<List<Meme>> GetMemesAsync(CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Retrieving all memes");
        
        // Implementation here
        return await SomeAsyncOperation(cancellationToken);
    }
}
```

### EditorConfig

The project includes an `.editorconfig` file that defines coding standards. Ensure your IDE respects these settings.

### Code Analysis

We use built-in .NET analyzers and Roslyn analyzers to maintain code quality:

```xml
<!-- In .csproj file -->
<PropertyGroup>
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
  <WarningsAsErrors />
  <WarningsNotAsErrors>CS1591</WarningsNotAsErrors>
</PropertyGroup>
```

## Documentation

### API Documentation

- **Swagger/OpenAPI**: Automatically generated from code annotations
- **XML Comments**: Document public APIs with XML comments
- **README**: Keep README.md up to date
- **MkDocs**: Update relevant documentation files

#### XML Documentation Example

```csharp
/// <summary>
/// Gets all memes from the system.
/// </summary>
/// <returns>A list of all available memes.</returns>
/// <response code="200">Returns the list of memes</response>
/// <response code="500">If there was an internal server error</response>
[HttpGet]
[ProducesResponseType(typeof(IEnumerable<Meme>), StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status500InternalServerError)]
public async Task<ActionResult<IEnumerable<Meme>>> GetMemes()
{
    // Implementation
}
```

### Documentation Updates

When making changes, update:

- XML documentation comments
- README.md (if applicable)
- API documentation in `docs/api-reference.md`
- Architecture documentation (if structural changes)
- Deployment documentation (if deployment changes)

## Community

### Getting Help

- **Issues**: Create GitHub issues for bugs or feature requests
- **Discussions**: Use GitHub Discussions for general questions
- **Documentation**: Check the `docs/` directory for detailed guides

### Reporting Issues

When reporting issues, include:

1. **Clear description** of the problem
2. **Steps to reproduce** the issue
3. **Expected behavior**
4. **Actual behavior**
5. **Environment information** (OS, .NET version, etc.)
6. **Logs or error messages** (if applicable)

### Suggesting Features

For feature suggestions:

1. **Search existing issues** to avoid duplicates
2. **Describe the use case** clearly
3. **Explain the benefit** to users
4. **Consider implementation complexity**
5. **Be open to discussion** and feedback

### Communication Guidelines

- **Be respectful** and professional
- **Stay on topic** in discussions
- **Provide constructive feedback**
- **Help others** when possible
- **Follow up** on your contributions

## Recognition

Contributors will be recognized in:

- **Contributors section** in README.md
- **Release notes** for significant contributions
- **GitHub contributors** page

Thank you for contributing to BACKSTAGE_ENTITY_NAME! Your efforts help make this project better for everyone.
