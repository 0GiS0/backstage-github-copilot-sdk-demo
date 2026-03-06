# .NET Service Template

Template for creating .NET microservices and APIs using modern .NET technologies.

## Overview

This Backstage software template helps developers quickly create new .NET service projects following our organization's standards and best practices.

## Template Information

**Template Type:** Backend Service
**Primary Technology:** .NET 8+ (C#)
**Purpose:** Create scalable .NET microservices and APIs

This template generates projects with:

- Modern .NET project structure
- ASP.NET Core Web API configuration
- Entity Framework Core setup
- Authentication and authorization
- OpenAPI/Swagger documentation
- Health checks and metrics
- Complete documentation structure with TechDocs
- CI/CD pipeline configuration
- Development environment setup

## Quick Start

### Using this Template in Backstage

1. **Navigate to Backstage:** Open your Backstage instance
2. **Create Component:** Click "Create Component"
3. **Select Template:** Choose ".NET Service Template"
4. **Fill Form:** Complete the required information
5. **Create:** Click "Create" to generate your new project

### Template Parameters

When using this template, you'll be prompted for:

| Parameter | Description | Required |
|-----------|-------------|----------|
| **Name** | Service name (kebab-case) | ✅ |
| **Description** | Service description | ✅ |
| **Owner** | Service owner (team or user) | ✅ |
| **System** | System this service belongs to | ✅ |
| **Repository URL** | GitHub repository location | ✅ |

## Generated Project Structure

The template creates a complete project with:

```
my-dotnet-service/
├── README.md                     # Project documentation
├── .env.example                 # Environment variables template
├── .gitignore                  # Git ignore patterns
├── catalog-info.yaml           # Backstage catalog registration
├── mkdocs.yml                  # TechDocs configuration
├── MyService.sln               # Solution file
├── docs/                       # Project documentation
│   ├── index.md               # Main documentation page
│   ├── getting-started.md     # Setup and installation guide
│   ├── development.md         # Development guidelines
│   ├── api-reference.md       # API documentation
│   └── deployment.md          # Deployment guide
├── .github/
│   └── workflows/             # CI/CD pipelines
├── src/
│   └── MyService.Api/         # Main API project
│       ├── Controllers/       # API controllers
│       ├── Models/           # Data models
│       ├── Services/         # Business logic services
│       ├── Data/             # Data access layer
│       ├── Configuration/    # App configuration
│       ├── Program.cs        # Application entry point
│       └── appsettings.json  # Configuration file
├── tests/
│   ├── MyService.UnitTests/  # Unit tests
│   └── MyService.IntegrationTests/ # Integration tests
└── docker/
    ├── Dockerfile            # Container configuration
    └── docker-compose.yml    # Local development setup
```

## Features

### 🚀 Modern .NET Stack

- **.NET 8+** with latest language features
- **ASP.NET Core** for high-performance APIs
- **Entity Framework Core** for data access
- **Minimal APIs** and traditional controllers support
- **Dependency injection** and modern patterns

### 📚 TechDocs Integration

- **MkDocs configuration** for documentation generation
- **Comprehensive documentation structure** with multiple sections
- **Material theme** for professional documentation appearance
- **Search functionality** and navigation features
- **Automatic integration** with Backstage TechDocs

### 🔧 Development Environment

- **Dev Container configuration** for consistent development environments
- **Environment variables template** with example values
- **Code analysis tools** (SonarAnalyzer, StyleCop)
- **Testing framework setup** with xUnit
- **Package management** with NuGet

### 🚀 CI/CD Pipeline

- **GitHub Actions workflows** for automated testing and deployment
- **Code quality checks** including linting and testing
- **Security scanning** with CodeQL and dependency checks
- **Docker image building** and publishing
- **Automated deployments** for different environments

## Typical Use Cases

This template is ideal for:

- **REST APIs** and microservices
- **Background services** and workers
- **Integration services** with external systems
- **CRUD applications** with database operations
- **Real-time services** with SignalR

## Included Technologies

- **.NET 8+** as the runtime platform
- **ASP.NET Core** for web API development
- **Entity Framework Core** for data access
- **Serilog** for structured logging
- **FluentValidation** for input validation
- **AutoMapper** for object mapping
- **Swagger/OpenAPI** for API documentation
- **xUnit** for testing
- **Moq** for mocking in tests

## Getting Started After Creation

1. **Install .NET SDK 8+** on your development machine
2. **Configure environment variables** in `.env`
3. **Restore packages:** `dotnet restore`
4. **Run the application:** `dotnet run --project src/MyService.Api`
5. **Access API documentation** at `https://localhost:5001/swagger`

## Development Commands

```bash
# Restore packages
dotnet restore

# Build solution
dotnet build

# Run the API
dotnet run --project src/MyService.Api

# Run tests
dotnet test

# Create database migration
dotnet ef migrations add InitialCreate --project src/MyService.Api

# Update database
dotnet ef database update --project src/MyService.Api

# Format code
dotnet format
```

## API Development

### 1. Creating Controllers

```csharp
[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ICustomerService _customerService;

    public CustomersController(ICustomerService customerService)
    {
        _customerService = customerService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Customer>>> GetCustomers()
    {
        var customers = await _customerService.GetAllAsync();
        return Ok(customers);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Customer>> GetCustomer(int id)
    {
        var customer = await _customerService.GetByIdAsync(id);
        if (customer == null)
            return NotFound();
        
        return Ok(customer);
    }
}
```

### 2. Data Models

```csharp
public class Customer
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateCustomerRequest
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}
```

### 3. Services

```csharp
public interface ICustomerService
{
    Task<IEnumerable<Customer>> GetAllAsync();
    Task<Customer?> GetByIdAsync(int id);
    Task<Customer> CreateAsync(CreateCustomerRequest request);
    Task<Customer?> UpdateAsync(int id, UpdateCustomerRequest request);
    Task<bool> DeleteAsync(int id);
}

public class CustomerService : ICustomerService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public CustomerService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<Customer>> GetAllAsync()
    {
        return await _context.Customers.ToListAsync();
    }

    // Implementation of other methods...
}
```

## Database Configuration

### 1. Entity Framework Setup

```csharp
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Customer> Customers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(254);
            entity.HasIndex(e => e.Email).IsUnique();
        });
    }
}
```

### 2. Connection String Configuration

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=myservice;Username=postgres;Password=password"
  }
}
```

## Authentication & Authorization

### 1. JWT Configuration

```csharp
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = configuration["Jwt:Issuer"],
            ValidAudience = configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration["Jwt:Key"]))
        };
    });
