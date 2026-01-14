using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models;
using System.Net.Mail;
using System.Net;

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
        var source = await _db.Master_MergeLocation
                        .Select(i => i.src_name)
                        .Distinct()
                        .ToListAsync();

        return Ok(source);
    }

    // ----------------------------------------------------------
    // 🔹 GET CONTINENT
    // ----------------------------------------------------------
    [HttpGet("GetContinent")]
    public async Task<IActionResult> GetContinent(string source)
    {
        var continentList = await _db.Master_MergeLocation
            .Where(c => c.src_name == source)
            .Select(c => c.conti_name)
            .Distinct()
            .ToListAsync();

        return Ok(continentList);
    }

    // ----------------------------------------------------------
    // 🔹 GET COUNTRY
    // ----------------------------------------------------------
    [HttpGet("GetCountry")]
    public async Task<IActionResult> GetCountry(string source, string continent)
    {
        var countryList = await _db.Master_MergeLocation
            .Where(c => c.src_name == source && c.conti_name == continent)
            .Select(c => c.Country_Name)
            .Distinct()
            .ToListAsync();

        return Ok(countryList);
    }

    // ----------------------------------------------------------
    // 🔹 GET STATE
    // ----------------------------------------------------------
    [HttpGet("GetState")]
    public async Task<IActionResult> GetState(string source, string continent, string country)
    {
        var states = await _db.Master_MergeLocation
            .Where(c => c.src_name == source && c.conti_name == continent && c.Country_Name == country)
            .Select(c => c.state_name)
            .Distinct()
            .ToListAsync();

        return Ok(states);
    }

    // ----------------------------------------------------------
    // 🔹 GET CITY
    // ----------------------------------------------------------
    [HttpGet("GetCity")]
    public async Task<IActionResult> GetCity(string source, string continent, string country, string state)
    {
        var cities = await _db.Master_MergeLocation
            .Where(c => c.src_name == source && c.conti_name == continent && c.Country_Name == country && c.state_name == state)
            .Select(c => c.city_name)
            .Distinct()
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

    // ====================================================================================
    // 🔥 REGISTER USER (FULL LOGIC ADAPTED FROM YOUR MVC CODE)
    // ====================================================================================
    [HttpPost("Register")]
    public async Task<IActionResult> Register([FromBody] Register model)
    {
        if (model == null)
            return BadRequest(new { success = false, message = "Invalid data" });

        // Check if user already exists
        if (await _db.HRM_UserTbl.AnyAsync(x => x.username == model.email_id))
            return BadRequest(new { success = false, message = "User already registered" });

        // Load authority and designation
        var authorityData = await _db.HRM_AuthorityMatrixTbl
            .FirstOrDefaultAsync(a => a.Authority_code == model.authority);

        if (authorityData == null)
            return BadRequest(new { success = false, message = "Invalid Authority" });

        var designationData = await _db.HRM_DesignationTbl
            .FirstOrDefaultAsync(d => d.Designation_code == model.designation);

        // CREATE NEW USER
        var newUser = new HRM_UserTbl
        {
            username = model.email_id,
            password = model.Password,
            UserRole = authorityData.AuthorityName,
            Power_Of_Authority = authorityData.AuthorityName
        };

        // Enable all modules if CHIEF ADMIN
        if (model.authority == "01")
        {
            newUser.MaterialManagement = true;
            newUser.SalesAndMarketing = true;
            newUser.HRAndAdmin = true;
            newUser.AccountAndFinance = true;
            newUser.Masters = true;
            newUser.Dashboard = true;
            newUser.ProductionAndQuality = true;
            newUser.External_buyer_seller = true;
        }

        // Assign authority flags
        UpdateUserAuthority(newUser, model.authority);

        await _db.HRM_UserTbl.AddAsync(newUser);
        await _db.SaveChangesAsync();

        // SAVE REGISTRATION DETAILS
        var registration = new HRM_AdminRegTbl
        {
            CompanyName = model.company_name,
            ContactPerson = model.contact_person,
            EmailId = model.email_id,
            ContactNo = model.contact_no,
            GstNo = model.gst_no,
            Source = model.source,
            Continent = model.continent,
            Country = model.country,
            State = model.state,
            City = model.city,
            Authority = authorityData.AuthorityName,
            Designation = designationData?.DesignationName,
            UserId = newUser.id,
            IsActive = true
        };

        await _db.HRM_AdminRegTbl.AddAsync(registration);
        await _db.SaveChangesAsync();

        // UPDATE Authority IsSelected (CHIEF ADMIN)
        if (model.authority == "01")
        {
            var authorities = await _db.HRM_AuthorityMatrixTbl.ToListAsync();
            authorities.ForEach(a => a.IsSelected = "No");

            var chief = authorities.FirstOrDefault(a => a.Authority_code == "01");
            if (chief != null)
                chief.IsSelected = "Yes";

            await _db.SaveChangesAsync();
        }

        // UPDATE USER ROLE BASED ON FLAGS
        newUser.UserRole = GetUserRole(newUser);
        newUser.Power_Of_Authority = newUser.UserRole;

        await _db.SaveChangesAsync();

        // SEND EMAIL
        SendMail(model.email_id);

        return Ok(new { success = true, message = "Registered successfully!" });
    }
    private void UpdateUserAuthority(HRM_UserTbl user, string authorityCode)
    {
        user.CHIEF_ADMIN = false;
        user.SUPERADMIN = false;
        user.DEPUTY_SUPERADMIN = false;
        user.ADMIN = false;
        user.DEPUTY_ADMIN = false;
        user.USER = false;

        switch (authorityCode)
        {
            case "01": user.CHIEF_ADMIN = true; break;
            case "02": user.SUPERADMIN = true; break;
            case "03": user.DEPUTY_SUPERADMIN = true; break;
            case "04": user.ADMIN = true; break;
            case "05": user.DEPUTY_ADMIN = true; break;
            case "06": user.USER = true; break;
            default:
                throw new ArgumentOutOfRangeException($"Invalid authority code: {authorityCode}");
        }
    }

    private string GetUserRole(HRM_UserTbl user)
    {
        if (user.CHIEF_ADMIN.GetValueOrDefault()) return "CHIEF_ADMIN";
        if (user.SUPERADMIN.GetValueOrDefault()) return "SUPERADMIN";
        if (user.ADMIN.GetValueOrDefault()) return "ADMIN";
        if (user.DEPUTY_SUPERADMIN.GetValueOrDefault()) return "DEPUTY_SUPERADMIN";
        if (user.DEPUTY_ADMIN.GetValueOrDefault()) return "DEPUTY_ADMIN";
        return "USER";
    }

    private void SendMail(string email)
    {
        using var smtp = new SmtpClient("smtp.gmail.com", 587)
        {
            EnableSsl = true,
            Credentials = new NetworkCredential("hrm@synergy5m.com", "YOUR_APP_PASSWORD")
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


    // ====================================================================================
    // 🔥 UPDATE STATUS
    // ====================================================================================
    [HttpPut("UpdateStatus/{id}")]
    public async Task<IActionResult> UpdateStatus(int id, [FromQuery] bool isActive)
    {
        var admin = await _db.HRM_AdminRegTbl.FindAsync(id);

        if (admin == null)
            return NotFound(new { success = false, message = "Record not found" });

        admin.IsActive = isActive;
        await _db.SaveChangesAsync();

        return Ok(new { success = true, message = isActive ? "Activated" : "Deactivated" });
    }
    [HttpGet("Login/ModuleUserData")]
    public async Task<IActionResult> ModuleUserData()
    {
        try
        {
            var rawData = await _db.HRM_EmpInfoTbl
                .Join(
                    _db.HRM_UserTbl,
                    reg => reg.Email,
                    log => log.username,
                    (reg, log) => new { reg, log }
                )
                .Where(x => x.log.username != null)
                .ToListAsync();  // ✔ SQL DONE HERE

            // 🔥 Now use LINQ-to-Objects (safe)
            var userData = rawData
                .GroupBy(x => new { x.reg.Id, x.reg.Emp_Code, x.log.username })
                .Select(g => g.First())
                .Select(m => new UserListWIthSelectedTools
                {
                    id = m.reg.Id,
                    Name = m.reg.Name,
                    Surname = m.reg.Surname,
                    Gender = m.reg.Gender,

                    // FIXED (convert DateOnly? → DateTime?)
                    DOB = m.reg.DOB.HasValue
            ? m.reg.DOB.Value.ToDateTime(TimeOnly.MinValue)
            : (DateTime?)null,
                    Blood_Group = m.reg.Blood_Group,
                    Email = m.reg.Email,
                    Contact_NO = m.reg.Contact_NO,
                    Married_Status = m.reg.Married_Status,
                    Quallification = m.reg.Quallification,
                    Address = m.reg.Address,
                    permanent_Address = m.reg.permanent_Address,
                    Country = m.reg.Country,
                    State = m.reg.State,
                    City = m.reg.City,
                    AdharNO = m.reg.AdharNO,
                    Department = m.reg.Department,
                    Joining_Designation = m.reg.Joining_Designation,

                    Date_Of_Joing = m.reg.Date_Of_Joing.HasValue
            ? m.reg.Date_Of_Joing.Value.ToDateTime(TimeOnly.MinValue)
            : (DateTime?)null,
                    Joining_CTC_Breakup = m.reg.Joining_CTC_Breakup,
                    Joining_AuthorityLevel = m.reg.Joining_AuthorityLevel,
                    Current_Designation = m.reg.Current_Designation,
                    Emp_Code = m.reg.Emp_Code,
                    Annual_CTC_Rs_ = m.reg.Annual_CTC_Rs,

                    // Permissions
                    MaterialManagement = m.log.MaterialManagement ?? false,
                    SalesAndMarketing = m.log.SalesAndMarketing ?? false,
                    HRAndAdmin = m.log.HRAndAdmin ?? false,
                    AccountAndFinance = m.log.AccountAndFinance ?? false,
                    Masters = m.log.Masters ?? false,
                    Dashboard = m.log.Dashboard ?? false,
                    ProductionAndQuality = m.log.ProductionAndQuality ?? false,
                    External_buyer_seller = m.log.External_buyer_seller ?? false,

                    password = m.log.password,
                })
                .ToList();

            return Ok(userData);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
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

        // Get personal info
        var userdata = await _db.HRM_EmpInfoTbl
            .FirstOrDefaultAsync(x => x.Id == id && x.Emp_Code == empcode);

        // Get login credentials
        var logindetails = await _db.HRM_UserTbl
            .FirstOrDefaultAsync(x => x.Emp_Code == empcode);

        if (userdata == null && logindetails == null)
            return NotFound(new { success = false, message = "No data found" });

        // Prepare output DTO
        var result = new Userdetails
        {
            // Login Details
            Emp_Code = logindetails?.Emp_Code,
            username = logindetails?.username,
            Password = logindetails?.password,
            AdminApprove = logindetails?.AdminApprove,

            // Employee Details
            Name = userdata?.Name,
            Surname = userdata?.Surname,
            Contact_NO = userdata?.Contact_NO,
            Email = userdata?.Email,
            Gender = userdata?.Gender,
            Blood_Group = userdata?.Blood_Group,
            permanent_Address = userdata?.permanent_Address,
            BankAccountNo = userdata?.BankAccountNo,
            BankName = userdata?.BankName,
            Department = userdata?.Department,
            Joining_Designation = userdata?.Joining_Designation,
            Joining_AuthorityLevel = userdata?.Joining_AuthorityLevel,

            // Convert DateOnly? → DateTime?
            DOB = userdata?.DOB.HasValue == true
                ? userdata.DOB.Value.ToDateTime(TimeOnly.MinValue)
                : null,

            Date_Of_Joing = userdata?.Date_Of_Joing.HasValue == true
                ? userdata.Date_Of_Joing.Value.ToDateTime(TimeOnly.MinValue)
                : null
        };

        return Ok(new { success = true, data = result });
    }

    [HttpGet("GetUserModules")]
    public async Task<IActionResult> GetUserModules(int id, string empCode)
    {
        if (string.IsNullOrEmpty(empCode))
            return BadRequest(new { success = false, message = "EmpCode is required" });

        var user = await _db.HRM_UserTbl
            // optional: if you want employee info
            .FirstOrDefaultAsync(x => x.Emp_Code == empCode);

        if (user == null)
            return NotFound(new { success = false, message = "User not found" });

        var result = new
        {
            user.Emp_Code,
            user.username,
            user.password,
            user.MaterialManagement,
            user.SalesAndMarketing,
            user.HRAndAdmin,
            user.AccountAndFinance,
            user.Masters,
            user.Dashboard,
            user.ProductionAndQuality,
            user.External_buyer_seller
        };

        return Ok(new { success = true, user = result });
    }

    // POST: api/ModuleDashboardAPI/UpdateUserModules
    [HttpPost("UpdateUserModules")]
    public async Task<IActionResult> UpdateUserModules([FromBody] AdminBorad model)
    {
        if (model == null || string.IsNullOrEmpty(model.Emp_Code))
            return BadRequest(new { success = false, message = "Invalid data" });

        var user = await _db.HRM_UserTbl.FirstOrDefaultAsync(x => x.Emp_Code == model.Emp_Code);
        if (user == null)
            return NotFound(new { success = false, message = "User not found" });

        // Update modules
        user.MaterialManagement = model.MaterialManagementModule;
        user.SalesAndMarketing = model.SalesAndMarketingModule;
        user.HRAndAdmin = model.HRAndAdminModule;
        user.AccountAndFinance = model.AccountAndFinanceModule;
        user.Masters = model.MastersModule;
        user.Dashboard = model.DashboardModule;
        user.ProductionAndQuality = model.ProductionAndQualityModule;
        user.External_buyer_seller = model.External_buyer_seller;

        await _db.SaveChangesAsync();

        // Send email notification
        SendApprovalEmailForModule(user);

        return Ok(new { success = true, message = "Modules updated and email sent successfully!" });
    }

    private void SendApprovalEmailForModule(HRM_UserTbl user)
    {
        string subject = "Your request has been approved";
        string body = $@"
        <html><body>
        <p>Dear {user.username},</p>
        <p>Your registration has been accepted. Activate your account here:</p>
        <p><a href='https://synergy5m-swamisamartherp8.azurewebsites.net/Login/Login/'>Activate Account</a></p>
        <p>Username: {user.username}<br>Password: {user.password}</p>
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
        message.To.Add(user.username);

        smtp.Send(message);
    }
}


