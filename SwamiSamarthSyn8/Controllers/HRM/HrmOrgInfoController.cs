using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;   // <-- change namespace if needed
using SwamiSamarthSyn8.Models; // <-- change namespace if needed
using System.Net;
using System.Net.Mail;

namespace SwamiSamarthSyn8.Controllers.HRM
{
    [Route("api/HrmOrgInfo")]
    [ApiController]
    public class HrmOrgInfoController : ControllerBase
    {
        private readonly SwamiSamarthDbContext _context;
        private readonly IConfiguration _configuration;

        public HrmOrgInfoController(SwamiSamarthDbContext db, IConfiguration configuration)
        {
            _context = db;
        }
        [HttpPost("SaveAddEmployee")]
        public async Task<IActionResult> SaveEmployee([FromForm] Employee empDto)
        {
            if (empDto == null)
                return BadRequest("Invalid employee data");

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Generate Employee Code
                int maxId = await _context.HRM_EmpInfoTbl.MaxAsync(e => (int?)e.Id) ?? 0;
                int nextId = maxId + 1;
                string empCode = empDto.Date_Of_Joing != DateTime.MinValue
                    ? $"{empDto.Date_Of_Joing:yy}/{nextId:D5}"
                    : "N/A";

                // Map DTO to Entity
                var empInfo = new HRM_EmpInfoTbl
                {
                    Emp_Code = empCode,
                    Name = empDto.Name,
                    Surname = empDto.Surname,
                    Middle_Name = empDto.Middle_Name,
                    FullName = $"{empDto.Name} {empDto.Surname}",
                    Gender = empDto.Gender,
                    DOB = empDto.DOB.HasValue
                     ? DateOnly.FromDateTime(empDto.DOB.Value)
                     : null,
                    Blood_Group = empDto.Blood_Group,
                    Email = string.IsNullOrEmpty(empDto.Email) ? "hrm@synergy5m.com" : empDto.Email,
                    Contact_NO = empDto.Contact_NO,
                    Department = empDto.Department,
                    Joining_Designation = empDto.Position,
                    Country = empDto.SelectedCountryName,
                    State = empDto.SelectedStateName,
                    City = empDto.SelectedCityName,
                    Date_Of_Joing = empDto.Date_Of_Joing.HasValue
                    ? DateOnly.FromDateTime(empDto.Date_Of_Joing.Value)
                     : null,
                    SalaryStatus = empDto.SalaryStatus,
                    Status = "Vacant",
                    Joining_CTC_Breakup = empDto.SelectedCTC == "joining" ? "Joining CTC Breakup" : null,
                    Current_CTC_Breakup = empDto.SelectedCTC == "current" ? "Current CTC Breakup" : null
                    // Map other fields as required...
                };

                // Save Aadhaar/ PAN file to Azure
                if (empDto.AdhaarFile != null && empDto.AdhaarFile.Length > 0)
                {
                    string fileName = await UploadToAzure(empDto.AdhaarFile, empCode, "AadharPanCard");
                    empInfo.Adhaarcard_PanCard = fileName;
                }

                _context.HRM_EmpInfoTbl.Add(empInfo);

                // Update department status
                var department = await _context.HRM_OganizationTbl.FirstOrDefaultAsync(d => d.Department == empDto.Department);
                if (department != null)
                {
                    department.Status = "Filled";
                    department.Employee_Name = empInfo.FullName;
                    department.Emp_Code = empCode;
                }

                // Handle authority
                var authorityIds = new List<int>();
                var joiningAuthority = await _context.HRM_AuthorityMatrixTbl.FindAsync(empDto.JoiningAuthorityId);
                var currentAuthority = await _context.HRM_AuthorityMatrixTbl.FindAsync(empDto.CurrentAuthorityId);

                if (joiningAuthority != null)
                {
                    empInfo.Joining_AuthorityLevel = joiningAuthority.AuthorityName;
                    empInfo.AuthorityCode = joiningAuthority.Authority_code;
                    authorityIds.Add(empDto.JoiningAuthorityId);
                }

                if (currentAuthority != null)
                {
                    empInfo.Current_Authoritylevel = currentAuthority.AuthorityName;
                    empInfo.AuthorityCode = currentAuthority.Authority_code;
                    authorityIds.Add(empDto.CurrentAuthorityId);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Update User Authority and send mail
                await UpdateUserAuthority(empInfo.Email, authorityIds, empInfo.Emp_Code);
                SendMail(empInfo.Email, empInfo.Emp_Code, empInfo.FullName);

                return Ok(new { message = "Employee saved successfully", Emp_Code = empInfo.Emp_Code });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "Error saving employee: " + ex.Message);
            }
        }

