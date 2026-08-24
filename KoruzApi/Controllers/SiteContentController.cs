using System.Text.Json;
using System.Text.Json.Nodes;
using KoruzApi.Data;
using KoruzApi.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KoruzApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SiteContentController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IConfiguration _configuration;

    public SiteContentController(AppDbContext dbContext, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<ActionResult<object>> GetAll()
    {
        var entries = await _dbContext.SiteContent
            .OrderBy(x => x.WebsiteCode)
            .ToListAsync();

        var result = entries.ToDictionary(
            x => x.WebsiteCode,
            x => JsonDocument.Parse(x.JsonContent).RootElement);

        return Ok(new
        {
            updatedAtUtc = entries.Count == 0 ? DateTime.UtcNow : entries.Max(x => x.UpdatedAtUtc),
            sites = result
        });
    }

    [HttpGet("{websiteCode}")]
    public async Task<ActionResult<object>> Get(string websiteCode)
    {
        var normalized = NormalizeWebsiteCode(websiteCode);

        var entry = await _dbContext.SiteContent
            .FirstOrDefaultAsync(x => x.WebsiteCode == normalized);

        if (entry is null)
        {
            return Ok(new
            {
                websiteCode = normalized,
                updatedAtUtc = DateTime.UtcNow,
                siteContent = new { }
            });
        }

        var parsed = JsonDocument.Parse(entry.JsonContent).RootElement;

        return Ok(new
        {
            websiteCode = entry.WebsiteCode,
            id = entry.Id,
            updatedAtUtc = entry.UpdatedAtUtc,
            siteContent = parsed
        });
    }

    [HttpPut("{websiteCode}")]
    public async Task<ActionResult<object>> Put(string websiteCode, [FromBody] JsonElement payload)
    {
        if (!AdminToken.IsValid(_configuration, AdminToken.Extract(Request)))
        {
            return Unauthorized(new { message = "Admin token required." });
        }

        var normalized = NormalizeWebsiteCode(websiteCode);
        var entry = await _dbContext.SiteContent
            .FirstOrDefaultAsync(x => x.WebsiteCode == normalized);

        var now = DateTime.UtcNow;
        var incoming = JsonNode.Parse(payload.GetRawText()) as JsonObject ?? new JsonObject();

        JsonObject merged;
        if (entry is null)
        {
            merged = incoming;
            entry = new Models.SiteContent
            {
                WebsiteCode = normalized,
                JsonContent = merged.ToJsonString(),
                UpdatedAtUtc = now
            };
            _dbContext.SiteContent.Add(entry);
        }
        else
        {
            var existing = JsonNode.Parse(entry.JsonContent) as JsonObject ?? new JsonObject();
            merged = MergeObjects(existing, incoming);
            entry.JsonContent = merged.ToJsonString();
            entry.UpdatedAtUtc = now;
            _dbContext.SiteContent.Update(entry);
        }

        await _dbContext.SaveChangesAsync();

        return Ok(new
        {
            websiteCode = entry.WebsiteCode,
            id = entry.Id,
            updatedAtUtc = entry.UpdatedAtUtc,
            siteContent = JsonDocument.Parse(entry.JsonContent).RootElement
        });
    }

    private static JsonObject MergeObjects(JsonObject target, JsonObject source)
    {
        foreach (var property in source)
        {
            if (property.Value is JsonObject sourceObj && target[property.Key] is JsonObject targetObj)
            {
                target[property.Key] = MergeObjects(targetObj, sourceObj);
            }
            else
            {
                target[property.Key] = property.Value?.DeepClone();
            }
        }

        return target;
    }

    private static string NormalizeWebsiteCode(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return "A";

        var normalized = value.Trim();
        return normalized.Equals("a", StringComparison.OrdinalIgnoreCase) ? "A" :
               normalized.Equals("b", StringComparison.OrdinalIgnoreCase) ? "B" :
               normalized.ToUpperInvariant();
    }
}
