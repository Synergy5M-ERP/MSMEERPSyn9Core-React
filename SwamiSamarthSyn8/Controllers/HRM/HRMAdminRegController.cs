using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models;
using System.Net.Mail;
using System.Net;
using SwamiSamarthSyn8.Models.HRM;

[Route("api/[controller]")]
[ApiController]
public class HRMAdminRegAPIController : ControllerBase
{
    private readonly SwamiSamarthDbContext _db;

    public HRMAdminRegAPIController(SwamiSamarthDbContext db)
    {
        _db = db;
    }
    [HttpGet("GetIndustry")]
    public async Task<IActionResult> GetIndustry()
    {
        var industryList = await _db.Master_Industry
            .Select(i => new { i.IndustryId, i.IndustryName })
            .ToListAsync();

        return Ok(industryList);
    }

    // ----------------------------------------------------------
    // 🔹 GET SOURCE
    // ----------------------------------------------------------
    [HttpGet("GetSource")]
    public async Task<IActionResult> GetSource()
    {
        var source = await _db.Master_Source
            .Where(x => x.IsActive)
            .Select(x => new { id = x.src_id, name = x.src_name })
            .ToListAsync();

        return Ok(source);
    }

    // ----------------------------------------------------------
    // 🔹 GET CONTINENT
    // ----------------------------------------------------------
    [HttpGet("GetContinent")]
    public async Task<IActionResult> GetContinent(int sourceId)
    {
        var continentList = await _db.Master_Continent
            .Where(c => c.src_id == sourceId && c.IsActive)
            .Select(c => new { id = c.conti_id, name = c.conti_name })
            .ToListAsync();

        return Ok(continentList);
    }


    // ----------------------------------------------------------
    // 🔹 GET COUNTRY
    // ----------------------------------------------------------
    [HttpGet("GetCountry")]
    public async Task<IActionResult> GetCountry(int continentId)
    {
        var countryList = await _db.Master_Country
            .Where(c => c.conti_id == continentId && c.IsActive)
            .Select(c => new { id = c.country_id, name = c.country_name })
            .ToListAsync();

        return Ok(countryList);
    }


    // ----------------------------------------------------------
    // 🔹 GET STATE
    // ----------------------------------------------------------
    [HttpGet("GetState")]
    public async Task<IActionResult> GetState(int countryId)
    {
        var states = await _db.Master_State
            .Where(s => s.country_id == countryId && s.IsActive)
            .Select(s => new { id = s.state_id, name = s.state_name })
            .ToListAsync();

        return Ok(states);
    }


    // ----------------------------------------------------------
    // 🔹 GET CITY
    // ----------------------------------------------------------
    [HttpGet("GetCity")]
    public async Task<IActionResult> GetCity(int stateId)
    {
        var cities = await _db.Master_City
            .Where(c => c.state_id == stateId && c.IsActive)
            .Select(c => new { id = c.city_id, name = c.city_name })
            .ToListAsync();

        return Ok(cities);
    }


    // ----------------------------------------------------------
    // 🔹 GET ALL ADMIN REGISTER DATA
    // ----------------------------------------------------------
    [HttpGet("GetAll")]
    public async Task<IActionResult> GetAll()
    {
        var data = await _db.HRM_AdminRegTbl
            .OrderByDescending(x => x.id)
            .ToListAsync();

        return Ok(data);
    }


    private void SendMail(string email)
    {
        using var smtp = new SmtpClient("smtp.gmail.com", 587)
        {
            EnableSsl = true,
            Credentials = new NetworkCredential("hrm@synergy5m.com", "eksv lnrw smpl dsqd")
        };

        var message = new MailMessage
        {
            From = new MailAddress("hrm@synergy5m.com"),
            Subject = "THANKS FOR REGISTRATION",
            Body = "Thank you for registering!",
            IsBodyHtml = true
        };
        message.To.Add(email);

        smtp.Send(message);
    }

    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] Register model)
    {
        if (model == null)
            return BadRequest(new { success = false, message = "Invalid data" });

        // 🔹 Check duplicate user
        if (await _db.HRM_User.AnyAsync(x => x.UserName == model.email_id))
            return BadRequest(new { success = false, message = "User already exists" });

        // 🔹 Validate Authority
        var authority = await _db.HRM_AuthorityMatrix
            .FirstOrDefaultAsync(a => a.AuthorityMatrixId == model.authority);

        if (authority == null)
            return BadRequest(new { success = false, message = "Invalid authority" });

        // 🔹 Validate Designation
        var designation = await _db.HRM_Designation
            .FirstOrDefaultAsync(d => d.DesignationId == model.designation);

        if (designation == null)
            return BadRequest(new { success = false, message = "Invalid designation" });

        // =====================================================
        // 🔹 CREATE USER (HRM_User)
        // =====================================================
        var user = new HRM_User
        {
            UserName = model.email_id,
            Password = model.Password,
            AuthorityMatrixId = authority.AuthorityMatrixId,
            UserRole = authority.AuthorityMatrixName,
            IsActive = true,
            CreatedDate = DateTime.Now
        };

        // 🔹 Enable modules for Chief Admin
        if (authority.AuthorityMatrixCode == 1)
        {
            user.MaterialManagement = true;
            user.SalesAndMarketing = true;
            user.HRAndAdmin = true;
            user.AccountAndFinance = true;
            user.Masters = true;
            user.Dashboard = true;
            user.Production = true;
            user.Quality = true;
        }

        _db.HRM_User.Add(user);
        await _db.SaveChangesAsync();

        // =====================================================
        // 🔹 CREATE ADMIN (HRM_Admin)
        // =====================================================
        var admin = new HRM_Admin
        {
            Company_name = model.company_name,
            Contact_person = model.contact_person,
            Email_id = model.email_id,
            Contact_no = model.contact_no,
            Gst_no = model.gst_no,

            CountryId = model.CountryId,
            StateId = model.StateId,
            CityId = model.CityId,

            Designation = designation.DesignationName,
            Authority = authority.AuthorityMatrixName,

            CreatedBy = user.UserId,
            CreatedDate = DateTime.Now,
            IsActive = true
        };

        _db.HRM_Admin.Add(admin);
        await _db.SaveChangesAsync();

        // 🔹 Send email
        SendMail(model.email_id);

        return Ok(new
        {
            success = true,
            message = "Registration successful"
        });
    }

 
}


