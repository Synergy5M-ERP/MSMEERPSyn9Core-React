//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Logging;
//using SwamiSamarthSyn8.Data;
//using SwamiSamarthSyn8.Models;

//var builder = WebApplication.CreateBuilder(args);

//// ----------------------------
//// Configure Logging
//// ----------------------------
//builder.Logging.ClearProviders();
//builder.Logging.AddConsole();

//// ----------------------------
//// Add services
//// ----------------------------
//builder.Services.AddControllers();

//builder.Services.AddDbContext<SwamiSamarthDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("DBConnection")));

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowReact", policy =>
//    {
//        policy.WithOrigins(
//            "http://localhost:3000",
//            "https://msmeerp-syn9reactapp.azurewebsites.net"
//        )
//        .AllowAnyHeader()
//        .AllowAnyMethod()
//        .AllowCredentials();
//    });
//});

//builder.Services.AddDistributedMemoryCache();

//builder.Services.AddSession(options =>
//{
//    options.IdleTimeout = TimeSpan.FromMinutes(30);
//    options.Cookie.HttpOnly = true;
//    options.Cookie.IsEssential = true;
//});

//builder.Services.AddHttpContextAccessor();
//builder.Services.AddHttpClient();

//var app = builder.Build();

//// ----------------------------
//// Middleware pipeline
//// ----------------------------
//app.UseHttpsRedirection();
//app.UseStaticFiles();

//app.UseRouting();

//// CORS must come before session and authorization
//app.UseCors("AllowReact");

//app.UseSession();
//app.UseAuthorization();

//// ----------------------------
//// ✅ Diagnostic routes (helpful for Azure testing)
//// ----------------------------
//app.MapGet("/api/ping", () =>
//{
//    return Results.Json(new { status = "ok", message = "Ping successful! 🚀" });
//});

//app.MapGet("/api/hello", () =>
//{
//    return Results.Json(new
//    {
//        success = true,
//        message = "✅ API is running fine on Azure!",
//        serverTime = DateTime.UtcNow
//    });
//});

//// ----------------------------
//// Map your API controllers
//// ----------------------------
//app.MapControllers();
//app.MapDefaultControllerRoute();

//// ----------------------------
//// Use Azure-assigned port if running on App Service
//// ----------------------------
//var port = Environment.GetEnvironmentVariable("PORT");
//if (!string.IsNullOrEmpty(port) && int.TryParse(port, out var parsedPort))
//{
//    app.Urls.Clear();
//    app.Urls.Add($"http://*:{parsedPort}");
//}
//else
//{
//    // fallback for local testing
//    app.Urls.Add("http://localhost:5000");
//}

//// ----------------------------
//// Logging + Run
//// ----------------------------
//try
//{
//    var logger = app.Services.GetRequiredService<ILogger<Program>>();
//    logger.LogInformation("✅ Application startup: API is running on Azure environment.");
//    app.Run();
//}
//catch (Exception ex)
//{
//    Console.WriteLine("❌ Fatal error starting application: " + ex.Message);
//    Console.WriteLine(ex);
//    throw;
//}


using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using Serilog;
using SwamiSamarthSyn8.Models;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// ----------------- Logging (Serilog) -----------------
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// ----------------- Services -----------------
builder.Services.AddControllersWithViews();

// DbContext
builder.Services.AddDbContext<SwamiSamarthDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DBConnection")));

// CORS
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

builder.Services.AddSession();
builder.Services.AddHttpContextAccessor();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Swami API",
        Version = "v1"
    });
});

var app = builder.Build();

// Log app started event
var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("Application building complete. Environment: {env}", app.Environment.EnvironmentName);

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/error");
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseCors("AllowReact");
app.UseSession();
app.UseAuthorization();

// Swagger UI
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Swami API V1");
    c.RoutePrefix = "swagger";
});
// Map MVC default route
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapControllers();

// Log when app starts
var lifetime = app.Lifetime;
lifetime.ApplicationStarted.Register(() =>
{
    logger.LogInformation("ApplicationStarted event fired at {time}", DateTime.UtcNow);
});

app.Run();