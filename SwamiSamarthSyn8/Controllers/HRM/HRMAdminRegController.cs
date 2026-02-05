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
    private readonly MsmeERPDbContext _db;

    public HRMAdminRegAPIController(MsmeERPDbContext db)
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
    [HttpGet("Login/GetModuleUserList")]
    public async Task<IActionResult> GetModuleUserList()
    {
        var data = await (
            from emp in _db.HRM_Employee
            join usr in _db.HRM_User
                on emp.EmpCode equals usr.Emp_Code into uj
            from usr in uj.DefaultIfEmpty()
            where emp.IsActive == true
            select new
            {
                id = emp.EmployeeId,
                emp_Code = emp.EmpCode,
                name = emp.FullName,
                gender = emp.Gender,
                contact_NO = emp.ContactNo,
                email = emp.Email,
                password = usr != null ? usr.Password : "",
                permanent_address = emp.PermanentAddress,
                department = emp.DeptId
            }
        ).ToListAsync();

        return Ok(data);
    }

    [HttpGet("Login/ModuleUserData")]
    public async Task<IActionResult> ModuleUserData(int Id, string empcode)
    {
        try
        {
            var data = await (
                from emp in _db.HRM_Employee
                join usr in _db.HRM_User
                    on emp.EmpCode equals usr.Emp_Code into uj
                from usr in uj.DefaultIfEmpty()   // ✅ LEFT JOIN
                where emp.EmployeeId == Id
                   && emp.EmpCode == empcode
                select new
                {
                    username = usr != null ? usr.UserName : null,
                    password = usr != null ? usr.Password : null,

                    Name = emp.FullName,
                    Surname = "",

                    Gender = emp.Gender,
                    Contact_NO = emp.ContactNo,
                    Email = emp.Email,
                    permanent_Address = emp.PermanentAddress,

                    Department = emp.DeptId,
                    Joining_Designation = emp.DesignationId,
                    Joining_AuthorityLevel = emp.AuthorityMatrixId,

                    Date_Of_Joing = emp.CreatedDate,
                    Emp_Code = emp.EmpCode
                }
            ).FirstOrDefaultAsync();

            if (data == null)
                return Ok(new { success = false, message = "No data found" });

            return Ok(new { success = true, data });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }


    // ===============================================
    // 🔹 GET USER DETAILS (EMP INFO + LOGIN INFO)
    // ===============================================
    [HttpGet("GetUserDetails")]
    public async Task<IActionResult> GetUserDetails(int id, string empcode)
    {
        if (string.IsNullOrWhiteSpace(empcode))
            return BadRequest(new { success = false, message = "EmpCode is required" });

        var data = await (
            from emp in _db.HRM_Employee
            join usr in _db.HRM_User
                on emp.EmpCode equals usr.Emp_Code into userJoin
            from usr in userJoin.DefaultIfEmpty()
            where emp.EmployeeId == id
               && emp.EmpCode == empcode
               && emp.IsActive == true
            select new Userdetails
            {
                // Login details
                Emp_Code = usr.Emp_Code,
                username = usr.UserName,
                Password = usr.Password,

                // Employee details
                Name = emp.FullName,
            
                Contact_NO = emp.ContactNo,
                Email = emp.Email,
                Gender = emp.Gender,
                Blood_Group = emp.BloodGroup,
                permanent_Address = emp.PermanentAddress,
                BankAccountNo = emp.BankAccountNo,
                BankName = emp.BankName,

                Department = emp.DeptId.ToString(),
                Joining_Designation = emp.DesignationId.ToString(),
                Joining_AuthorityLevel = emp.AuthorityMatrixId.ToString(),

                DOB = emp.DOB,
                Date_Of_Joing = emp.CreatedDate
            }
        ).FirstOrDefaultAsync();

        if (data == null)
            return NotFound(new { success = false, message = "No data found" });

        return Ok(new { success = true, data });
    }


    [HttpGet("GetUserModules")]
    public async Task<IActionResult> GetUserModules(int id, string empCode)
    {
        if (string.IsNullOrEmpty(empCode))
            return BadRequest(new { success = false, message = "EmpCode is required" });

        var user = await _db.HRM_User
            .FirstOrDefaultAsync(x => x.Emp_Code == empCode && x.IsActive == true);

        if (user == null)
            return NotFound(new { success = false, message = "User not found" });

        var result = new
        {
            user.Emp_Code,
            user.UserName,
            user.Password,
            user.MaterialManagement,
            user.SalesAndMarketing,
            user.HRAndAdmin,
            user.AccountAndFinance,
            user.Masters,
            user.Dashboard,
            Production = user.Production,
            Quality = user.Quality,
            user.NewAssignModule
        };

        return Ok(new { success = true, user = result });
    }


    // POST: api/ModuleDashboardAPI/UpdateUserModules
    [HttpPost("UpdateUserModules")]
    public async Task<IActionResult> UpdateUserModules([FromBody] AdminBorad model)
    {
        if (model == null || string.IsNullOrEmpty(model.Emp_Code))
            return BadRequest(new { success = false, message = "Invalid data" });

        var user = await _db.HRM_User
            .FirstOrDefaultAsync(x => x.Emp_Code == model.Emp_Code);

        if (user == null)
            return NotFound(new { success = false, message = "User not found" });

        user.MaterialManagement = model.MaterialManagementModule;
        user.SalesAndMarketing = model.SalesAndMarketingModule;
        user.HRAndAdmin = model.HRAndAdminModule;
        user.AccountAndFinance = model.AccountAndFinanceModule;
        user.Masters = model.MastersModule;
        user.Dashboard = model.DashboardModule;
        user.Production = model.ProductionAndQualityModule;
        user.Quality = model.ProductionAndQualityModule;
        user.NewAssignModule = true;
        user.UpdatedDate = DateTime.Now;

        await _db.SaveChangesAsync();

        SendApprovalEmailForModule(user);

        return Ok(new { success = true, message = "Modules updated and email sent successfully!" });
    }


    private void SendApprovalEmailForModule(HRM_User user)
    {
        string subject = "Your request has been approved";
        string body = $@"
        <html><body>
        <p>Dear {user.UserName},</p>
        <p>Your registration has been accepted. Activate your account here:</p>
        <p><a href='https://synergy5m-swamisamartherp8.azurewebsites.net/Login/Login/'>Activate Account</a></p>
        <p>Username: {user.UserName}<br>Password: {user.Password}</p>
        <p>Best regards,<br>Synergy5M Team</p>
        </body></html>";

        using SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587)
        {
            EnableSsl = true,
            Credentials = new NetworkCredential("hrm@synergy5m.com", "eksv lnrw smpl dsqd")
        };

        MailMessage message = new MailMessage
        {
            From = new MailAddress("hrm@synergy5m.com", "Synergy5M"),
            Subject = subject,
            Body = body,
            IsBodyHtml = true
        };
        message.To.Add(user.UserName);

        smtp.Send(message);
    }

}


