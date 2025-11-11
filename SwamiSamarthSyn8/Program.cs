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
// Add services to the container
// ----------------------------
builder.Services.AddControllers();

// Add DbContext for Azure SQL
builder.Services.AddDbContext<SwamiSamarthDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DBConnection")));

// CORS policy for React frontend
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

// Distributed memory cache (required for session)
builder.Services.AddDistributedMemoryCache();

// Session configuration
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// HttpContextAccessor and HttpClient
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

// Map controllers
app.MapControllers();
app.MapDefaultControllerRoute();

// ----------------------------
// Logging after build ✅
// ----------------------------
var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("✅ Application startup: API is running on Azure environment.");

// ----------------------------
// Run application with error handling
// ----------------------------
try
{
    app.Run();
}
catch (Exception ex)
{
    var loggerFactory = LoggerFactory.Create(logging => logging.AddConsole());
    var log = loggerFactory.CreateLogger<Program>();
    log.LogError(ex, "❌ Application failed to start");
    throw;
}
