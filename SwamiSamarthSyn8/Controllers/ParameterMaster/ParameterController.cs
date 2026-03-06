using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models;

namespace SwamiSamarthSyn8.Controllers.ParameterMaster
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParameterController : ControllerBase
    {
        // 🔹 Main Database
        private readonly SwamiSamarthDbContext _swamiContext;

        // 🔹 Second Database
        private readonly MsmeERPDbContext _msmeContext;

        private readonly ILogger<ParameterController> _logger;

        public ParameterController(
            SwamiSamarthDbContext swamiContext,
            MsmeERPDbContext msmeContext,
            ILogger<ParameterController> logger)
        {
            _swamiContext = swamiContext;
            _msmeContext = msmeContext;
            _logger = logger;
        }

        [HttpGet("GetUOMList")]
        public IActionResult GetUOMList()
        {
            try
            {
                var UOMList = _swamiContext.UOMTbls
                    .Select(u => new
                    {
                        uomId = u.Id,
                        uomName = u.Unit_Of_Measurement
                    })
                    .ToList();

                return Ok(UOMList);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching UOM list");
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPost("CreateParameter")]
        public IActionResult CreateParameter([FromBody] ParameterDto model)
        {
            if (model == null)
                return BadRequest("Invalid data");

            if (string.IsNullOrEmpty(model.Parameter))
                return BadRequest("Parameter is required");

            try
            {
                // UPDATE CASE
                if (model.Id > 0)
                {
                    var existing = _msmeContext.Master_Parameter
                        .FirstOrDefault(x => x.ParameterId == model.Id);

                    if (existing == null)
                        return NotFound("Record not found");

                    existing.Parameter = model.Parameter;
                    existing.UOMId = model.UOMId;
                    existing.UpdatedBy = model.UserId;
                    existing.UpdatedDate = DateTime.Now;

                    _msmeContext.SaveChanges();

                    return Ok(new { message = "Updated Successfully" });
                }

                // INSERT CASE
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

                _msmeContext.Master_Parameter.Add(param);
                _msmeContext.SaveChanges();

                return Ok(new { message = "Saved Successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving parameter");
                return StatusCode(500, ex.InnerException?.Message ?? ex.Message);
            }
        }

        [HttpGet("GetParameters")]
        public IActionResult GetParameters(bool isActive)
        {
            var data = _msmeContext.Master_Parameter
                .Where(x => x.IsActive == isActive)
                .Select(x => new
                {
                    id = x.ParameterId,
                    parameter = x.Parameter,
                    uomId = x.UOMId,
                    isActive = x.IsActive
                })
                .ToList();

            return Ok(data);
        }

        [HttpPut("UpdateParameterStatus")]
        public IActionResult UpdateParameterStatus([FromQuery] int id, [FromQuery] bool isActive)
        {
            try
            {
                var parameter = _msmeContext.Master_Parameter
                    .FirstOrDefault(x => x.ParameterId == id);

                if (parameter == null)
                {
                    return NotFound(new { message = "Parameter not found" });
                }

                parameter.IsActive = isActive;

                _msmeContext.SaveChanges();

                return Ok(new
                {
                    message = isActive
                        ? "Parameter Activated Successfully"
                        : "Parameter Inactivated Successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}