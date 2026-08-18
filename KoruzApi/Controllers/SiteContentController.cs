using System.Text.Json;
using KoruzApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KoruzApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SiteContentController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public SiteContentController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
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
            updatedAtUtc = entries.Max(x => x.UpdatedAtUtc),
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
        var normalized = NormalizeWebsiteCode(websiteCode);
        var rawJson = payload.GetRawText();

        var entry = await _dbContext.SiteContent
            .FirstOrDefaultAsync(x => x.WebsiteCode == normalized);

        var now = DateTime.UtcNow;

        if (entry is null)
        {
            entry = new Models.SiteContent
            {
                WebsiteCode = normalized,
                JsonContent = rawJson,
                UpdatedAtUtc = now
            };
            _dbContext.SiteContent.Add(entry);
        }
        else
        {
            entry.JsonContent = rawJson;
            entry.UpdatedAtUtc = now;
            _dbContext.SiteContent.Update(entry);
        }

        await _dbContext.SaveChangesAsync();

        return Ok(new
        {
            websiteCode = entry.WebsiteCode,
            id = entry.Id,
            updatedAtUtc = entry.UpdatedAtUtc,
            siteContent = payload
        });
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
