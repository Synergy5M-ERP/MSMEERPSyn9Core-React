using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models;
using System.Globalization;


namespace SwamiSamarthSyn8.Controllers.ParameterMaster
{
    [Route("api/")]
    [ApiController]
    public class ParameterController : Controller
    {
        private readonly SwamiSamarthDbContext _context;
        public ParameterController(SwamiSamarthDbContext context)
        {
            _context = context;
        }


        [HttpGet("GetUOMList")]
        public IActionResult GetUOMList()
        {
            var UOMList = _context.UOMTbls
                .Select(u => new
                {
                    uomId = u.Id,
                    uomName = u.Unit_Of_Measurement
                })
                .ToList();

            return Ok(UOMList);
        }

        [HttpPost]
        [Route("CreateParameter")]
        public IActionResult CreateParameter([FromBody] ParameterDto model)
        {
            try
            {
                if (string.IsNullOrEmpty(model.Parameter))
                {
                    return BadRequest("Parameter is required");
                }

                var param = new Master_Parameter
                {
                    Parameter = model.Parameter,
                    UOMId = model.UOMId,
                    CreatedBy = model.UserId,
                    CreatedDate = DateTime.Now,
                    UpdatedBy = model.UserId,
                    UpdatedDate = DateTime.Now,
                    IsActive = true
                };

                _context.Master_Parameter.Add(param);
                _context.SaveChanges();

                return Ok(new { message = "Saved Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
