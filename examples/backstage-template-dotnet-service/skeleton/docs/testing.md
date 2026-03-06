# Testing

This document covers the comprehensive testing strategy and implementation for the BACKSTAGE_ENTITY_NAME service.

## Testing Philosophy

The BACKSTAGE_ENTITY_NAME project follows a testing strategy focused on:

- **Integration Testing**: End-to-end API testing using real HTTP calls
- **Test Coverage**: All API endpoints and scenarios covered
- **Reliability**: Consistent and repeatable test results
- **Maintainability**: Easy to understand and modify tests

## Testing Framework

### Technology Stack

- **xUnit**: Primary testing framework for .NET
- **WebApplicationFactory**: ASP.NET Core integration testing
- **ASP.NET Core Test Host**: In-memory test server
- **System.Text.Json**: JSON parsing and validation

### Project Structure

```text
tests/
├── ApiTests.cs                     # Integration tests
├── BACKSTAGE_ENTITY_NAME.Tests.csproj  # Test project file
└── bin/                           # Compiled test assemblies
```

## Integration Tests

### WebApplicationFactory Setup

The test class inherits from `IClassFixture<WebApplicationFactory<Program>>` to:

- Create an in-memory test server
- Host the full application pipeline
- Provide HttpClient for making requests
- Ensure isolated test execution

```csharp
public class ApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public ApiTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }
}
```

## Test Categories

### 1. Core Endpoints Tests

#### Root Endpoint Test
```csharp
[Fact]
public async Task Get_Root_ReturnsOkWithServiceInfo()
```
**Validates:**
- HTTP 200 OK response
- JSON structure with required properties
- Correct service information

#### Health Check Test
```csharp
[Fact]
public async Task Get_Health_ReturnsHealthy()
```
**Validates:**
- HTTP 200 OK response
- JSON health response format
- Status field contains "OK"

#### Hello Endpoint Test
```csharp
[Fact]
public async Task Get_ApiHello_ReturnsHelloResponse()
```
**Validates:**
- HTTP 200 OK response
- JSON response with message and timestamp

#### Status Endpoint Test
```csharp
[Fact]
public async Task Get_ApiStatus_ReturnsStatus()
```
**Validates:**
- HTTP 200 OK response
- Complete status information
- Service status is "running"

### 2. Memes API Tests

#### Get All Memes
```csharp
[Fact]
public async Task Get_ApiMemes_ReturnsMemesList()
```
**Validates:**
- HTTP 200 OK response
- JSON array response
- Minimum number of default memes
- Array structure validation

#### Get Excursion by ID
```csharp
[Fact]
public async Task Get_ApiExcursionsById_ReturnsExcursion()
```
**Validates:**
- HTTP 200 OK response
- Complete excursion object
- All required properties present
- Correct data types and values

#### Get Non-Existent Excursion
```csharp
[Fact]
public async Task Get_ApiExcursionsById_NotFound_Returns404()
```
**Validates:**
- HTTP 404 Not Found response
- Proper error handling for missing resources

#### Create New Excursion
```csharp
[Fact]
public async Task Post_ApiExcursions_CreatesNewExcursion()
```
**Validates:**
- HTTP 201 Created response
- Location header with new resource URL
- Complete excursion object in response
- Generated ID assignment

#### Create Excursion with Invalid Data
```csharp
[Fact]
public async Task Post_ApiExcursions_InvalidData_ReturnsBadRequest()
```
**Validates:**
- HTTP 400 Bad Request response
- Input validation error handling
- Proper error message format

#### Delete Excursion
```csharp
[Fact]
public async Task Delete_ApiExcursions_DeletesExcursion()
```
**Validates:**
- HTTP 204 No Content response for deletion
- Resource actually removed (404 on subsequent GET)
- Complete delete workflow

## Test Data

### Default Excursions

The service includes default excursions for testing:

```csharp
{
    Id = 1,
    Name = "Mountain Hiking Adventure",
    Description = "A thrilling hike through the scenic mountain trails",
    Location = "Rocky Mountains",
    Price = 75.00m,
    Duration = 6,
    MaxParticipants = 12
},
{
    Id = 2,
    Name = "City Food Tour",
    Description = "Explore the city's best culinary spots",
    Location = "Downtown",
    Price = 45.00m,
    Duration = 3,
    MaxParticipants = 8
}
```

### Test Request Payloads

#### Valid Excursion Creation
```json
{
    "name": "Beach Walking Tour",
    "description": "A relaxing walk along beautiful beaches",
    "location": "Coastal Area",
    "price": 35.00,
    "duration": 2,
    "maxParticipants": 15
}
```

#### Invalid Excursion Data
```json
{
    "name": "",
    "description": "Test description",
    "location": "Test location",
    "price": -10.00,
    "duration": 2,
    "maxParticipants": 15
}
```

## Running Tests

### Command Line

