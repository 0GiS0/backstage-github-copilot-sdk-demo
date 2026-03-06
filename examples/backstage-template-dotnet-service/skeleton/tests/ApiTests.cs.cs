using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.VisualStudio.TestPlatform.TestHost;
using System.Net;
using System.Text;
using System.Text.Json;
using Xunit;

namespace BACKSTAGE_ENTITY_NAME.Tests;

public class ApiTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public ApiTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task Get_Root_ReturnsOkWithServiceInfo()
    {
        // Act
        var response = await _client.GetAsync("/");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadAsStringAsync();
        var json = JsonDocument.Parse(content);

        // Use camelCase property names as they appear in the actual JSON
        Assert.True(json.RootElement.TryGetProperty("service", out var serviceProperty));
        Assert.True(json.RootElement.TryGetProperty("message", out var messageProperty));
        Assert.True(json.RootElement.TryGetProperty("docs", out var docsProperty));
        Assert.True(json.RootElement.TryGetProperty("health", out var healthProperty));

        // Verify the values
        Assert.Equal("BACKSTAGE_ENTITY_NAME", serviceProperty.GetString());
        Assert.Equal("Welcome to BACKSTAGE_ENTITY_NAME API", messageProperty.GetString());
        Assert.Equal("/docs", docsProperty.GetString());
        Assert.Equal("/health", healthProperty.GetString());
    }

    [Fact]
    public async Task Get_Health_ReturnsHealthy()
    {
        // Act
        var response = await _client.GetAsync("/health");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadAsStringAsync();
        var json = JsonDocument.Parse(content);

        Assert.True(json.RootElement.TryGetProperty("status", out var statusProperty));
        Assert.Equal("OK", statusProperty.GetString());
    }

    [Fact]
    public async Task Get_ApiHello_ReturnsHelloResponse()
    {
        // Act
        var response = await _client.GetAsync("/api/hello");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadAsStringAsync();
        var json = JsonDocument.Parse(content);

        Assert.True(json.RootElement.TryGetProperty("message", out var messageProperty));
        Assert.True(json.RootElement.TryGetProperty("timestamp", out var timestampProperty));
    }

    [Fact]
    public async Task Get_ApiStatus_ReturnsStatus()
    {
        // Act
        var response = await _client.GetAsync("/api/status");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadAsStringAsync();
        var json = JsonDocument.Parse(content);

        Assert.True(json.RootElement.TryGetProperty("service", out var serviceProperty));
        Assert.True(json.RootElement.TryGetProperty("status", out var statusProperty));
        Assert.True(json.RootElement.TryGetProperty("uptime", out var uptimeProperty));
        Assert.True(json.RootElement.TryGetProperty("environment", out var environmentProperty));

        Assert.Equal("running", statusProperty.GetString());
    }

    [Fact]
    public async Task Get_ApiExcursions_ReturnsExcursionsList()
    {
        // Act
        var response = await _client.GetAsync("/api/excursions");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadAsStringAsync();
        var json = JsonDocument.Parse(content);

        Assert.True(json.RootElement.ValueKind == JsonValueKind.Array);
        Assert.True(json.RootElement.GetArrayLength() >= 2); // Should have at least 2 default excursions
    }

    [Fact]
    public async Task Get_ApiExcursionsById_ReturnsExcursion()
    {
        // Act
        var response = await _client.GetAsync("/api/excursions/1");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadAsStringAsync();
        var json = JsonDocument.Parse(content);

        Assert.True(json.RootElement.TryGetProperty("id", out var idProperty));
        Assert.True(json.RootElement.TryGetProperty("name", out var nameProperty));
        Assert.True(json.RootElement.TryGetProperty("description", out var descriptionProperty));
        Assert.True(json.RootElement.TryGetProperty("location", out var locationProperty));
        Assert.True(json.RootElement.TryGetProperty("price", out var priceProperty));

        Assert.Equal(1, idProperty.GetInt32());
    }

    [Fact]
    public async Task Get_ApiExcursionsById_NotFound_Returns404()
    {
        // Act
        var response = await _client.GetAsync("/api/excursions/999");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Post_ApiExcursions_CreatesNewExcursion()
    {
        // Arrange
        var newExcursion = new
        {
            name = "Beach Walking Tour",
            description = "A relaxing walk along beautiful beaches",
            location = "Coastal Area",
            price = 35.00,
            duration = 2,
            maxParticipants = 15
        };

        var json = JsonSerializer.Serialize(newExcursion);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/excursions", content);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var responseContent = await response.Content.ReadAsStringAsync();
        var responseJson = JsonDocument.Parse(responseContent);

        Assert.True(responseJson.RootElement.TryGetProperty("id", out var idProperty));
        Assert.True(responseJson.RootElement.TryGetProperty("name", out var nameProperty));
        Assert.Equal("Beach Walking Tour", nameProperty.GetString());
    }

    [Fact]
    public async Task Post_ApiExcursions_InvalidData_ReturnsBadRequest()
    {
        // Arrange
        var invalidExcursion = new
        {
            name = "", // Empty name should cause validation error
            description = "Test description",
            location = "Test location",
            price = -10.00, // Negative price should cause validation error
            duration = 2,
            maxParticipants = 15
        };

        var json = JsonSerializer.Serialize(invalidExcursion);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/excursions", content);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Delete_ApiExcursions_DeletesExcursion()
    {
        // First create an excursion to delete
        var newExcursion = new
        {
            name = "Test Excursion for Deletion",
            description = "This excursion will be deleted",
            location = "Test Location",
            price = 50.00,
            duration = 3,
            maxParticipants = 10
        };

        var json = JsonSerializer.Serialize(newExcursion);
        var content = new StringContent(json, Encoding.UTF8, "application/json");
        var createResponse = await _client.PostAsync("/api/excursions", content);

        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        var createContent = await createResponse.Content.ReadAsStringAsync();
        var createJson = JsonDocument.Parse(createContent);
        var excursionId = createJson.RootElement.GetProperty("id").GetInt32();

        // Act - Delete the excursion
        var deleteResponse = await _client.DeleteAsync($"/api/excursions/{excursionId}");

        // Assert
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        // Verify it's actually deleted
        var getResponse = await _client.GetAsync($"/api/excursions/{excursionId}");
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }
}
