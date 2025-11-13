using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using NuGet.Protocol.Plugins;

namespace SwamiSamarthSyn8.Controllers
{
    [Route("api/[controller]")]
    public class HomeController : Controller
    {
        [HttpGet("index")]
        public IActionResult Index()
        {
            var result = new { Message = "Welcome to SwamiSamarthSyn8 -— the app is running successfully!" };
            return Ok(result);
        }
    }

}
