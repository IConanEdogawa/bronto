namespace KoruzApi.Database;

public class AppDatabaseSettings
{
    public string? DataDirectory { get; set; }
    public string? FileName { get; set; }

    public string GetConnectionString()
    {
        var directory = string.IsNullOrWhiteSpace(DataDirectory)
            ? Path.Combine(AppContext.BaseDirectory, "data")
            : DataDirectory;

        Directory.CreateDirectory(directory);

        var fileName = string.IsNullOrWhiteSpace(FileName) ? "koruz.db" : FileName;
        var databasePath = Path.Combine(directory, fileName);

        return $"Data Source={databasePath}";
    }
}
