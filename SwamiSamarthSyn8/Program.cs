using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models;

var builder = WebApplication.CreateBuilder(args);

// ----------------------------
// Configure Logging
// ----------------------------
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// ----------------------------
// Add services
// ----------------------------
builder.Services.AddControllers();

builder.Services.AddDbContext<SwamiSamarthDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DBConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "https://msmeerp-syn9reactapp.azurewebsites.net"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

builder.Services.AddDistributedMemoryCache();

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddHttpClient();

var app = builder.Build();

// ----------------------------
// Middleware pipeline
// ----------------------------
app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// CORS must come before session and authorization
app.UseCors("AllowReact");

app.UseSession();
app.UseAuthorization();

// ----------------------------
// ✅ Diagnostic routes (helpful for Azure testing)
// ----------------------------
app.MapGet("/api/ping", () =>
{
    return Results.Json(new { status = "ok", message = "Ping successful! 🚀" });
});

app.MapGet("/api/hello", () =>
{
    return Results.Json(new
    {
        success = true,
        message = "✅ API is running fine on Azure!",
        serverTime = DateTime.UtcNow
    });
});

// ----------------------------
// Map your API controllers
// ----------------------------
app.MapControllers();
app.MapDefaultControllerRoute();

// ----------------------------
// Use Azure-assigned port if running on App Service
// ----------------------------
var port = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(port) && int.TryParse(port, out var parsedPort))
{
    app.Urls.Clear();
    app.Urls.Add($"http://*:{parsedPort}");
}
else
{
    // fallback for local testing
    app.Urls.Add("http://localhost:5000");
}

// ----------------------------
// Logging + Run
// ----------------------------
try
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogInformation("✅ Application startup: API is running on Azure environment.");
    app.Run();
}
catch (Exception ex)
{
    Console.WriteLine("❌ Fatal error starting application: " + ex.Message);
    Console.WriteLine(ex);
    throw;
}
