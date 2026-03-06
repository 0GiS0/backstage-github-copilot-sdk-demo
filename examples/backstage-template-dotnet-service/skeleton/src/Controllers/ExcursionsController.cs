using Microsoft.AspNetCore.Mvc;
using BACKSTAGE_ENTITY_NAME.Models;

namespace BACKSTAGE_ENTITY_NAME.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MemesController : ControllerBase
{
    private readonly ILogger<MemesController> _logger;
    private static readonly List<Meme> _memes = new()
    {
        new Meme
        {
            Id = 1,
            Name = "Distracted Boyfriend",
            Description = "A man looking at another woman while his girlfriend looks disapprovingly",
            Category = "Classic",
            Rating = 9.5m,
            Views = 1000000,
            MaxShares = 500000,
            CreatedAt = DateTime.UtcNow.AddDays(-365),
            UpdatedAt = DateTime.UtcNow.AddDays(-365)
        },
        new Meme
        {
            Id = 2,
            Name = "Loss - Four Panels",
            Description = "The legendary webcomic moment that spawned a thousand memes",
            Category = "Abstract",
            Rating = 8.7m,
            Views = 2000000,
            MaxShares = 1000000,
            CreatedAt = DateTime.UtcNow.AddDays(-20),
            UpdatedAt = DateTime.UtcNow.AddDays(-20)
        }
    };
    private static int _nextId = 3;

    public MemesController(ILogger<MemesController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Meme>> GetAllMemes()
    {
        _logger.LogInformation("Getting all memes");
        return Ok(_memes);
    }

    [HttpGet("{id}")]
    public ActionResult<Meme> GetMemeById(int id)
    {
        _logger.LogInformation("Getting meme with id: {Id}", id);

        var meme = _memes.FirstOrDefault(e => e.Id == id);
        if (meme == null)
        {
            _logger.LogWarning("Meme with id {Id} not found", id);
            return NotFound($"Meme with id {id} not found");
        }

        return Ok(meme);
    }

    [HttpPost]
    public ActionResult<Meme> CreateMeme([FromBody] CreateMemeRequest request)
    {
        _logger.LogInformation("Creating new meme: {Name}", request.Name);

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest("Name is required");
        }

        if (string.IsNullOrWhiteSpace(request.Category))
        {
            return BadRequest("Category is required");
        }

        if (request.Rating < 0 || request.Rating > 10)
        {
            return BadRequest("Rating must be between 0 and 10");
        }

        if (request.Views < 0)
        {
            return BadRequest("Views must be greater than or equal to 0");
        }

        if (request.MaxShares < 0)
        {
            return BadRequest("MaxShares must be greater than or equal to 0");
        }

        var newMeme = new Meme
        {
            Id = _nextId++,
            Name = request.Name,
            Description = request.Description,
            Category = request.Category,
            Rating = request.Rating,
            Views = request.Views,
            MaxShares = request.MaxShares,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _memes.Add(newMeme);

        _logger.LogInformation("Created meme with id: {Id}", newMeme.Id);
        return CreatedAtAction(nameof(GetMemeById), new { id = newMeme.Id }, newMeme);
    }

    [HttpPut("{id}")]
    public ActionResult<Meme> UpdateMeme(int id, [FromBody] UpdateMemeRequest request)
    {
        _logger.LogInformation("Updating meme with id: {Id}", id);

        var meme = _memes.FirstOrDefault(e => e.Id == id);
        if (meme == null)
        {
            _logger.LogWarning("Meme with id {Id} not found for update", id);
            return NotFound($"Meme with id {id} not found");
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest("Name is required");
        }

        if (string.IsNullOrWhiteSpace(request.Category))
        {
            return BadRequest("Category is required");
        }

        if (request.Rating < 0 || request.Rating > 10)
        {
            return BadRequest("Rating must be between 0 and 10");
        }

        if (request.Views < 0)
        {
            return BadRequest("Views must be greater than or equal to 0");
        }

        if (request.MaxShares < 0)
        {
            return BadRequest("MaxShares must be greater than or equal to 0");
        }

        meme.Name = request.Name;
        meme.Description = request.Description;
        meme.Category = request.Category;
        meme.Rating = request.Rating;
        meme.Views = request.Views;
        meme.MaxShares = request.MaxShares;
        meme.UpdatedAt = DateTime.UtcNow;

        _logger.LogInformation("Updated meme with id: {Id}", id);
        return Ok(meme);
    }

    [HttpDelete("{id}")]
    public ActionResult DeleteMeme(int id)
    {
        _logger.LogInformation("Deleting meme with id: {Id}", id);

        var meme = _memes.FirstOrDefault(e => e.Id == id);
        if (meme == null)
        {
            _logger.LogWarning("Meme with id {Id} not found for deletion", id);
            return NotFound($"Meme with id {id} not found");
        }

        _memes.Remove(meme);

        _logger.LogInformation("Deleted meme with id: {Id}", id);
        return NoContent();
    }
}
