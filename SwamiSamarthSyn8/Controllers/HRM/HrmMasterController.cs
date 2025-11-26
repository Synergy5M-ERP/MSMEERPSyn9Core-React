using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models;

[Route("api/[controller]")]
[ApiController]
public class HrmMasterController : ControllerBase
{
    private readonly SwamiSamarthDbContext _context;

    public HrmMasterController(SwamiSamarthDbContext context)
    {
        _context = context;
    }

    // ------------------------------------
    // GET ALL
    // ------------------------------------
    [HttpGet("{type}")]
    public async Task<IActionResult> GetAll(string type)
    {
        try
        {
            return type switch
            {
                "Department" => Ok(await _context.HRM_DepartmentTbl.ToListAsync()),
                "Designation" => Ok(await _context.HRM_DesignationTbl.ToListAsync()),
                "AuthorityMatrix" => Ok(await _context.HRM_AuthorityMatrixTbl.ToListAsync()),
                _ => BadRequest("Invalid type")
            };
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    // ------------------------------------
    // POST (CREATE)
    // ------------------------------------
    // Accepts payload with at least the Name property for the given type:
    // Department -> { "DepartmentName": "XYZ", "isActive": true (optional) }
    // Designation -> { "DesignationName": "XYZ", "isActive": true (optional) }
    // AuthorityMatrix -> { "Authority_name": "XYZ", "IsSelected": "No" (optional), "isActive": true (optional) }
    [HttpPost("{type}")]
    public async Task<IActionResult> Create(string type, [FromBody] object payload)
    {
        if (payload == null) return BadRequest("Invalid data");

        // Parse incoming JSON as JObject so we can read partial payloads safely
        JObject j;
        try
        {
            j = JObject.Parse(payload.ToString());
        }
        catch
        {
            return BadRequest("Invalid JSON payload");
        }

        switch (type)
        {
            // ===================================================
            // DEPARTMENT CREATE
            // ===================================================
            case "Department":
                {
                    var name = j["DepartmentName"]?.ToString()?.Trim();
                    if (string.IsNullOrWhiteSpace(name))
                        return BadRequest("Department name is required.");

                    if (await _context.HRM_DepartmentTbl.AnyAsync(d => d.DepartmentName.ToLower() == name.ToLower()))
                        return BadRequest("Department already exists.");

                    var dept = new HRM_DepartmentTbl
                    {
                        DepartmentName = name,
                        Department_code = await GenerateNextCode(_context.HRM_DepartmentTbl.Select(x => x.Department_code)),
                        IsActive = j["isActive"]?.ToObject<bool?>() ?? true
                    };

                    _context.HRM_DepartmentTbl.Add(dept);
                    await _context.SaveChangesAsync();
                    return Ok(dept);
                }

            // ===================================================
            // DESIGNATION CREATE
            // ===================================================
            case "Designation":
                {
                    var name = j["DesignationName"]?.ToString()?.Trim();
                    if (string.IsNullOrWhiteSpace(name))
                        return BadRequest("Designation name is required.");

                    if (await _context.HRM_DesignationTbl.AnyAsync(d => d.DesignationName.ToLower() == name.ToLower()))
                        return BadRequest("Designation already exists.");

                    var desig = new HRM_DesignationTbl
                    {
                        DesignationName = name,
                        Designation_code = await GenerateNextCode(_context.HRM_DesignationTbl.Select(x => x.Designation_code)),
                        IsActive = j["isActive"]?.ToObject<bool?>() ?? true
                    };

                    _context.HRM_DesignationTbl.Add(desig);
                    await _context.SaveChangesAsync();
                    return Ok(desig);
                }

            // ===================================================
            // AUTHORITY MATRIX CREATE
            // ===================================================
            case "AuthorityMatrix":
                {
                    var name = j["Authority_name"]?.ToString()?.Trim();
                    if (string.IsNullOrWhiteSpace(name))
                        return BadRequest("Authority name is required.");

                    if (await _context.HRM_AuthorityMatrixTbl.AnyAsync(a => a.Authority_name.ToLower() == name.ToLower()))
                        return BadRequest("Authority already exists.");

                    var auth = new HRM_AuthorityMatrixTbl
                    {
                        Authority_name = name,
                        IsSelected = string.IsNullOrWhiteSpace(j["IsSelected"]?.ToString()) ? "No" : j["IsSelected"]!.ToString(),
                        Authority_code = await GenerateNextCode(_context.HRM_AuthorityMatrixTbl.Select(x => x.Authority_code)),
                        IsActive = j["isActive"]?.ToObject<bool?>() ?? true
                    };

                    _context.HRM_AuthorityMatrixTbl.Add(auth);
                    await _context.SaveChangesAsync();
                    return Ok(auth);
                }

            default:
                return BadRequest("Invalid type");
        }
    }

    // ------------------------------------
    // PUT (UPDATE)
    // ------------------------------------
    // Accepts partial updates:
    // - To update name: { "DepartmentName": "New" }
    // - To toggle active: { "isActive": false }
    // - Both together: { "DepartmentName": "New", "isActive": false }
    [HttpPut("{type}/{id}")]
    public async Task<IActionResult> Update(string type, int id, [FromBody] object payload)
    {
        if (payload == null) return BadRequest("Invalid data");

        JObject j;
        try
        {
            j = JObject.Parse(payload.ToString());
        }
        catch
        {
            return BadRequest("Invalid JSON payload");
        }

        switch (type)
        {
            case "Department":
                {
                    var dept = await _context.HRM_DepartmentTbl.FindAsync(id);
                    if (dept == null) return NotFound();

                    // Update name if present
                    var newName = j["DepartmentName"]?.ToString();
                    if (!string.IsNullOrWhiteSpace(newName)) dept.DepartmentName = newName.Trim();

                    // Update isActive if present (accept both "isActive" and "IsActive")
                    if (j.TryGetValue("isActive", StringComparison.OrdinalIgnoreCase, out var isActiveToken))
                    {
                        dept.IsActive = isActiveToken.ToObject<bool>();
                    }

                    await _context.SaveChangesAsync();
                    return Ok(dept);
                }

            case "Designation":
                {
                    var desig = await _context.HRM_DesignationTbl.FindAsync(id);
                    if (desig == null) return NotFound();

                    var newName = j["DesignationName"]?.ToString();
                    if (!string.IsNullOrWhiteSpace(newName)) desig.DesignationName = newName.Trim();

                    if (j.TryGetValue("isActive", StringComparison.OrdinalIgnoreCase, out var isActiveToken))
                    {
                        desig.IsActive = isActiveToken.ToObject<bool>();
                    }

                    await _context.SaveChangesAsync();
                    return Ok(desig);
                }

            case "AuthorityMatrix":
                {
                    var auth = await _context.HRM_AuthorityMatrixTbl.FindAsync(id);
                    if (auth == null) return NotFound();

                    var newName = j["Authority_name"]?.ToString();
                    if (!string.IsNullOrWhiteSpace(newName)) auth.Authority_name = newName.Trim();

                    if (j.TryGetValue("IsSelected", StringComparison.OrdinalIgnoreCase, out var isSelectedToken))
                    {
                        auth.IsSelected = isSelectedToken.ToString();
                    }

                    if (j.TryGetValue("isActive", StringComparison.OrdinalIgnoreCase, out var isActiveToken))
                    {
                        auth.IsActive = isActiveToken.ToObject<bool>();
                    }

                    await _context.SaveChangesAsync();
                    return Ok(auth);
                }

            default:
                return BadRequest("Invalid type");
        }
    }

    // ------------------------------------
    // HELPER: GENERATE NEXT CODE
    // ------------------------------------
    private async Task<string> GenerateNextCode(IQueryable<string> existingCodesQuery)
    {
        var existingCodes = await existingCodesQuery.ToListAsync();

        var numbers = existingCodes
            .Where(c => !string.IsNullOrWhiteSpace(c))
            .Select(c => int.TryParse(c, out var n) ? n : 0)
            .Where(n => n > 0)
            .OrderBy(n => n)
            .ToList();

        if (!numbers.Any())
            return "01";

        // find first missing number in sequence 1..max
        var max = numbers.Max();
        for (int i = 1; i <= max; i++)
        {
            if (!numbers.Contains(i))
                return i.ToString("D2");
        }

        // if none missing, return next after max
        return (max + 1).ToString("D2");
    }
}
