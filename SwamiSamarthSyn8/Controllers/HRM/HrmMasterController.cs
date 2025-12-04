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
    [HttpGet("Department")]
    public async Task<IActionResult> GetDepartment()
    {
        var data = await _context.HRM_DepartmentTbl.ToListAsync();
        return Ok(data);
    }

    [HttpGet("Designation")]
    public async Task<IActionResult> GetDesignation()
    {
        var data = await _context.HRM_DesignationTbl.ToListAsync();
        return Ok(data);
    }

    [HttpGet("AuthorityMatrix")]
    public async Task<IActionResult> GetAuthorityMatrix()
    {
        var data = await _context.HRM_AuthorityMatrixTbl.ToListAsync();
        return Ok(data);
    }
    [HttpPost("{type}")]
    public async Task<IActionResult> Create(string type, [FromBody] JObject payload)
    {
        if (payload == null)
            return BadRequest(new { success = false, message = "Invalid JSON payload." });

        try
        {
            switch (type)
            {
                // ---------------------------------------------------------
                //                        DEPARTMENT
                // ---------------------------------------------------------
                case "Department":
                    {
                        var name = payload.GetValue("DepartmentName", StringComparison.OrdinalIgnoreCase)
                                          ?.ToString()?.Trim();

                        if (string.IsNullOrWhiteSpace(name))
                            return BadRequest(new { success = false, message = "Department name is required." });

                        if (await _context.HRM_DepartmentTbl
                            .AnyAsync(d => d.DepartmentName.ToLower() == name.ToLower()))
                            return BadRequest(new { success = false, message = "Department already exists." });

                        var nextCode = await GenerateNextCode(
                            _context.HRM_DepartmentTbl.Select(x => x.Department_code)
                        );

                        var dept = new HRM_DepartmentTbl
                        {
                            DepartmentName = name,
                            Department_code = nextCode,
                            IsActive = payload.GetValue("isActive", StringComparison.OrdinalIgnoreCase)
                                              ?.ToObject<bool?>() ?? true
                        };

                        _context.HRM_DepartmentTbl.Add(dept);

                        try
                        {
                            await _context.SaveChangesAsync();
                        }
                        catch (Exception ex)
                        {
                            return StatusCode(500, new { success = false, message = "DB Save Error: " + ex.Message });
                        }

                        return Ok(new
                        {
                            success = true,
                            data = new
                            {
                                dept.Id,
                                dept.DepartmentName,
                                dept.Department_code,
                                dept.IsActive
                            },
                            message = "Department added successfully!"
                        });
                    }


                // ---------------------------------------------------------
                //                        DESIGNATION
                // ---------------------------------------------------------
                case "Designation":
                    {
                        var name = payload.GetValue("DesignationName", StringComparison.OrdinalIgnoreCase)
                                          ?.ToString()?.Trim();

                        if (string.IsNullOrWhiteSpace(name))
                            return BadRequest(new { success = false, message = "Designation name is required." });

                        if (await _context.HRM_DesignationTbl
                            .AnyAsync(d => d.DesignationName.ToLower() == name.ToLower()))
                            return BadRequest(new { success = false, message = "Designation already exists." });

                        var nextCode = await GenerateNextCode(
                            _context.HRM_DesignationTbl.Select(x => x.Designation_code)
                        );

                        var desig = new HRM_DesignationTbl
                        {
                            DesignationName = name,
                            Designation_code = nextCode,
                            IsActive = payload.GetValue("isActive", StringComparison.OrdinalIgnoreCase)
                                              ?.ToObject<bool?>() ?? true
                        };

                        _context.HRM_DesignationTbl.Add(desig);

                        try
                        {
                            await _context.SaveChangesAsync();
                        }
                        catch (Exception ex)
                        {
                            return StatusCode(500, new { success = false, message = "DB Save Error: " + ex.Message });
                        }

                        return Ok(new
                        {
                            success = true,
                            data = new
                            {
                                desig.Id,
                                desig.DesignationName,
                                desig.Designation_code,
                                desig.IsActive
                            },
                            message = "Designation added successfully!"
                        });
                    }


                // ---------------------------------------------------------
                //                    AUTHORITY MATRIX
                // ---------------------------------------------------------
                case "AuthorityMatrix":
                    {
                        var name = payload.GetValue("AuthorityName", StringComparison.OrdinalIgnoreCase)
                                          ?.ToString()?.Trim();

                        if (string.IsNullOrWhiteSpace(name))
                            return BadRequest(new { success = false, message = "Authority name is required." });

                        if (await _context.HRM_AuthorityMatrixTbl
                            .AnyAsync(a => a.AuthorityName.ToLower() == name.ToLower()))
                            return BadRequest(new { success = false, message = "Authority already exists." });

                        var nextCode = await GenerateNextCode(
                            _context.HRM_AuthorityMatrixTbl.Select(x => x.Authority_code)
                        );

                        var auth = new HRM_AuthorityMatrixTbl
                        {
                            AuthorityName = name,
                            Authority_code = nextCode,
                            IsSelected = payload.GetValue("IsSelected", StringComparison.OrdinalIgnoreCase)
                                                ?.ToString() ?? "No",
                            IsActive = payload.GetValue("isActive", StringComparison.OrdinalIgnoreCase)
                                              ?.ToObject<bool?>() ?? true
                        };

                        _context.HRM_AuthorityMatrixTbl.Add(auth);

                        try
                        {
                            await _context.SaveChangesAsync();
                        }
                        catch (Exception ex)
                        {
                            return StatusCode(500, new { success = false, message = "DB Save Error: " + ex.Message });
                        }

                        return Ok(new
                        {
                            success = true,
                            data = new
                            {
                                auth.Id,
                                auth.AuthorityName,
                                auth.Authority_code,
                                auth.IsSelected,
                                auth.IsActive
                            },
                            message = "Authority added successfully!"
                        });
                    }


                default:
                    return BadRequest(new { success = false, message = "Invalid type." });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = "Server error: " + ex.Message });
        }
    }



    // Helper to generate next code
    // Helper to generate next code
    private async Task<string> GenerateNextCode(IQueryable<string> existingCodesQuery)
    {
        var existingCodes = await existingCodesQuery.ToListAsync();

        var numbers = existingCodes
            .Select(c =>
            {
                var digits = new string(c?.Where(char.IsDigit).ToArray() ?? Array.Empty<char>());
                return int.TryParse(digits, out var n) ? n : 0;
            })
            .Where(n => n > 0)
            .ToList();

        int next;
        if (!numbers.Any())
            next = 1;
        else
            next = numbers.Max() + 1;

        var nextCode = next.ToString("D2"); // 01, 02, 03...

        Console.WriteLine($"Generated next code: {nextCode}"); // log to console
        return nextCode;
    }







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
   
}
