using KoruzApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace KoruzApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public AdminController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpPost("login")]
    public ActionResult<object> Login([FromBody] AdminLoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Username and password are required." });
        }

        var username = request.Username.Trim();

        var adminSection = _configuration.GetSection($"Admins:{username}");
        if (!adminSection.Exists())
        {
            return Unauthorized(new { message = "Invalid username or password." });
        }

        var expectedPassword = adminSection["Password"];
        var email = adminSection["Email"] ?? string.Empty;

        if (string.IsNullOrEmpty(expectedPassword) || request.Password != expectedPassword)
        {
            return Unauthorized(new { message = "Invalid username or password." });
        }

        return Ok(new
        {
            message = "Login successful.",
            token = $"koruz-admin-token-{username}",
            user = new
            {
                username = username,
                email = email
            }
        });
    }
}
