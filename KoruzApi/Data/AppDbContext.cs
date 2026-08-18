using KoruzApi.Models;
using Microsoft.EntityFrameworkCore;

namespace KoruzApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<SiteContent> SiteContent => Set<SiteContent>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SiteContent>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.WebsiteCode).IsRequired().HasMaxLength(10);
            entity.Property(x => x.JsonContent).IsRequired();
            entity.Property(x => x.UpdatedAtUtc).IsRequired();
            entity.HasIndex(x => x.WebsiteCode).IsUnique();
        });
    }
}
