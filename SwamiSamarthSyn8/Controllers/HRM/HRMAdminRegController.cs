using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models;

[Route("api/[controller]")]
[ApiController]
public class HRMAdminRegAPIController : ControllerBase
{
    private readonly SwamiSamarthDbContext _db;

    public HRMAdminRegAPIController(SwamiSamarthDbContext db)
    {
        _db = db;
    }

    // ---------------------- GET CONTINENT ----------------------
    [HttpGet("GetContinent")]
    public async Task<IActionResult> GetContinent(string source)
    {
        var continentList = await _db.MergeTblDatas
            .Where(c => c.src_name == source)
            .Select(c => c.conti_name)
            .Distinct()
            .ToListAsync();

        return Ok(continentList);
    }

    // ---------------------- GET COUNTRY ----------------------
    [HttpGet("GetCountry")]
    public async Task<IActionResult> GetCountry(string source, string continent)
    {
        var countryList = await _db.MergeTblDatas
            .Where(c => c.src_name == source && c.conti_name == continent)
            .Select(c => c.Country_Name)
            .Distinct()
            .ToListAsync();

        return Ok(countryList);
    }

    // ---------------------- GET STATE ----------------------
    [HttpGet("GetState")]
    public async Task<IActionResult> GetState(string source, string continent, string country)
    {
        var states = await _db.MergeTblDatas
            .Where(c => c.src_name == source && c.conti_name == continent && c.Country_Name == country)
            .Select(c => c.state_name)
            .Distinct()
            .ToListAsync();

        return Ok(states);
    }

    // ---------------------- GET CITY ----------------------
    [HttpGet("GetCity")]
    public async Task<IActionResult> GetCity(string source, string continent, string country, string state)
    {
        var cities = await _db.MergeTblDatas
            .Where(c => c.src_name == source && c.conti_name == continent &&
                        c.Country_Name == country && c.state_name == state)
            .Select(c => c.city_name)
            .Distinct()
            .ToListAsync();

        return Ok(cities);
    }

    // ---------------------- GET ALL ----------------------
    [HttpGet("GetAll")]
    public async Task<IActionResult> GetAll()
    {
        var data = await _db.HRM_AdminRegTbl
            .OrderByDescending(x => x.id)
            .ToListAsync();

        return Ok(data);
    }

    // ---------------------- REGISTER ----------------------
    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] HRM_AdminRegTbl model)
    {
        if (model == null)
            return BadRequest(new { success = false, message = "Invalid data" });

        model.IsActive = true;

        await _db.HRM_AdminRegTbl.AddAsync(model);
        await _db.SaveChangesAsync();

        return Ok(new { success = true, message = "Registration successful" });
    }

    // ---------------------- UPDATE STATUS ----------------------
    [HttpPut("UpdateStatus/{id}")]
    public async Task<IActionResult> UpdateStatus(int id, [FromQuery] bool isActive)
    {
        var admin = await _db.HRM_AdminRegTbl.FindAsync(id);

        if (admin == null)
            return NotFound(new { success = false, message = "Record not found" });

        admin.IsActive = isActive;
        await _db.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = isActive ? "Activated" : "Deactivated"
        });
    }
}
