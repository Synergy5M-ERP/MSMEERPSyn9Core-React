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
        var countryList = await _context.Master_MergeLocation
            .Where(x => x.Country_Name != null)
            .Select(x => x.Country_Name)
            .Distinct()
            .ToListAsync();

        return Ok(countryList);
    }
    [HttpGet("GetState")]
    public IActionResult GetState(int countryId)
    {
        var states = _context.Master_State
            .Where(x => x.country_id == countryId)
            .Select(x => x.state_name)
            .ToList();

        return Ok(states);
    }

    [HttpGet("GetCity")]
    public async Task<IActionResult> GetCity(
        [FromQuery] string country,
        [FromQuery] string state)
    {
        if (string.IsNullOrEmpty(country) || string.IsNullOrEmpty(state))
            return BadRequest("Country and State are required");

        var cities = await _context.Master_MergeLocation
            .Where(x => x.Country_Name == country && x.state_name == state)
            .Select(x => x.city_name)
            .Distinct()
            .ToListAsync();

        return Ok(cities);
    }
    [HttpGet("GetCurrency")]
    public async Task<IActionResult> GetCurrency()
    {
        var currencyList = await _context.Master_Currency
            .OrderBy(x => x.CurrencyId) // optional, ensures consistent top rows
            .Take(200000)
            .Select(x => new
            {
                x.CurrencyId,
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
        var data = await _context.HRM_Designation.ToListAsync();
        return Ok(data);
    }

    [HttpGet("AuthorityMatrix")]
    public async Task<IActionResult> GetAuthorityMatrix()
    {
        var data = await _context.HRM_AuthorityMatrix.ToListAsync();
        return Ok(data);
    }
 


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
    [HttpGet("Organization")]
    public IActionResult GetOrganization([FromQuery] string status = "active")
    {
        try
        {
            var data = _context.HRM_Organization.AsQueryable();

            if (status.ToLower() == "active")
                data = data.Where(x => x.IsActive == true);
            else if (status.ToLower() == "inactive")
                data = data.Where(x => x.IsActive == false);

            var result = data.Select(x => new
            {
                x.OrganizationId,
                x.DeptId,
                x.DesignationId,
                x.Level,
                x.Qualification,
                x.Experience,
                x.IndustryId,
                x.CountryId,
                x.StateId,
                x.CityId,
                x.CurrencyId,
                MinBudget = x.MinBudget,
                MaxBudget = x.MaxBudget,
                OnBoardDate = x.OnBoardDate,
                x.IsActive
            }).ToList();

            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }


    // ================= PUT TO TOGGLE ACTIVE/INACTIVE =================
    [HttpPut("Organization/{id}")]
    public IActionResult ToggleOrganizationStatus(int id, [FromBody] dynamic payload)
    {
        var org = _context.HRM_Organization.FirstOrDefault(x => x.OrganizationId == id);
        if (org == null) return NotFound("Record not found");

        org.IsActive = payload?.isActive ?? true;
        _context.SaveChanges();

        return Ok(new { message = "Status updated" });
    }


    [HttpPost("OrgChartWithBudget")]
    public IActionResult OrgChartWithBudget(
      [FromBody] List<OrgChartWithBudgetDto> model)
    {
        if (model == null || !model.Any())
            return BadRequest("No data received");

        foreach (var job in model)
        {
            var entity = new HRM_Organization
            {
                DeptId = _context.HRM_Department
                            .Where(x => x.DeptName == job.Department)
                            .Select(x => x.DeptId)
                            .FirstOrDefault(),

                DesignationId = _context.HRM_Designation
                            .Where(x => x.DesignationName == job.Position)
                            .Select(x => x.DesignationId)
                            .FirstOrDefault(),

                IndustryId = _context.Master_Industry
                            .Where(x => x.IndustryName == job.Industry)
                            .Select(x => x.IndustryId)
                            .FirstOrDefault(),

                CountryId = _context.Master_Country
                            .Where(x => x.country_name == job.Country)
                            .Select(x => x.country_id)
                            .FirstOrDefault(),

                StateId = _context.Master_State
                            .Where(x => x.state_name == job.State)
                            .Select(x => x.state_id)
                            .FirstOrDefault(),

                CityId = _context.Master_City
                            .Where(x => x.city_name == job.City)
                            .Select(x => x.city_id)
                            .FirstOrDefault(),

                CurrencyId = _context.Master_Currency
                            .Where(x => x.Currency_Code == job.Currency)
                            .Select(x => x.CurrencyId)
                            .FirstOrDefault(),

                Level = job.Level,
                Qualification = job.Qualification,
                Experience = job.Experience,
                MinBudget = job.BudgetMin,
                MaxBudget = job.BudgetMax,
                OnBoardDate = job.OnboardDate,
                IsActive = true,
                CreatedDate = DateTime.Now,
                CreatedBy = 1
            };

            _context.HRM_Organization.Add(entity);
        }

        _context.SaveChanges();
        return Ok(new { message = "Saved successfully" });
    }

}
