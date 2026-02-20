using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models;
using System.Net.Mail;
using System.Net;
using SwamiSamarthSyn8.Models.HRM;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[Route("api/[controller]")]
[ApiController]
public class HRMAdminRegAPIController : ControllerBase
{
    private readonly MsmeERPDbContext _db;
    private readonly IConfiguration _config;

    public HRMAdminRegAPIController(MsmeERPDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
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

            join dept in _db.HRM_Department
                on emp.DeptId equals dept.DeptId into dj
            from dept in dj.DefaultIfEmpty()
            join country in _db.Master_Country
     on emp.CountryId equals country.country_id.ToString() into cj
            from country in cj.DefaultIfEmpty()


            join state in _db.Master_State
                on emp.StateId equals state.state_id.ToString() into sj
            from state in sj.DefaultIfEmpty()

            join city in _db.Master_City
                on emp.CityId equals city.city_id.ToString() into cityj
            from city in cityj.DefaultIfEmpty()

            where emp.IsActive == true

            select new
            {
                id = emp.EmployeeId,
                emp_Code = emp.EmpCode,
                username = usr != null ? usr.UserName : "",
                name = emp.FullName,
                gender = emp.Gender,
                contact_NO = emp.ContactNo,
                email = emp.Email,
                password = usr != null ? usr.Password : "",
                permanent_address = emp.PermanentAddress,
                country = country != null ? country.country_name : "",
                state = state != null ? state.state_name : "",
                city = city != null ? city.city_name : "",
                joiningdate = emp.CreatedDate,
                department = dept != null ? dept.DeptName : ""
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
            user.UserRole,
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
        //user.NewAssignModule = model.n;
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
        <p><a href='https://msmeerp-syn9reactapp.azurewebsites.net/login'>Activate Account</a></p>
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
    [HttpGet("FetchEmployeeDetails")]
    public async Task<IActionResult> FetchEmployeeDetails(string emp_Code)
    {
        if (string.IsNullOrWhiteSpace(emp_Code))
            return BadRequest(new { success = false, message = "Emp Code is required" });

        var employee = await (
            from emp in _db.HRM_Employee

            join dept in _db.HRM_Department
                on emp.DeptId equals dept.DeptId into deptJoin
            from dept in deptJoin.DefaultIfEmpty()

            join des in _db.HRM_Designation
                on emp.DesignationId equals des.DesignationId into desJoin
            from des in desJoin.DefaultIfEmpty()

            join auth in _db.HRM_AuthorityMatrix
                on emp.AuthorityMatrixId equals auth.AuthorityMatrixId into authJoin
            from auth in authJoin.DefaultIfEmpty()

            join usr in _db.HRM_User
                on emp.EmpCode equals usr.Emp_Code into userJoin
            from usr in userJoin.DefaultIfEmpty()

            where emp.EmpCode == emp_Code && emp.IsActive == true

            select new
            {
                emp_Code = emp.EmpCode,
                name = emp.FullName,
                email = emp.Email,
                contact_NO = emp.ContactNo,
                address = emp.Address,
                permanent_Address = emp.PermanentAddress,

                // ✅ RETURN NAMES INSTEAD OF IDS
                department = dept != null ? dept.DeptName : "",
                designation = des != null ? des.DesignationName : "",
                authorityLevel = auth != null ? auth.AuthorityMatrixName : "",

                userName = usr != null ? usr.UserName : null,
                password = usr != null ? usr.Password : null
            }

        ).FirstOrDefaultAsync();

        if (employee == null)
            return NotFound(new { success = false, message = "Employee not found" });

        return Ok(new { success = true, employee });
    }

    // ================================================
    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        if (model == null || string.IsNullOrEmpty(model.username) || string.IsNullOrEmpty(model.password))
        {
            return BadRequest(new { success = false, message = "Username and Password required" });
        }

        var user = await _db.HRM_User
            .FirstOrDefaultAsync(x => x.UserName == model.username
                                   && x.IsActive == true);

        if (user == null || user.Password != model.password)
        {
            return Unauthorized(new { success = false, message = "Invalid credentials" });
        }

        var authority = await _db.HRM_AuthorityMatrix
            .FirstOrDefaultAsync(a => a.AuthorityMatrixId == user.AuthorityMatrixId);

        if (authority != null && authority.AuthorityMatrixCode == 1)
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

        var claims = new[]
        {
        new Claim(ClaimTypes.Name, user.UserName ?? ""),
        new Claim("EmpCode", user.Emp_Code ?? ""),
        new Claim(ClaimTypes.Role, user.UserRole ?? "User")
    };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"])
        );

        var creds = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(5),
            signingCredentials: creds
        );

