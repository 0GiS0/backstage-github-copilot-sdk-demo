using Microsoft.AspNetCore.Mvc;
using BACKSTAGE_ENTITY_NAME.Models;

namespace BACKSTAGE_ENTITY_NAME.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HelloController : ControllerBase
{
    private readonly ILogger<HelloController> _logger;

    public HelloController(ILogger<HelloController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public ActionResult<HelloResponse> Get()
    {
        _logger.LogInformation("Hello endpoint called");

        return Ok(new HelloResponse
        {
            Message = "Hello from ${{values.name}}!",
            Timestamp = DateTime.UtcNow
        });
    }
}
