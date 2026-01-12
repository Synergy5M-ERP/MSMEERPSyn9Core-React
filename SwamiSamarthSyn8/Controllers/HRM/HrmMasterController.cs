using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models.HRM;

[Route("api/[controller]")]
[ApiController]
public class HrmMasterController : ControllerBase
{
    private readonly SwamiSamarthDbContext _context;

    public HrmMasterController(SwamiSamarthDbContext context)
    {
        _context = context;
    }
    [HttpGet("GetCountry")]
    public async Task<IActionResult> GetCountry()
    {
        var countryList = await _context.MergeTblDatas
            .Where(x => x.Country_Name != null)
            .Select(x => x.Country_Name)
            .Distinct()
            .ToListAsync();

        return Ok(countryList);
    }
    [HttpGet("GetState")]
    public async Task<IActionResult> GetState([FromQuery] string country)
    {
        if (string.IsNullOrEmpty(country))
            return BadRequest("Country is required");

        var states = await _context.MergeTblDatas
            .Where(x => x.Country_Name == country)
            .Select(x => x.state_name)
            .Distinct()
            .ToListAsync();

        return Ok(states);
    }
    [HttpGet("GetCity")]
    public async Task<IActionResult> GetCity(
        [FromQuery] string country,
        [FromQuery] string state)
    {
        if (string.IsNullOrEmpty(country) || string.IsNullOrEmpty(state))
            return BadRequest("Country and State are required");

        var cities = await _context.MergeTblDatas
            .Where(x => x.Country_Name == country && x.state_name == state)
            .Select(x => x.city_name)
            .Distinct()
            .ToListAsync();

        return Ok(cities);
    }
    [HttpGet("GetCurrency")]
    public async Task<IActionResult> GetCurrency()
    {
        var currencyList = await _context.Currencytbl
            .OrderBy(x => x.Id) // optional, ensures consistent top rows
            .Take(200000)
            .Select(x => new
            {
                x.Id,
                x.Currency_Code
            })
            .ToListAsync();

        return Ok(currencyList);
    }

