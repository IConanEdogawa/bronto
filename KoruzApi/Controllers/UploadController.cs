using Microsoft.AspNetCore.Mvc;

namespace KoruzApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp", ".gif"
    };

    private readonly IWebHostEnvironment _env;
    private readonly IConfiguration _configuration;

    public UploadController(IWebHostEnvironment env, IConfiguration configuration)
    {
        _env = env;
        _configuration = configuration;
    }

    private string GetUploadsDirectory()
    {
        var dataDirectory = _configuration["Database:DataDirectory"]
            ?? Environment.GetEnvironmentVariable("Database__DataDirectory");

        if (string.IsNullOrWhiteSpace(dataDirectory))
        {
            dataDirectory = Path.Combine(_env.ContentRootPath, "data");
        }

        var uploads = Path.Combine(dataDirectory, "uploads");
        Directory.CreateDirectory(uploads);
        return uploads;
    }

    [HttpPost]
    [RequestSizeLimit(15_000_000)]
    public async Task<ActionResult<object>> Upload(IFormFile file)
    {
        if (file is null || file.Length == 0)
        {
            return BadRequest(new { message = "No file uploaded." });
        }

        if (file.Length > 12_000_000)
        {
            return BadRequest(new { message = "File is too large (max 12 MB)." });
        }

        var extension = Path.GetExtension(file.FileName);
        if (string.IsNullOrWhiteSpace(extension) || !AllowedExtensions.Contains(extension))
        {
            return BadRequest(new { message = "Only jpg, jpeg, png, webp, gif are allowed." });
        }

        var safeName = $"{DateTime.UtcNow:yyyyMMddHHmmssfff}-{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
        var uploadsDir = GetUploadsDirectory();
        var fullPath = Path.Combine(uploadsDir, safeName);

        await using (var stream = System.IO.File.Create(fullPath))
        {
            await file.CopyToAsync(stream);
        }

        var url = $"/uploads/{safeName}";
        return Ok(new
        {
            url,
            fileName = safeName,
            size = file.Length
        });
    }
}
