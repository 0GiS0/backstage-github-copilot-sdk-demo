# .NET Service Template Usage Guide

This guide explains how to use the **.NET Service** template effectively to create new .NET microservices and APIs.

## Before You Start

### Prerequisites

- Access to your organization's Backstage instance
- .NET 8+ SDK installed on your development machine
- Basic understanding of C# and ASP.NET Core development
- Required permissions to create repositories in your organization

### Understanding This Template

**Template Type:** Backend Service
**Primary Use Case:** Create scalable .NET APIs and microservices
**Technologies:** .NET 8+, ASP.NET Core, Entity Framework Core

## Step-by-Step Usage

### 1. Access the Template

1. **Open Backstage:** Navigate to your organization's Backstage instance
2. **Create Component:** Click on "Create Component" or "Create" button
3. **Find Template:** Look for ".NET Service Template" in the available templates
4. **Start Creation:** Click "Choose" to begin using this template

### 2. Complete the Form

The template will prompt you for several required parameters:

#### **Service Name**
- **Format:** kebab-case (lowercase with hyphens)
- **Example:** `user-management-api`, `payment-service`
- **Requirements:** Must be unique within your organization

#### **Description**
- **Purpose:** Brief description of what your service does
- **Example:** "User management API for handling authentication and profiles"
- **Best Practice:** Keep it concise but descriptive

#### **Owner**
- **Format:** Team or individual username
- **Example:** `backend-team`, `platform-team`, `john.doe`
- **Recommendation:** Use team names rather than individual names when possible

#### **System**
- **Purpose:** Logical grouping of related components
- **Example:** `user-management`, `payment-processing`, `analytics`
- **Note:** Should align with your organization's system architecture

### 3. Review and Create

1. **Review Parameters:** Verify that all information is correct
2. **Create Service:** Click "Create" to generate the project
3. **Wait for Generation:** The process may take a few minutes
4. **Access Repository:** Once created, access the new repository

## Post-Creation Setup

### 1. Environment Setup

```bash
# Clone the repository
git clone https://github.com/your-org/your-dotnet-service.git
cd your-dotnet-service

# Restore packages
dotnet restore

# Build the solution
dotnet build
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database connection
ConnectionStrings__DefaultConnection=Host=localhost;Database=myservice;Username=postgres;Password=password

# JWT settings
Jwt__Key=your-secret-key-here
Jwt__Issuer=your-issuer
Jwt__Audience=your-audience

# Application settings
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=https://localhost:5001;http://localhost:5000
```

### 3. Database Setup

```bash
# Add database migration
dotnet ef migrations add InitialCreate --project src/YourService.Api

# Update database
dotnet ef database update --project src/YourService.Api
```

### 4. Run the Service

```bash
# Start the service
dotnet run --project src/YourService.Api

# Access API documentation
# https://localhost:5001/swagger
```

## Development Workflow

### 1. Creating Controllers

```csharp
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        var users = await _userService.GetAllAsync();
        return Ok(users);
    }
}
```

### 2. Adding Services

```csharp
public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllAsync();
    Task<UserDto?> GetByIdAsync(int id);
    Task<UserDto> CreateAsync(CreateUserRequest request);
}

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;
    
    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }
    
    // Implementation...
}
```

### 3. Entity Framework Models

```csharp
public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Email).IsRequired();
            entity.HasIndex(e => e.Email).IsUnique();
        });
    }
}
```

## Testing

### 1. Unit Tests

```csharp
public class UserServiceTests
{
    [Fact]
    public async Task GetAllAsync_ReturnsAllUsers()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        using var context = new ApplicationDbContext(options);
        var service = new UserService(context);

        // Act & Assert
        var result = await service.GetAllAsync();
        Assert.NotNull(result);
    }
}
```

### 2. Integration Tests

```csharp
public class UsersControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public UsersControllerTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetUsers_ReturnsOkResult()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/users");
        
        response.EnsureSuccessStatusCode();
    }
}
```

## Deployment

### 1. Docker

```bash
# Build Docker image
docker build -t my-dotnet-service .

# Run container
docker run -p 5000:80 my-dotnet-service
```

### 2. Production Configuration

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Your production connection string"
  },
  "Jwt": {
    "Key": "Production secret key",
    "Issuer": "your-domain.com",
    "Audience": "your-api"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Warning"
    }
  }
}
```

## Best Practices

### 1. Code Organization

- Use dependency injection for services
- Implement repository pattern for data access
- Separate concerns with proper layering
- Use DTOs for API contracts

### 2. Security

- Implement proper authentication and authorization
- Validate all input data
- Use HTTPS in production
- Implement rate limiting

### 3. Performance

- Use async/await for I/O operations
- Implement caching where appropriate
- Optimize database queries
- Use connection pooling

## Additional Resources

- [.NET Documentation](https://docs.microsoft.com/en-us/dotnet/)
- [ASP.NET Core Best Practices](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/best-practices)
- [Entity Framework Core Documentation](https://docs.microsoft.com/en-us/ef/core/)

## Contributing

To improve this template:

1. **Test changes** with the latest .NET version
2. **Update dependencies** regularly
3. **Document new features** thoroughly
4. **Maintain security** best practices