```

### 2. Authorization Policies

```csharp
services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole("Admin"));
    
    options.AddPolicy("CustomerAccess", policy =>
        policy.RequireAuthenticatedUser()
              .RequireClaim("scope", "customer:read"));
});
```

## Testing

### 1. Unit Tests

```csharp
public class CustomerServiceTests
{
    private readonly Mock<ApplicationDbContext> _mockContext;
    private readonly Mock<IMapper> _mockMapper;
    private readonly CustomerService _service;

    public CustomerServiceTests()
    {
        _mockContext = new Mock<ApplicationDbContext>();
        _mockMapper = new Mock<IMapper>();
        _service = new CustomerService(_mockContext.Object, _mockMapper.Object);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllCustomers()
    {
        // Arrange
        var customers = new List<Customer>
        {
            new Customer { Id = 1, Name = "John Doe", Email = "john@example.com" }
        };

        // Act & Assert
        // Test implementation...
    }
}
```

### 2. Integration Tests

```csharp
public class CustomersControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public CustomersControllerTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task GetCustomers_ReturnsSuccessStatusCode()
    {
        // Act
        var response = await _client.GetAsync("/api/customers");

        // Assert
        response.EnsureSuccessStatusCode();
    }
}
```

## Docker Support

### 1. Dockerfile

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/MyService.Api/MyService.Api.csproj", "src/MyService.Api/"]
RUN dotnet restore "src/MyService.Api/MyService.Api.csproj"
COPY . .
WORKDIR "/src/src/MyService.Api"
RUN dotnet build "MyService.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "MyService.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MyService.Api.dll"]
```

### 2. Docker Compose

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "5000:80"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=Host=db;Database=myservice;Username=postgres;Password=password
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: myservice
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

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

- [.NET Documentation](https://docs.microsoft.com/en-us/dotnet/)
- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core Documentation](https://docs.microsoft.com/en-us/ef/core/)
- [Backstage Software Templates Documentation](https://backstage.io/docs/features/software-templates/)
