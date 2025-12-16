using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using Serilog;
using Serilog.Sinks.MSSqlServer;
using System.Collections.ObjectModel;

var builder = WebApplication.CreateBuilder(args);

// ----------------- Configure Serilog -----------------
var columnOptions = new ColumnOptions
{
    AdditionalColumns = new Collection<SqlColumn>
    {
        new SqlColumn("ThreadId", System.Data.SqlDbType.NVarChar, dataLength: 50)
    }
};

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .CreateLogger();

builder.Host.UseSerilog();
// ----------------- Services -----------------
builder.Services.AddControllersWithViews();

// ✅ Register DbContext
builder.Services.AddDbContext<SwamiSamarthDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DBConnection")));

Log.Information("DB ConnectionString = " + builder.Configuration.GetConnectionString("DBConnection"));

// ✅ CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy => policy
            .WithOrigins("http://localhost:3000", "https://msmeerp-syn9reactapp.azurewebsites.net")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

builder.Services.AddSession();
builder.Services.AddHttpContextAccessor();

// ✅ Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ----------------- Middleware -----------------
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/error");
}

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SwamiSamarthSyn8 API v1");
    c.RoutePrefix = "swagger";
});

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("AllowReact");
app.UseSession();
app.UseAuthorization();

// ----------------- Default Route -----------------
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapControllers();

// ----------------- Lifecycle Logging -----------------
app.Lifetime.ApplicationStarted.Register(() =>
{
    Log.Information("✅ Application started successfully at {time}", DateTime.UtcNow);
});
app.Lifetime.ApplicationStopping.Register(() =>
{
    Log.Warning("⚠️ Application is stopping at {time}", DateTime.UtcNow);
});
app.Lifetime.ApplicationStopped.Register(() =>
{
    Log.Information("🛑 Application stopped at {time}", DateTime.UtcNow);
});

// ----------------- Run App -----------------
try
{
    Log.Information("🚀 Starting the application...");
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "❌ Application failed to start.");
}
finally
{
    Log.CloseAndFlush();
}



//using Microsoft.EntityFrameworkCore;
//using Microsoft.OpenApi;
//using Serilog;
//using SwamiSamarthSyn8.Data;

//var builder = WebApplication.CreateBuilder(args);

//// ----------------- Logging -----------------
//Log.Logger = new LoggerConfiguration()
//    .ReadFrom.Configuration(builder.Configuration)
//    .Enrich.FromLogContext()
//    .WriteTo.Console()
//    .WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day)
//    .CreateLogger();

//builder.Host.UseSerilog();

//// ----------------- Services -----------------
//builder.Services.AddControllersWithViews();

//// DbContext
//builder.Services.AddDbContext<SwamiSamarthDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("DBConnection")));

//// ✅ Add distributed cache required for session
//builder.Services.AddDistributedMemoryCache();

//// ✅ Add session service
//builder.Services.AddSession();

//builder.Services.AddHttpContextAccessor();

////// CORS (for React frontend)
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowReactApp",
//        policy =>
//        {
//            policy.WithOrigins("https://msmeerp-syn9reactapp.azurewebsites.net") // your React app URL
//                  .AllowAnyHeader()
//                  .AllowAnyMethod();
//        });
//});

//// Swagger
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen(c =>
//{
//    c.SwaggerDoc("v1", new OpenApiInfo
//    {
//        Title = "SwamiSamarthSyn8 API",
//        Version = "v1"
//    });
//});

//var app = builder.Build();
////
//// ----------------- Middleware -----------------
//if (app.Environment.IsDevelopment())
//{
//    app.UseDeveloperExceptionPage();
//}
//else
//{
//    app.UseExceptionHandler("/error");
//}

//// ✅ Swagger enabled for all environments
//app.UseSwagger();
//app.UseSwaggerUI(c =>
//{
//    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SwamiSamarthSyn8_API_v1");
//    c.RoutePrefix = string.Empty;
//});

//app.UseHttpsRedirection();
//app.UseStaticFiles();

//app.UseRouting();
//app.UseCors("AllowReactApp");

//app.UseSession();
//app.UseAuthorization();

//// ----------------- Routes -----------------
//app.MapControllerRoute(
//    name: "default",
//    pattern: "{controller=Home}/{action=Index}/{id?}");

//app.MapControllers();


//app.Run();


//--------------------------------------------------------------------------------------------------------------------

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
//---------------------------------------------------------------------------------------------------------------------------------

//using Microsoft.EntityFrameworkCore;
//using Microsoft.OpenApi;
//using Serilog;
//using SwamiSamarthSyn8.Data;

//var builder = WebApplication.CreateBuilder(args);

//// ----------------- Logging (Serilog) -----------------
//Log.Logger = new LoggerConfiguration()
//    .ReadFrom.Configuration(builder.Configuration)
//    .Enrich.FromLogContext()
//    .WriteTo.Console()
//    .WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day)
//    .CreateLogger();

//builder.Host.UseSerilog();

//// ----------------- Services -----------------
//builder.Services.AddControllersWithViews();

//// DbContext
//builder.Services.AddDbContext<SwamiSamarthDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("DBConnection")));

//// CORS (for React frontend)
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowReact", policy =>
//    {
//        policy.WithOrigins("http://localhost:3000", // React app URL
//                    "https://msmeerp-syn9reactapp.azurewebsites.net"
//                    )
//              .AllowAnyHeader()
//              .AllowAnyMethod()
//              .AllowCredentials();
//    });
//});

//builder.Services.AddSession();
//builder.Services.AddHttpContextAccessor();

//// Swagger
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen(c =>
//{
//    c.SwaggerDoc("v1", new OpenApiInfo
//    {
//        Title = "SwamiSamarthSyn8 API",
//        Version = "v1",
//        Description = "API documentation for SwamiSamarthSyn8 system"
//    });
//});

//var app = builder.Build();

//// ----------------- Logging -----------------
//Log.Information("Application building complete. Environment: {env}", app.Environment.EnvironmentName);

//// ----------------- Middleware -----------------
//if (app.Environment.IsDevelopment())
//{
//    app.UseDeveloperExceptionPage();
//}
//else
//{
//    app.UseExceptionHandler("/error");
//}

//// Enable Swagger for all environments (so it also works in Azure)
//app.UseSwagger();
//app.UseSwaggerUI(c =>
//{
//    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SwamiSamarthSyn8 API v1");
//    c.RoutePrefix = "Swagger"; // ✅ Root Swagger UI (https://localhost:7145/)
//});

//app.UseHttpsRedirection();
//app.UseStaticFiles();

//app.UseRouting();
//app.UseCors("AllowReact");

//app.UseSession();
//app.UseAuthorization();

//// ----------------- Routes -----------------
//// ✅ Change default route to avoid Swagger conflict
//app.MapControllerRoute(
//    name: "default",
//    pattern: "{controller=Home}/{action=Index}/{id?}");

//app.MapControllers();

//// ----------------- App Lifecycle Logging -----------------
//var lifetime = app.Lifetime;
//lifetime.ApplicationStarted.Register(() =>
//{
//    Log.Information("✅ SwamiSamarthSyn8 application started successfully at {time}", DateTime.UtcNow);
//});
//lifetime.ApplicationStopping.Register(() =>
//{
//    Log.Information("⚠️ SwamiSamarthSyn8 application is stopping at {time}", DateTime.UtcNow);
//});
//lifetime.ApplicationStopped.Register(() =>
//{
//    Log.Information("🛑 SwamiSamarthSyn8 application stopped at {time}", DateTime.UtcNow);
//});

//app.Run();

//----------------------------------------------------------------------------------------------------------------
