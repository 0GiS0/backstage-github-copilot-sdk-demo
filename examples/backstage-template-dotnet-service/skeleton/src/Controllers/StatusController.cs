using Microsoft.AspNetCore.Mvc;
using BACKSTAGE_ENTITY_NAME.Models;

namespace BACKSTAGE_ENTITY_NAME.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatusController : ControllerBase
{
    private readonly ILogger<StatusController> _logger;
    private static readonly DateTime StartTime = DateTime.UtcNow;

    public StatusController(ILogger<StatusController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public ActionResult<StatusResponse> Get()
    {
        _logger.LogInformation("Status endpoint called");

        return Ok(new StatusResponse
        {
            Service = "BACKSTAGE_ENTITY_NAME",
            Status = "running",
            Uptime = DateTime.UtcNow - StartTime,
            Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development"
        });
    }
}