        private async Task<string> UploadToAzure(IFormFile file, string empCode, string type)
        {
            string result = "";
            string connectionString = _configuration.GetValue<string>("StorageConnectionString");
            BlobServiceClient blobServiceClient = new BlobServiceClient(connectionString);
            var container = blobServiceClient.GetBlobContainerClient("digitalmarketingtool");
            await container.CreateIfNotExistsAsync();
            container.SetAccessPolicy(Azure.Storage.Blobs.Models.PublicAccessType.Blob);

            string fileName = $"{DateTime.Now:yyyyMMddHHmmss}-{type}{Path.GetExtension(file.FileName)}";
            BlobClient blobClient = container.GetBlobClient($"{empCode}/{fileName}");
            using var stream = file.OpenReadStream();
            await blobClient.UploadAsync(stream, overwrite: true);

            result = fileName;
            return result;
        }

        private async Task UpdateUserAuthority(string email, List<int> authorityIds, string empCode)
        {
            var user = await _context.HRM_UserTbl.FirstOrDefaultAsync(u => u.username == email);
            if (user == null)
            {
                user = new HRM_UserTbl
                {
                    username = email,
                    Emp_Code = empCode
                };
                _context.HRM_UserTbl.Add(user);
            }

            user.CHIEF_ADMIN = false;
            user.SUPERADMIN = false;
            user.DEPUTY_SUPERADMIN = false;
            user.ADMIN = false;
            user.DEPUTY_ADMIN = false;
            user.USER = false;

            var rolePriority = new Dictionary<int, string>
            {
                {1,"CHIEF_ADMIN"},{2,"SUPERADMIN"},{3,"DEPUTY_SUPERADMIN"},
                {4,"ADMIN"},{5,"DEPUTY_ADMIN"},{6,"USER"}
            };

            string selectedRole = authorityIds.OrderBy(id => id)
                                             .Select(id => rolePriority.ContainsKey(id) ? rolePriority[id] : null)
                                             .FirstOrDefault(r => r != null);

            switch (selectedRole)
            {
                case "CHIEF_ADMIN": user.CHIEF_ADMIN = true; break;
                case "SUPERADMIN": user.SUPERADMIN = true; break;
                case "DEPUTY_SUPERADMIN": user.DEPUTY_SUPERADMIN = true; break;
                case "ADMIN": user.ADMIN = true; break;
                case "DEPUTY_ADMIN": user.DEPUTY_ADMIN = true; break;
                case "USER": user.USER = true; break;
            }

            user.UserRole = selectedRole;
            await _context.SaveChangesAsync();
        }

