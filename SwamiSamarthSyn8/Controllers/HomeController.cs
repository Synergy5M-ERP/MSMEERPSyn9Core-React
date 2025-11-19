using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace SwamiSamarthSyn8.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            _logger.LogInformation("HomeController Index called at {time}", DateTime.UtcNow);
            return Content("Welcome to SwamiSamarthSyn8 — the app is running successfully!");
        }
    }
}
