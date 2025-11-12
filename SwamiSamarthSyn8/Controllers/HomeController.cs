using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace SwamiSamarthSyn8.Controllers
{
    public class HomeController : Controller
    {
        //private readonly SwamiSamarthDbContext _context;

        //public HomeController(SwamiSamarthDbContext context)
        //{
        //    _context = context;
        //}
        public IActionResult Index()
        {
             return Content("welcome...");
        }


    }
}
