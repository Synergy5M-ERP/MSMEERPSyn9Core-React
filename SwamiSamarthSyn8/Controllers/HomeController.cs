using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace SwamiSamarthSyn8.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return Content("Welcome to SwamiSamarthSyn8 — the app is running successfully!", "text/plain; charset=utf-8");
        }
    }
}
