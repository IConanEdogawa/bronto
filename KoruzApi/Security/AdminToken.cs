namespace KoruzApi.Security;

public static class AdminToken
{
    public const string Prefix = "koruz-admin-token-";

    public static string? Extract(HttpRequest request)
    {
        var header = request.Headers.Authorization.FirstOrDefault();
        if (!string.IsNullOrWhiteSpace(header))
        {
            const string bearer = "Bearer ";
            if (header.StartsWith(bearer, StringComparison.OrdinalIgnoreCase))
            {
                return header[bearer.Length..].Trim();
            }

            return header.Trim();
        }

        var custom = request.Headers["X-Admin-Token"].FirstOrDefault();
        return string.IsNullOrWhiteSpace(custom) ? null : custom.Trim();
    }

    public static bool IsValid(IConfiguration configuration, string? token)
    {
        if (string.IsNullOrWhiteSpace(token) || !token.StartsWith(Prefix, StringComparison.Ordinal))
        {
            return false;
        }

        var username = token[Prefix.Length..].Trim();
        if (string.IsNullOrWhiteSpace(username))
        {
            return false;
        }

        return configuration.GetSection($"Admins:{username}").Exists();
    }
}
