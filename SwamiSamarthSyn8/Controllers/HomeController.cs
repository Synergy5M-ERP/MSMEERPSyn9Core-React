using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using NuGet.Protocol.Plugins;

namespace SwamiSamarthSyn8.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            var result=new {Message="Welcome to SwamiSamarthSyn8 — the app is running successfully!"};
            return Ok(result);
        }
    }
}
