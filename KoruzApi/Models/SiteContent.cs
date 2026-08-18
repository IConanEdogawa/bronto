namespace KoruzApi.Models;

public class SiteContent
{
    public int Id { get; set; }
    public string WebsiteCode { get; set; } = "A";
    public string JsonContent { get; set; } = "{}";
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
}
