namespace BACKSTAGE_ENTITY_NAME.Models;

public class HealthResponse
{
    public string Status { get; set; } = string.Empty;
    public string Service { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string Version { get; set; } = string.Empty;
}

public class HelloResponse
{
    public string Message { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}

public class StatusResponse
{
    public string Service { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public TimeSpan Uptime { get; set; }
    public string Environment { get; set; } = string.Empty;
}

public class Meme
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Rating { get; set; } // Rating from 0 to 10
    public int Views { get; set; }
    public int MaxShares { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateMemeRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Rating { get; set; }
    public int Views { get; set; }
    public int MaxShares { get; set; }
}

public class UpdateMemeRequest
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Rating { get; set; }
    public int Views { get; set; }
    public int MaxShares { get; set; }
}