```bash
# Run all tests
dotnet test

# Run tests with detailed output
dotnet test --verbosity detailed

# Run specific test
dotnet test --filter "Get_ApiExcursions_ReturnsExcursionsList"

# Run tests by category
dotnet test --filter "FullyQualifiedName~Excursions"

# Generate code coverage
dotnet test --collect:"XPlat Code Coverage"
```

### Visual Studio Code

1. Install the **C# Dev Kit** extension
2. Use the **Test Explorer** to run and debug tests
3. Set breakpoints in test code for debugging
4. View test results in the **Output** panel

### Test Output

#### Successful Test Run
```
Test run for BACKSTAGE_ENTITY_NAME.Tests.dll(.NETCoreApp,Version=v9.0)
Microsoft (R) Test Execution Command Line Tool Version 17.8.0

Starting test execution, please wait...
A total of 1 test files matched the specified pattern.

Passed!  - Failed:     0, Passed:    10, Skipped:     0, Total:    10, Duration: 2s
```

#### Failed Test Example
```
[xUnit.net 00:00:00.89]     BACKSTAGE_ENTITY_NAME.Tests.ApiTests.Get_Health_ReturnsHealthy [FAIL]
[xUnit.net 00:00:00.89]       Assert.Equal() Failure: Values differ
[xUnit.net 00:00:00.89]       Expected: "Healthy"
[xUnit.net 00:00:00.89]       Actual:   "{"status":"OK","service":"BACKSTAGE_ENTITY_NAME"...
```

## Test Coverage

### Current Coverage

| Component | Coverage | Tests |
|-----------|----------|--------|
| Controllers | 100% | 10 tests |
| Core Endpoints | 100% | 4 tests |
| Excursions API | 100% | 6 tests |
| Error Scenarios | 100% | 2 tests |

### Coverage Details

**ExcursionsController**
- ✅ GET /api/excursions (all excursions)
- ✅ GET /api/excursions/{id} (specific excursion)
- ✅ GET /api/excursions/{id} (not found scenario)
- ✅ POST /api/excursions (create excursion)
- ✅ POST /api/excursions (validation error)
- ✅ DELETE /api/excursions/{id} (delete excursion)

**Other Controllers**
- ✅ GET / (root endpoint)
- ✅ GET /health (health check)
- ✅ GET /api/hello (hello endpoint)  
- ✅ GET /api/status (status endpoint)

## Testing Best Practices

### Test Naming Convention

Tests follow the pattern: `{HttpMethod}_{Endpoint}_{ExpectedBehavior}`

Examples:
- `Get_ApiExcursions_ReturnsExcursionsList`
- `Post_ApiExcursions_CreatesNewExcursion`
- `Get_ApiExcursionsById_NotFound_Returns404`

### Test Structure (AAA Pattern)

```csharp
[Fact]
public async Task TestMethod()
{
    // Arrange - Set up test data and conditions
    var requestData = new { /* test data */ };
    
    // Act - Execute the operation being tested
    var response = await _client.PostAsync("/api/endpoint", content);
    
    // Assert - Verify the results
    Assert.Equal(HttpStatusCode.Created, response.StatusCode);
}
```

### Async Testing

All tests use async/await pattern:
- Consistent with API async nature
- Non-blocking test execution
- Better test performance

### JSON Validation

Tests parse and validate JSON responses:

```csharp
var content = await response.Content.ReadAsStringAsync();
var json = JsonDocument.Parse(content);

Assert.True(json.RootElement.TryGetProperty("id", out var idProperty));
Assert.Equal(1, idProperty.GetInt32());
```

## Debugging Tests

### Common Issues

1. **Port Conflicts**: Ensure no other instances are running
2. **Test Isolation**: Tests should not depend on each other
3. **Data State**: In-memory data resets between test runs
4. **Timing Issues**: Use proper async/await patterns

### Debugging Tips

1. **Use Breakpoints**: Set breakpoints in test code and API code
2. **Check Logs**: Review test output for detailed error information
3. **Isolate Tests**: Run single tests to identify specific issues
4. **Verify Data**: Check request/response data in debugger

### Test Data Debugging

Add logging to see actual vs expected data:

```csharp
var content = await response.Content.ReadAsStringAsync();
_output.WriteLine($"Response content: {content}");
```

## Future Testing Enhancements

### Planned Improvements

1. **Unit Tests**: Add focused unit tests for business logic
2. **Performance Tests**: Load testing and benchmarking
3. **Contract Tests**: API contract validation
4. **Mock Dependencies**: External service mocking
5. **Test Data Management**: More sophisticated test data handling

### Advanced Testing Scenarios

1. **Concurrent Operations**: Multiple simultaneous requests
2. **Error Conditions**: Network failures, timeouts
3. **Edge Cases**: Boundary value testing
4. **Security Testing**: Authentication and authorization
5. **Stress Testing**: High load scenarios

This comprehensive testing approach ensures the API reliability and maintainability while providing confidence in deployments and changes.