    // ------------------------------------
    // GET ALL
    // ------------------------------------
    [HttpGet("Department")]
    public async Task<IActionResult> GetDepartment()
    {
        var data = await _context.HRM_Department.ToListAsync();
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
    //[HttpPost("{type}")]
    //public async Task<IActionResult> Create(string type, [FromBody] JObject payload)
    //{
    //    if (payload == null)
    //        return BadRequest(new { success = false, message = "Invalid JSON payload." });

    //    try
    //    {
    //        switch (type)
    //        {
    //            // ---------------------------------------------------------
    //            //                        DEPARTMENT
    //            // ---------------------------------------------------------
    //            case "Department":
    //                {
    //                    var name = payload.GetValue("DepartmentName", StringComparison.OrdinalIgnoreCase)
    //                                      ?.ToString()?.Trim();

    //                    if (string.IsNullOrWhiteSpace(name))
    //                        return BadRequest(new { success = false, message = "Department name is required." });

    //                    if (await _context.HRM_DepartmentTbl
    //                        .AnyAsync(d => d.DepartmentName.ToLower() == name.ToLower()))
    //                        return BadRequest(new { success = false, message = "Department already exists." });

    //                    var nextCode = await GenerateNextCode(
    //                        _context.HRM_DepartmentTbl.Select(x => x.Department_code)
    //                    );

    //                    var dept = new HRM_DepartmentTbl
    //                    {
    //                        DepartmentName = name,
    //                        Department_code = nextCode,
    //                        IsActive = payload.GetValue("isActive", StringComparison.OrdinalIgnoreCase)
    //                                          ?.ToObject<bool?>() ?? true
    //                    };

    //                    _context.HRM_DepartmentTbl.Add(dept);

    //                    try
    //                    {
    //                        await _context.SaveChangesAsync();
    //                    }
    //                    catch (Exception ex)
    //                    {
    //                        return StatusCode(500, new { success = false, message = "DB Save Error: " + ex.Message });
    //                    }

    //                    return Ok(new
    //                    {
    //                        success = true,
    //                        data = new
    //                        {
    //                            dept.Id,
    //                            dept.DepartmentName,
    //                            dept.Department_code,
    //                            dept.IsActive
    //                        },
    //                        message = "Department added successfully!"
    //                    });
    //                }


    //            // ---------------------------------------------------------
    //            //                        DESIGNATION
    //            // ---------------------------------------------------------
    //            case "Designation":
    //                {
    //                    var name = payload.GetValue("DesignationName", StringComparison.OrdinalIgnoreCase)
    //                                      ?.ToString()?.Trim();

    //                    if (string.IsNullOrWhiteSpace(name))
    //                        return BadRequest(new { success = false, message = "Designation name is required." });

    //                    if (await _context.HRM_DesignationTbl
    //                        .AnyAsync(d => d.DesignationName.ToLower() == name.ToLower()))
    //                        return BadRequest(new { success = false, message = "Designation already exists." });

    //                    var nextCode = await GenerateNextCode(
    //                        _context.HRM_DesignationTbl.Select(x => x.Designation_code)
    //                    );

    //                    var desig = new HRM_DesignationTbl
    //                    {
    //                        DesignationName = name,
    //                        Designation_code = nextCode,
    //                        IsActive = payload.GetValue("isActive", StringComparison.OrdinalIgnoreCase)
    //                                          ?.ToObject<bool?>() ?? true
    //                    };

    //                    _context.HRM_DesignationTbl.Add(desig);

    //                    try
    //                    {
    //                        await _context.SaveChangesAsync();
    //                    }
    //                    catch (Exception ex)
    //                    {
    //                        return StatusCode(500, new { success = false, message = "DB Save Error: " + ex.Message });
    //                    }

    //                    return Ok(new
    //                    {
    //                        success = true,
    //                        data = new
    //                        {
    //                            desig.Id,
    //                            desig.DesignationName,
    //                            desig.Designation_code,
    //                            desig.IsActive
    //                        },
    //                        message = "Designation added successfully!"
    //                    });
    //                }


    //            // ---------------------------------------------------------
    //            //                    AUTHORITY MATRIX
    //            // ---------------------------------------------------------
    //            case "AuthorityMatrix":
    //                {
    //                    var name = payload.GetValue("AuthorityName", StringComparison.OrdinalIgnoreCase)
    //                                      ?.ToString()?.Trim();

    //                    if (string.IsNullOrWhiteSpace(name))
    //                        return BadRequest(new { success = false, message = "Authority name is required." });

    //                    if (await _context.HRM_AuthorityMatrixTbl
    //                        .AnyAsync(a => a.AuthorityName.ToLower() == name.ToLower()))
    //                        return BadRequest(new { success = false, message = "Authority already exists." });

    //                    var nextCode = await GenerateNextCode(
    //                        _context.HRM_AuthorityMatrixTbl.Select(x => x.Authority_code)
    //                    );

    //                    var auth = new HRM_AuthorityMatrixTbl
    //                    {
    //                        AuthorityName = name,
    //                        Authority_code = nextCode,
    //                        IsSelected = payload.GetValue("IsSelected", StringComparison.OrdinalIgnoreCase)
    //                                            ?.ToString() ?? "No",
    //                        IsActive = payload.GetValue("isActive", StringComparison.OrdinalIgnoreCase)
    //                                          ?.ToObject<bool?>() ?? true
    //                    };

    //                    _context.HRM_AuthorityMatrixTbl.Add(auth);

    //                    try
    //                    {
    //                        await _context.SaveChangesAsync();
    //                    }
    //                    catch (Exception ex)
    //                    {
    //                        return StatusCode(500, new { success = false, message = "DB Save Error: " + ex.Message });
    //                    }

    //                    return Ok(new
    //                    {
    //                        success = true,
    //                        data = new
    //                        {
    //                            auth.Id,
    //                            auth.AuthorityName,
    //                            auth.Authority_code,
    //                            auth.IsSelected,
    //                            auth.IsActive
    //                        },
    //                        message = "Authority added successfully!"
    //                    });
    //                }


    //            default:
    //                return BadRequest(new { success = false, message = "Invalid type." });
    //        }
    //    }
    //    catch (Exception ex)
    //    {
    //        return StatusCode(500, new { success = false, message = "Server error: " + ex.Message });
    //    }
    //}



    //// Helper to generate next code
    //// Helper to generate next code
    //private async Task<string> GenerateNextCode(IQueryable<string> existingCodesQuery)
    //{
    //    var existingCodes = await existingCodesQuery.ToListAsync();

    //    var numbers = existingCodes
    //        .Select(c =>
    //        {
    //            var digits = new string(c?.Where(char.IsDigit).ToArray() ?? Array.Empty<char>());
    //            return int.TryParse(digits, out var n) ? n : 0;
    //        })
    //        .Where(n => n > 0)
    //        .ToList();

    //    int next;
    //    if (!numbers.Any())
    //        next = 1;
    //    else
    //        next = numbers.Max() + 1;

    //    var nextCode = next.ToString("D2"); // 01, 02, 03...

    //    Console.WriteLine($"Generated next code: {nextCode}"); // log to console
    //    return nextCode;
    //}



    [HttpPost("{type}")]
    public async Task<IActionResult> Create(string type, [FromBody] JObject payload)
    {
        if (payload == null)
            return BadRequest("Invalid payload");

        switch (type)
        {
            // ===================== DEPARTMENT =====================
            case "Department":
                {
                    var name = payload["DeptName"]?.ToString()?.Trim();
                    if (string.IsNullOrEmpty(name))
                        return BadRequest("DeptName required");

                    if (await _context.HRM_Department.AnyAsync(x => x.DeptName.ToLower() == name.ToLower()))
                        return BadRequest("Department already exists");

                    var code = await GenerateNextCode(
                        _context.HRM_Department.Select(x => x.DeptCode)
                    );

                    var dept = new HRM_Department
                    {
                        DeptName = name,
                        DeptCode = code,
                        IsActive = payload["IsActive"]?.ToObject<bool>() ?? true,
                        CreatedDate = DateTime.Now,
                        CreatedBy = 1
                    };

                    _context.HRM_Department.Add(dept);
                    await _context.SaveChangesAsync();

                    return Ok(dept);
                }

            // ===================== DESIGNATION =====================
            case "Designation":
                {
                    var name = payload["DesignationName"]?.ToString()?.Trim();
                    if (string.IsNullOrEmpty(name))
                        return BadRequest("DesignationName required");

                    if (await _context.HRM_Designation.AnyAsync(x => x.DesignationName.ToLower() == name.ToLower()))
                        return BadRequest("Designation already exists");

                    var code = await GenerateNextCode(
                        _context.HRM_Designation.Select(x => x.DesignationCode)
                    );

                    var desig = new HRM_Designation
                    {
                        DesignationName = name,
                        DesignationCode = code,
                        IsActive = payload["IsActive"]?.ToObject<bool>() ?? true,
                        CreatedDate = DateTime.Now,
                        CreatedBy = 1
                    };

                    _context.HRM_Designation.Add(desig);
                    await _context.SaveChangesAsync();

                    return Ok(desig);
                }

            // ===================== AUTHORITY MATRIX =====================
            case "AuthorityMatrix":
                {
                    var name = payload["AuthorityMatrixName"]?.ToString()?.Trim();
                    if (string.IsNullOrEmpty(name))
                        return BadRequest("AuthorityMatrixName required");

                    if (await _context.HRM_AuthorityMatrix.AnyAsync(x => x.AuthorityMatrixName.ToLower() == name.ToLower()))
                        return BadRequest("Authority already exists");

                    var code = await GenerateNextCode(
                        _context.HRM_AuthorityMatrix.Select(x => x.AuthorityMatrixCode)
                    );

                    var auth = new HRM_AuthorityMatrix
                    {
                        AuthorityMatrixName = name,
                        AuthorityMatrixCode = code,
                        IsSelected = payload["IsSelected"]?.ToObject<bool>() ?? false,
                        IsActive = payload["IsActive"]?.ToObject<bool>() ?? true,
                        CreatedDate = DateTime.Now,
                        CreatedBy = 1
                    };

                    _context.HRM_AuthorityMatrix.Add(auth);
                    await _context.SaveChangesAsync();

                    return Ok(auth);
                }

            default:
                return BadRequest("Invalid type");
        }
    }
    private async Task<int> GenerateNextCode(IQueryable<int> codes)
    {
        var maxCode = await codes.AnyAsync()
            ? await codes.MaxAsync()
            : 0;

        return maxCode + 1;
    }





    //[HttpPut("{type}/{id}")]
    //public async Task<IActionResult> Update(string type, int id, [FromBody] object payload)
    //{
    //    if (payload == null) return BadRequest("Invalid data");

    //    JObject j;
    //    try
    //    {
    //        j = JObject.Parse(payload.ToString());
    //    }
    //    catch
    //    {
    //        return BadRequest("Invalid JSON payload");
    //    }

    //    switch (type)
    //    {
    //        case "Department":
    //            {
    //                var dept = await _context.HRM_DepartmentTbl.FindAsync(id);
    //                if (dept == null) return NotFound();

    //                // Update name if present
    //                var newName = j["DepartmentName"]?.ToString();
    //                if (!string.IsNullOrWhiteSpace(newName)) dept.DepartmentName = newName.Trim();

    //                // Update isActive if present (accept both "isActive" and "IsActive")
    //                if (j.TryGetValue("isActive", StringComparison.OrdinalIgnoreCase, out var isActiveToken))
    //                {
    //                    dept.IsActive = isActiveToken.ToObject<bool>();
    //                }

    //                await _context.SaveChangesAsync();
    //                return Ok(dept);
    //            }

    //        case "Designation":
    //            {
    //                var desig = await _context.HRM_DesignationTbl.FindAsync(id);
    //                if (desig == null) return NotFound();

    //                var newName = j["DesignationName"]?.ToString();
    //                if (!string.IsNullOrWhiteSpace(newName)) desig.DesignationName = newName.Trim();

    //                if (j.TryGetValue("isActive", StringComparison.OrdinalIgnoreCase, out var isActiveToken))
    //                {
    //                    desig.IsActive = isActiveToken.ToObject<bool>();
    //                }

    //                await _context.SaveChangesAsync();
    //                return Ok(desig);
    //            }

    //        case "AuthorityMatrix":
    //            {
    //                var auth = await _context.HRM_AuthorityMatrixTbl.FindAsync(id);
    //                if (auth == null) return NotFound();

    //                var newName = j["Authority_name"]?.ToString();
    //                if (!string.IsNullOrWhiteSpace(newName)) auth.Authority_name = newName.Trim();

    //                if (j.TryGetValue("IsSelected", StringComparison.OrdinalIgnoreCase, out var isSelectedToken))
    //                {
    //                    auth.IsSelected = isSelectedToken.ToString();
    //                }

    //                if (j.TryGetValue("isActive", StringComparison.OrdinalIgnoreCase, out var isActiveToken))
    //                {
    //                    auth.IsActive = isActiveToken.ToObject<bool>();
    //                }

    //                await _context.SaveChangesAsync();
    //                return Ok(auth);
    //            }

    //        default:
    //            return BadRequest("Invalid type");
    //    }
    //}
    [HttpPut("{type}/{id}")]
    public async Task<IActionResult> Update(string type, int id, [FromBody] JObject payload)
    {
        switch (type)
        {
            // ===================== DEPARTMENT =====================
            case "Department":
                {
                    var dept = await _context.HRM_Department.FindAsync(id);
                    if (dept == null) return NotFound();

                    if (payload["DeptName"] != null)
                        dept.DeptName = payload["DeptName"].ToString().Trim();

                    if (payload["IsActive"] != null)
                        dept.IsActive = payload["IsActive"].ToObject<bool>();

                    dept.UpdatedDate = DateTime.Now;
                    dept.UpdatedBy = 1;

                    await _context.SaveChangesAsync();
                    return Ok(dept);
                }

            // ===================== DESIGNATION =====================
            case "Designation":
                {
                    var desig = await _context.HRM_Designation.FindAsync(id);
                    if (desig == null) return NotFound();

                    if (payload["DesignationName"] != null)
                        desig.DesignationName = payload["DesignationName"].ToString().Trim();

                    if (payload["IsActive"] != null)
                        desig.IsActive = payload["IsActive"].ToObject<bool>();

                    desig.UpdatedDate = DateTime.Now;
                    desig.UpdatedBy = 1;

                    await _context.SaveChangesAsync();
                    return Ok(desig);
                }

            // ===================== AUTHORITY MATRIX =====================
            case "AuthorityMatrix":
                {
                    var auth = await _context.HRM_AuthorityMatrix.FindAsync(id);
                    if (auth == null) return NotFound();

                    if (payload["AuthorityMatrixName"] != null)
                        auth.AuthorityMatrixName = payload["AuthorityMatrixName"].ToString().Trim();

                    if (payload["IsSelected"] != null)
                        auth.IsSelected = payload["IsSelected"].ToObject<bool>();

                    if (payload["IsActive"] != null)
                        auth.IsActive = payload["IsActive"].ToObject<bool>();

                    auth.UpdatedDate = DateTime.Now;
                    auth.UpdatedBy = 1;

                    await _context.SaveChangesAsync();
                    return Ok(auth);
                }

            default:
                return BadRequest("Invalid type");
        }
    }

    //// ================= GET ALL ORGANIZATION =================
    //[HttpGet("Organization")]
    //public IActionResult GetOrganization([FromQuery] string status = "active")
    //{
    //    var data = _context.HRM_OganizationTbl.AsQueryable();

    //    if (status.ToLower() == "active")
    //        data = data.Where(x => (bool)x.IsActive);
    //    else if (status.ToLower() == "inactive")
    //        data = data.Where(x => (bool)!x.IsActive);

    //    var result = data.Select(x => new
    //    {
    //        x.Id,
    //        x.Department,
    //        x.Position,
    //        x.Level,
    //        x.Qualification,
    //        x.Experience,
    //        x.Industry,
    //        x.Country,
    //        x.State,
    //        x.City,
    //        x.Currency,
    //        BudgetMin = x.Minimum_Budget,
    //        BudgetMax = x.Maximum_Budget,
    //        OnboardDate = x.Onboard_Date.HasValue ? x.Onboard_Date.Value.ToString("yyyy-MM-dd") : null,
    //        x.IsActive
    //    }).ToList();

    //    return Ok(result);
    //}

    //// ================= PUT TO TOGGLE ACTIVE/INACTIVE =================
    //[HttpPut("Organization/{id}")]
    //public IActionResult ToggleOrganizationStatus(int id, [FromBody] dynamic payload)
    //{
    //    var org = _context.HRM_OganizationTbl.FirstOrDefault(x => x.Id == id);
    //    if (org == null) return NotFound("Organization record not found");

    //    bool activate = payload?.isActive ?? true;
    //    org.IsActive = activate;

    //    _context.SaveChanges();

    //    return Ok(new { message = activate ? "Activated successfully" : "Deactivated successfully" });
    //}

    //[HttpPost("OrgChartWithBudget")]
    //public IActionResult OrgChartWithBudget(
    //  [FromBody] List<OrgChartWithBudgetDto> model)
    //{
    //    if (model == null || !model.Any())
    //        return BadRequest("No data received");

    //    foreach (var job in model)
    //    {
    //        var entity = new HRM_OganizationTbl
    //        {
    //            Department = job.Department,
    //            Position = job.Position,
    //            Level = job.Level,
    //            Qualification = job.Qualification,
    //            Experience = job.Experience,
    //            Industry = job.Industry,
    //            Country = job.Country,
    //            State = job.State,
    //            City = job.City,
    //            Currency = job.Currency,
    //            Minimum_Budget = job.BudgetMin,
    //            Maximum_Budget = job.BudgetMax,
    //            Onboard_Date = job.OnboardDate.HasValue
    //? DateOnly.FromDateTime(job.OnboardDate.Value)
    //: null,
    //            Status = "Vacant",
    //            // CreatedDate = DateTime.Now
    //            IsActive = true
    //        };

    //        _context.HRM_OganizationTbl.Add(entity);
    //    }

    //    _context.SaveChanges();

    //    return Ok(new { message = "Saved successfully" });
    //}

}