        return Ok(new
        {
            success = true,
            token = new JwtSecurityTokenHandler().WriteToken(token),
            user = new
            {
                user.UserId,
                user.UserName,
                user.UserRole,
                user.Emp_Code,   // ✅ ADDED (Important for header display)
                user.MaterialManagement,
                user.SalesAndMarketing,
                user.HRAndAdmin,
                user.AccountAndFinance,
                user.Masters,
                user.Dashboard,
                user.Production,
                user.Quality
            }
        });
    }


   

    // ===============================
    // 2️⃣ Register Employee (Create Password)
    // ===============================
    [HttpPost("CreatePassword")]
    public async Task<IActionResult> Register([FromBody] HRM_User model)
    {
        if (model == null || string.IsNullOrEmpty(model.Password))
            return BadRequest(new { success = false, message = "Password is required" });

        var user = await _db.HRM_User
            .FirstOrDefaultAsync(e => e.Emp_Code == model.Emp_Code);

        if (user != null && !string.IsNullOrEmpty(user.Password))
        {
            return BadRequest(new
            {
                success = false,
                message = "Password already created for this employee"
            });
        }

        if (user == null)
        {
            user = new HRM_User();
            _db.HRM_User.Add(user);
        }

        user.Emp_Code = model.Emp_Code;
        user.UserName = model.UserName;
        user.Password = model.Password; // ⚠️ Hash in production
        user.CreatedDate = DateTime.Now;

        await _db.SaveChangesAsync();

        return Ok(new
        {
            success = true,
            message = "Password created successfully"
        });
    }

    // ===============================
    // ===============================
    // 3️⃣ Forgot Password
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] LoginModel model)
    {
        if (string.IsNullOrEmpty(model.username))
        {
            return BadRequest(new { success = false, message = "Username is required" });
        }

        var user = await _db.HRM_User
            .FirstOrDefaultAsync(u => u.UserName == model.username);

        if (user == null)
        {
            return NotFound(new { success = false, message = "Invalid Username" });
        }

        // 🔐 Backend automatically gets EmpCode from DB
        string empCode = user.Emp_Code;

        // Generate token
        string token = Guid.NewGuid().ToString("n");
        user.ResetToken = token;

        await _db.SaveChangesAsync();

        // Use EmpCode internally
        string resetUrl = $"https://msmeerp-syn9reactapp.azurewebsites.net/reset-password?empcode={empCode}&token={token}";

        SendPasswordResetEmail(user.UserName, resetUrl);

        return Ok(new { success = true, message = "Reset link sent successfully" });
    }

    [HttpGet("get-user-by-empcode")]
    public async Task<IActionResult> GetUserByEmpCode([FromQuery] string empcode)
    {
        var user = await _db.HRM_User
            .Where(u => u.Emp_Code == empcode)
            .Select(u => new { u.UserName })
            .FirstOrDefaultAsync();

        if (user == null)
            return NotFound();

        return Ok(user);
    }



    // ===============================
    // 4️⃣ Reset Password
    // ===============================
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetpasswordModel model)
    {
        var user = await _db.HRM_User
            .FirstOrDefaultAsync(u =>
                u.UserName == model.Userid &&
                u.ResetToken == model.ResetToken);

        if (user == null)
            return BadRequest("Invalid token");

        user.Password = model.Password;
        user.ResetToken = null;

        await _db.SaveChangesAsync();

        return Ok(new { success = true, message = "Password updated successfully" });
    }

    // ===============================
    private void SendPasswordResetEmail(string email, string link)
    {
        using (SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587))
        {
            smtp.EnableSsl = true;
            smtp.Credentials = new NetworkCredential("hrm@synergy5m.com", "eksv lnrw smpl dsqd");

            MailMessage mail = new MailMessage();
            mail.From = new MailAddress("hrm@synergy5m.com");
            mail.To.Add(email);
            mail.Subject = "Password Reset";
            mail.Body = $"Click here to reset password: {link}";
            mail.IsBodyHtml = true;

            smtp.Send(mail);
        }
    }
    [HttpPost("Logout")]
    public IActionResult Logout()
    {
        return Ok(new { success = true, message = "Logged out successfully" });
    }

}


