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
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowReact", policy =>
//    {
//        policy.WithOrigins("http://localhost:3000")
//              .AllowAnyHeader()
//              .AllowAnyMethod()
//              .AllowCredentials();
//    });
//});

// Distributed memory cache (required for session)
builder.Services.AddDistributedMemoryCache();

// Session configuration
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // Session timeout
    options.Cookie.HttpOnly = true;                 // Protect cookie
    options.Cookie.IsEssential = true;             // Required for GDPR
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

// Session middleware
app.UseSession();

// Authorization
app.UseAuthorization();

// Map controllers and default route
app.MapControllers();
app.MapDefaultControllerRoute();

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
    var logger = loggerFactory.CreateLogger<Program>();
    logger.LogError(ex, "Application failed to start");
    throw; // rethrow so Azure App Service sees the startup failure
}


//using Microsoft.EntityFrameworkCore;
//using SwamiSamarthSyn8.Data;
//using SwamiSamarthSyn8.Models;

//var builder = WebApplication.CreateBuilder(args);

//builder.Services.AddControllersWithViews();

//builder.Services.AddDbContext<SwamiSamarthDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("DBConnection")));

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowReact",
//        policy =>
//        {
//            policy.WithOrigins("http://localhost:3000")
//                  .AllowAnyHeader()
//                  .AllowAnyMethod()
//                          .AllowCredentials(); // ⚡ important

//        });
//});

//builder.Services.AddSession();
//builder.Services.AddHttpContextAccessor();
//builder.Services.AddHttpClient();

//var app = builder.Build();

//app.UseHttpsRedirection();
//app.UseStaticFiles();

//app.UseRouting();

//app.UseCors("AllowReact"); // ✅ CORS before authorization and endpoints
//app.UseSession();
//app.UseAuthorization();

//app.MapControllers();
//app.MapDefaultControllerRoute();

//app.Run();


//using Microsoft.EntityFrameworkCore;
//using SwamiSamarthSyn8.Data;
//using SwamiSamarthSyn8.Models;

//try { 
//var builder = WebApplication.CreateBuilder(args);

//// Add services to the container
//builder.Services.AddControllers();

//// Add DbContext
//builder.Services.AddDbContext<SwamiSamarthDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("DBConnection")));

//// Add CORS policy
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowReact", policy =>
//    {
//        policy.WithOrigins("http://localhost:3000") // React app
//              .AllowAnyHeader()
//              .AllowAnyMethod()
//              .AllowCredentials();
//    });
//});

//    // Add session and HttpContextAccessor if needed
//    builder.Services.AddDistributedMemoryCache();
//    builder.Services.AddSession();
//builder.Services.AddHttpContextAccessor();
//builder.Services.AddHttpClient();

//var app = builder.Build();

//// Middleware
//app.UseHttpsRedirection();
//app.UseStaticFiles();

//app.UseRouting();

//// CORS must come before Authorization and Endpoint mapping
//app.UseCors("AllowReact");

//app.UseSession();
//app.UseAuthorization();

//// Map API controllers
//app.MapControllers();
//app.MapDefaultControllerRoute();

//app.Run();
//}
//catch (Exception ex)
//{
//    Console.WriteLine("Startup exception: " + ex);
//throw;
//}