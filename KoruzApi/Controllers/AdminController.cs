using KoruzApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace KoruzApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private static readonly Dictionary<string, (string Email, string Password)> DefaultAdmins = new(StringComparer.OrdinalIgnoreCase)
    {
        ["akutagwa"] = ("umarhon3005@gmail.com", "5755Dazai!"),
        ["bekzod"] = ("example@gmail.com", "1111Bekzod!")
    };

    [HttpPost("login")]
    public ActionResult<object> Login([FromBody] AdminLoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { message = "Username and password are required." });
        }

        var username = request.Username.Trim();

        if (!DefaultAdmins.TryGetValue(username, out var admin))
        {
            return Unauthorized(new { message = "Invalid username or password." });
        }

        var isValid = request.Password == admin.Password;

        if (!isValid)
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
                email = admin.Email
            }
        });
    }
}
