using KoruzApi.Data;
using KoruzApi.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AdminUiCors", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var dbSettings = builder.Configuration.GetSection("Database").Get<AppDatabaseSettings>() ?? new AppDatabaseSettings();
var configuredDirectory = builder.Configuration["Database:DataDirectory"] ?? Environment.GetEnvironmentVariable("Database__DataDirectory");
if (!string.IsNullOrWhiteSpace(configuredDirectory))
{
    dbSettings.DataDirectory = configuredDirectory;
}

var connectionString = dbSettings.GetConnectionString();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(connectionString));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    EnsureSiteContentSchema(db);
    SeedDefaultContent(db);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();
app.UseStaticFiles();

// Uploaded images live next to SQLite data (survive republish)
var dataDirectory = dbSettings.DataDirectory;
if (string.IsNullOrWhiteSpace(dataDirectory))
{
    dataDirectory = Path.Combine(app.Environment.ContentRootPath, "data");
}
var uploadsDirectory = Path.Combine(dataDirectory, "uploads");
Directory.CreateDirectory(uploadsDirectory);
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsDirectory),
    RequestPath = "/uploads"
});

app.UseHttpsRedirection();
app.UseCors("AdminUiCors");
app.UseAuthorization();
app.MapControllers();

app.Run();

static void EnsureSiteContentSchema(AppDbContext db)
{
    var connection = db.Database.GetDbConnection();
    var wasOpen = connection.State == System.Data.ConnectionState.Open;

    if (!wasOpen)
    {
        connection.Open();
    }

    try
    {
        using var command = connection.CreateCommand();
        command.CommandText = "PRAGMA table_info('SiteContent');";

        using var reader = command.ExecuteReader();
        var hasWebsiteCodeColumn = false;

        while (reader.Read())
        {
            var columnName = reader.GetString(1);
            if (string.Equals(columnName, "WebsiteCode", StringComparison.OrdinalIgnoreCase))
            {
                hasWebsiteCodeColumn = true;
                break;
            }
        }

        if (!hasWebsiteCodeColumn)
        {
            db.Database.ExecuteSqlRaw("ALTER TABLE \"SiteContent\" ADD COLUMN \"WebsiteCode\" TEXT NOT NULL DEFAULT 'A';");
        }

        db.Database.ExecuteSqlRaw("CREATE UNIQUE INDEX IF NOT EXISTS IX_SiteContent_WebsiteCode ON \"SiteContent\"(\"WebsiteCode\");");
    }
    finally
    {
        if (!wasOpen)
        {
            connection.Close();
        }
    }
}

static void SeedDefaultContent(AppDbContext db)
{
    var defaultA = new
    {
        siteName = "KORUZ A",
        hero = new
        {
            eyebrow = "Direct Sourcing · Seoul",
            title = "Direct sourcing from South Korea",
            subtitle = "Vehicles, parts, cosmetics, and laptops sourced directly from verified Korean sellers.",
            ctaPrimary = "Request a quote",
            ctaSecondary = "View categories"
        },
        categories = new[]
        {
            new { code = "VHC", name = "Vehicles", description = "Used and new cars sourced from Korean marketplaces and auctions." },
            new { code = "PRT", name = "Auto parts", description = "OEM and aftermarket components located by VIN or part number." },
            new { code = "CSM", name = "Cosmetics", description = "K-beauty products bought directly from verified sellers." },
            new { code = "LPT", name = "Laptops", description = "Business and consumer laptops graded and tested before shipping." }
        },
        contact = new
        {
            email = "hello@example.com",
            telegram = "@your_handle",
            location = "Seongdong-gu, Seoul"
        }
    };

    var defaultB = new
    {
        siteName = "KORUZ B",
        hero = new
        {
            eyebrow = "K-Beauty · Seoul",
            title = "Cosmetics from South Korea",
            subtitle = "Premium beauty goods and wholesale cosmetics sourced from trusted Korean partners.",
            ctaPrimary = "Request a quote",
            ctaSecondary = "View categories"
        },
        categories = new[]
        {
            new { code = "CSM", name = "Cosmetics", description = "Premium K-beauty products sourced directly from Korean sellers." },
            new { code = "VHC", name = "Vehicles", description = "Vehicle procurement and inspection support from Korea." },
            new { code = "PRT", name = "Parts", description = "Spare parts and accessories matched to market demand." }
        },
        contact = new
        {
            email = "hello@koruzb.com",
            telegram = "@koruzb",
            location = "Seoul, South Korea"
        },
        images = new Dictionary<string, string>
        {
            ["Cosmetics"] = "",
            ["Vehicle"] = "",
            ["Laptop"] = ""
        }
    };

    AddOrUpdateDefaultSite(db, "A", defaultA);
    AddOrUpdateDefaultSite(db, "B", defaultB);
}

static void AddOrUpdateDefaultSite(AppDbContext db, string websiteCode, object payload)
{
    var existing = db.SiteContent.FirstOrDefault(x => x.WebsiteCode == websiteCode);
    var json = JsonSerializer.Serialize(payload);
    var now = DateTime.UtcNow;

    if (existing is not null)
    {
        return;
    }

    db.SiteContent.Add(new KoruzApi.Models.SiteContent
    {
        WebsiteCode = websiteCode,
        JsonContent = json,
        UpdatedAtUtc = now
    });

    db.SaveChanges();
}