        private void SendMail(string email, string empCode, string fullName)
        {
            try
            {
                SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587)
                {
                    EnableSsl = true,
                    Credentials = new System.Net.NetworkCredential("hrm@synergy5m.com", "eksv lnrw smpl dsqd")
                };

                MailMessage mail = new MailMessage
                {
                    From = new MailAddress("hrm@synergy5m.com"),
                    Subject = "Welcome to Synergy5M - Create Your Password",
                    IsBodyHtml = true
                };
                mail.To.Add(email);
                mail.CC.Add("ab@synergy5m.com");

                string link = $"https://synergy5m-swamisamartherp8.azurewebsites.net/OrgnizationMatrix/EmployeeRegistrationForm?Emp_Code={empCode}";
                mail.Body = $"<p>Mr/Mrs: <strong>{fullName}</strong></p>" +
                            $"<p>Your Employee Code is: <strong>{empCode}</strong></p>" +
                            $"<p>Click here to create password: <a href='{link}'>Create Your Password</a></p>";

                smtp.Send(mail);
            }
            catch { /* Handle email errors */ }
        }
    
    [HttpGet("GetAllEmployees")]
        public async Task<IActionResult> GetAllEmployees()
        {
            var employees = await _context.HRM_EmpInfoTbl.ToListAsync();
            return Ok(employees);
        }

        // ======================================================
        // GET: api/HrmMaster/AuthorityMatrix
        // ======================================================
        [HttpGet("EmpInfo")]
        public IActionResult GetEmployees()
        {
            var employees = _context.HRM_EmpInfoTbl
                .Where(x =>
                    !string.IsNullOrEmpty(x.Name) &&
                    !string.IsNullOrEmpty(x.Surname) &&
                    (x.Resign == null || x.Resign == 0))
                .Select(x => new
                {
                    id = x.Id,
                    name = x.Name + " " + x.Surname,
                    empCode = x.Emp_Code,
                    department = x.Department,
                    departmentCode = x.DepartmentCode,
                    designation = x.Joining_Designation,
                    designationCode = x.DesignationCode,
                    authority = x.Current_Authoritylevel,
                    authorityCode = x.AuthorityCode,
                    email = x.Email
                })
                .ToList();

            return Ok(employees);
        }

        // ======================================================
        // POST: api/HrmMaster/AuthorityMatrix
        // ======================================================
        [HttpPost("SaveEmpInfo")]
        public IActionResult CreateAuthorityMatrix([FromBody] OrgnazationRole model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var data = new HRM_OrganizationDataTbl
            {
                Emp_Code = model.Emp_Code,
                Email_Id = model.Email,
                Employee_Name = model.Employee_Name,

                Department = model.Department,
                Department_Code = model.Department_Code,

                Designation = model.Designation,
                Designation_Code = model.Designation_Code,

                Authority_Code = model.Authority_Code,
                Authority_Matrix = model.Authority_Matrix,

                Reporting_EmployeeName = model.Reporting_EmployeeName,
                Report_Email = model.Report_Email,

                RP_Department = model.RP_Department,
                RP_DepartmentCode = model.RP_DepartmentCode,
                RP_Designation = model.RP_Designation,
                RP_DesignationCode = model.RP_DesignationCode,
                RP_Authority = model.RP_Authority,
                RP_AuthorityCode = model.RP_AuthorityCode,

                Filled_Or_Vacant = "Filled",
                Position_Code = model.Position_Code,
                IsActive = true  // ✅ Add active flag

            };

            _context.HRM_OrganizationDataTbl.Add(data);
            _context.SaveChanges();

            return Ok(new { message = "Authority Matrix Created Successfully" });
        }
        // GET MATRIX LIST
        [HttpGet("MatrixList")]
        public IActionResult GetMatrixList()
        {
            var list = _context.HRM_OrganizationDataTbl
                .OrderByDescending(x => x.Id)
                .ToList();
            return Ok(list);
        }

        // UPDATE STATUS (Soft Delete)
        [HttpPut("UpdateStatus/{id}")]
        public IActionResult UpdateStatus(int id, [FromBody] bool status)
        {
            var matrix = _context.HRM_OrganizationDataTbl.FirstOrDefault(x => x.Id == id);
            if (matrix == null) return NotFound();

            matrix.IsActive = status;
            _context.SaveChanges();

            return Ok(new { message = "Status Updated Successfully" });
        }

        // EDIT MATRIX
        [HttpPut("EditMatrix/{id}")]
        public IActionResult EditMatrix(int id, [FromBody] OrgnazationRole model)
        {
            var matrix = _context.HRM_OrganizationDataTbl.FirstOrDefault(x => x.Id == id);
            if (matrix == null) return NotFound();

            matrix.Employee_Name = model.Employee_Name;
            matrix.Emp_Code = model.Emp_Code;
            matrix.Department = model.Department;
            matrix.Department_Code = model.Department_Code;
            matrix.Designation = model.Designation;
            matrix.Designation_Code = model.Designation_Code;
            matrix.Authority_Code = model.Authority_Code;
            matrix.Reporting_EmployeeName = model.Reporting_EmployeeName;
            matrix.Report_Email = model.Report_Email;
            matrix.RP_Department = model.RP_Department;
            matrix.RP_DepartmentCode = model.RP_DepartmentCode;
            matrix.RP_Designation = model.RP_Designation;
            matrix.RP_DesignationCode = model.RP_DesignationCode;
            matrix.RP_Authority = model.RP_Authority;
            matrix.RP_AuthorityCode = model.RP_AuthorityCode;
            matrix.Position_Code = model.Position_Code;

            _context.SaveChanges();
            return Ok(new { message = "Matrix Updated Successfully" });
        }
        // =========================
        // 1️⃣ GET ALL DEPARTMENTS
        // =========================
        [HttpGet("departments")]
        public async Task<IActionResult> GetDepartments()
        {
            var departments = await _context.HRM_OganizationTbl
                .Where(x => x.Department != null)
                .Select(x => new
                {
                    id = x.Department,
                    departmentName = x.Department
                })
                .Distinct()
                .ToListAsync();

            return Ok(departments);
        }
        [HttpGet("vacant-designations")]
        public async Task<IActionResult> GetVacantDesignationsByDepartment(
      [FromQuery] string department)
        {
            if (string.IsNullOrWhiteSpace(department))
                return BadRequest("Department is required");

            department = department.Trim();

            var designations = await _context.HRM_OganizationTbl
                .Where(x =>
                    x.IsActive == true &&
                    x.Department != null &&
                    x.Department.Trim() == department &&
                    x.Status == "Vacant" &&          // ✅ IMPORTANT
                    x.Position != null
                )
                .Select(x => new
                {
                    id = x.Position_Code,
                    designationName = x.Position
                })
                .Distinct()
                .ToListAsync();

            return Ok(designations);
        }



        // =========================
        // 3️⃣ GET DEPARTMENT CODE
        // =========================
        [HttpGet("department-code")]
        public async Task<IActionResult> GetDepartmentCode(
            [FromQuery] string department)
        {
            var dept = await _context.HRM_OganizationTbl
                .FirstOrDefaultAsync(x => x.Department == department);

            if (dept == null)
                return NotFound();

            return Ok(new
            {
                departmentCode = dept.Department_Code,
                status = dept.Status
            });
        }

        // =========================
        // 4️⃣ GET POSITION CODE
        // =========================
        [HttpGet("position-code")]
        public async Task<IActionResult> GetPositionCode(
            [FromQuery] string position)
        {
            var pos = await _context.HRM_OganizationTbl
                .FirstOrDefaultAsync(x => x.Position == position);

            if (pos == null)
                return NotFound();

            return Ok(new
            {
                positionCode = pos.Position_Code
            });
        }

        // =========================
        // 5️⃣ UPDATE POSITION STATUS
        // =========================
        [HttpPost("update-position-status")]
        public async Task<IActionResult> UpdatePositionStatus(
            [FromBody] string positionCode)
        {
            var pos = await _context.HRM_OganizationTbl
                .FirstOrDefaultAsync(x => x.Position_Code == positionCode);

            if (pos == null)
                return NotFound();

            pos.Status = "Filled";
            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }
        [HttpGet("GetEmployeeByEmpCode/{*empCode}")] // Catch-all route
        public async Task<IActionResult> GetEmployeeByEmpCode(string empCode)
        {
            if (string.IsNullOrWhiteSpace(empCode))
                return BadRequest("Employee code is required.");

            // Decode %2F to /
            string decodedEmpCode = WebUtility.UrlDecode(empCode).Trim();

            var emp = await _context.HRM_EmpInfoTbl
                .Where(x => x.Emp_Code.Trim().ToLower() == decodedEmpCode.ToLower())
                .Select(x => new
                {
                    id = x.Id,
                    name = x.Name,
                    middleName = x.Middle_Name,
                    surname = x.Surname,
                    fullName = x.FullName,

                    empCode = x.Emp_Code,
                    gender = x.Gender,
                    dob = x.DOB,
                    bloodGroup = x.Blood_Group,
                    email = x.Email,
                    contactNo = x.Contact_NO,
                    telephone = x.Telephone,

                    marriedStatus = x.Married_Status,
                    qualification = x.Quallification,

                    address = x.Address,
                    permanentAddress = x.permanent_Address,
                    city = x.City,
                    state = x.State,
                    country = x.Country,

                    adharNo = x.AdharNO,
                    panNo = x.PanNo,

                    bankAccountNo = x.BankAccountNo,
                    bankName = x.BankName,
                    ifscCode = x.IFSC_Code,

                    department = x.Department,
                    departmentCode = x.DepartmentCode,

                    joiningDesignation = x.Joining_Designation,
                    designationCode = x.DesignationCode,

                    dateOfJoining = x.Date_Of_Joing,
                    joiningAuthorityLevel = x.Joining_AuthorityLevel,
                    authorityCode = x.AuthorityCode,

                    noticesPeriod = x.Notices_Period,
                    relievingDate = x.Relieving_Date,

                    currentDesignation = x.Current_Designation,
                    currentAuthorityLevel = x.Current_Authoritylevel,

                    joiningCTCBreakup = x.Joining_CTC_Breakup,
                    currentCTCBreakup = x.Current_CTC_Breakup,
                    currentCTC = x.Current_CTC,

                    basicSalary = x.Basic_Salary,
                    houseRentAllowance = x.House_rent_Allownce,
                    medicalAllowance = x.Medical_Allownce,
                    leaveTravelAllowance = x.Leave_travel_Allowance,
                    additionalBenefits = x.Additional_Benefits,
                    performanceIncentive = x.Performance_Incentive,

                    pfContribution = x.PF_Conrtibution,
                    estContribution = x.EST_Conrtibution,
                    pfContri = x.PFContri,
                    esic = x.ESIC,
                    pTax = x.PTax,
                    professionalTax = x.Professional_Tax,

                    uan = x.UAN,
                    epfoAccountNo = x.EPFO_A_C_NO,
                    pfNo = x.PF_No,
                    esicNo = x.ESIC_No,

                    stockOption = x.Stock_Option,
                    car = x.car,

                    totalMonth = x.Total_Month,
                    annualCTC = x.Annual_CTC_Rs,
                    totalSalary = x.Total_Salary,
                    monthlySalary = x.Monthly_Salary,
                    monthlyGrossSalary = x.Monthly_Gross_Salary,

                    salaryPerDay = x.Salary_Per_Day,
                    salaryPerHour = x.Salary_Per_Hour,
                    dailySalary = x.Daily_Salary,
                    hourlySalary = x.Hourly_Salary,

                    averageMonthlyHours = x.Average_Monthly_Hours,
                    averageMonthlySalary = x.Average_Monthly_Salary,

                    shiftHours = x.Shift_Hours,
                    weeklyOff = x.Weekly_Off,

                    otCalculation = x.OT_calculation,
                    otDaily = x.OT_Daily,
                    otHourly = x.OT_Hourly,

                    da = x.DA,
                    totalDeduction = x.Total_Deduction,
                    grossSalaryWithOT = x.Gross_Salary_With_OT,

                    salaryIncrement = x.Salary_Increment,
                    annualIncrement = x.Annual_Increment,
                    dateOfIncrement = x.Date_Of_Increment,
                    annualIncDate = x.Annual_Inc_Date,

                    nominee = x.Nominee,
                    relation = x.Relation,

                    previousIndustryTitle = x.Previous_Industry_Title,

                    resign = x.Resign,
                    dol = x.DOL,
                    salaryStatus = x.SalaryStatus,

                    currency = x.Currency,
                    title = x.Title,


                    status = x.Status,
                    isActive = x.IsActive
                })


                .FirstOrDefaultAsync();

            if (emp == null)
                return NotFound($"Employee with code '{decodedEmpCode}' not found.");

            return Ok(emp);
        }
        [HttpPut("DeactivateEmployee/{*empCode}")]
        public async Task<IActionResult> DeactivateEmployee(string empCode)
        {
            empCode = Uri.UnescapeDataString(empCode).Trim();

            Console.WriteLine($"EmpCode received: '{empCode}'");

            var emp = await _context.HRM_EmpInfoTbl
                .FirstOrDefaultAsync(x => x.Emp_Code.Trim() == empCode);

            if (emp == null)
                return NotFound($"Employee with code '{empCode}' not found");

            emp.IsActive = false;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Employee deactivated successfully" });
        }


    }
}
