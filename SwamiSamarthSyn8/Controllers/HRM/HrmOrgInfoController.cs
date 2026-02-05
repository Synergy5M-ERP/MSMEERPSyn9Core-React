using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;   // <-- change namespace if needed
using SwamiSamarthSyn8.Models; // <-- change namespace if needed
using SwamiSamarthSyn8.Models.HRM;
using System.Net;
using System.Net.Mail;

namespace SwamiSamarthSyn8.Controllers.HRM
{
    [Route("api/HrmOrgInfo")]
    [ApiController]
    public class HrmOrgInfoController : ControllerBase
    {
        private readonly MsmeERPDbContext _context;
        private readonly IConfiguration _configuration;

        public HrmOrgInfoController(MsmeERPDbContext db, IConfiguration configuration)
        {
            _context = db;
        }
        [HttpPost("SaveAddEmployee")]
        public async Task<IActionResult> SaveEmployee([FromForm] Employee dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // =========================
                // 🔹 GENERATE EMP CODE
                // =========================
                int maxId = await _context.HRM_Employee
                    .MaxAsync(e => (int?)e.EmployeeId) ?? 0;

                int nextId = maxId + 1;

                string yearPart = dto.JoiningDate.HasValue
                    ? dto.JoiningDate.Value.ToString("yy")
                    : DateTime.Now.ToString("yy");

                string empCode = $"{yearPart}/{nextId:D5}";

                // =========================
                // 1️⃣ HRM_Employee
                // =========================
                var employee = new HRM_Employee
                {
                    EmpCode = empCode,
                    Title = dto.Title,
                    FullName = $"{dto.FullName}",
                    Gender = dto.Gender,
                    DOB = dto.DOB,
                    BloodGroup = dto.BloodGroup,
                    Email = dto.Email,
                    ContactNo = dto.ContactNo,
                    MaritualStatus = dto.MaritualStatus,
                    Address = dto.Address,
                    PermanentAddress = dto.PermanentAddress,
                    CountryId = dto.CountryId,
                    StateId = dto.StateId,
                    CityId = dto.CityId,
                    Qualification = dto.Qualification,
                    AadharNo = dto.AadharNo,
                    PanNo = dto.PanNo,
                    BankName = dto.BankName,
                    BankAccountNo = dto.BankAccountNo,
                    IFSCCode = dto.IFSCCode,
                    Nominee = dto.Nominee,
                    Relation = dto.Relation,
                    UANNo = dto.UANNo,
                    EPFONo = dto.EPFONo,

                    PreviousExperience = dto.PreviousExperience,
                    PreviousIndustry = dto.PreviousIndustry,
                    DeptId = dto.DeptId,
                    DesignationId = dto.DesignationId,
                    AuthorityMatrixId = dto.AuthorityMatrixId,   // ✅ IMPORTANT

                    CreatedDate = DateTime.Now,
                    IsActive = true
                };

                _context.HRM_Employee.Add(employee);
                await _context.SaveChangesAsync();

                int employeeId = employee.EmployeeId;

                // =========================
                // 2️⃣ HRM_EmployerDetails
                // =========================
                var employer = new HRM_EmployerDetails
                {
                    EmployeeId = employeeId,
                    Category=dto.Category,
                    JoiningDate = dto.JoiningDate,
                    NoticePeriod = dto.NoticePeriod,
                    WeeklyOff = dto.WeeklyOff,
                    LeaveDate = dto.LeaveDate,
                    RelievingDate = dto.RelievingDate,
                    ShiftHours = dto.ShiftHours,
                    OTcalculation = dto.OTcalculation,
                    ESISNo = dto.ESISNo,
                    PFContribution = dto.PFContribution,
                    Currency = dto.Currency,
                    PFNo = dto.PFNo,
                    AuthorityLevel = dto.AuthorityLevel,
                    DesignationId=dto.DesignationId,
                    DeptId=dto.DeptId,
                    CTC = dto.CTC
                };

                // 🔹 File Uploads
                if (dto.AadharCardFile != null)
                {
                    var path = Path.Combine("Uploads", "Aadhar");
                    Directory.CreateDirectory(path);

                    var fileName = $"{Guid.NewGuid()}_{dto.AadharCardFile.FileName}";
                    var fullPath = Path.Combine(path, fileName);

                    using var stream = new FileStream(fullPath, FileMode.Create);
                    await dto.AadharCardFile.CopyToAsync(stream);

                    employer.AadharCardFile = fullPath;
                }

                if (dto.PancardNoFile != null)
                {
                    var path = Path.Combine("Uploads", "PanCard");
                    Directory.CreateDirectory(path);

                    var fileName = $"{Guid.NewGuid()}_{dto.PancardNoFile.FileName}";
                    var fullPath = Path.Combine(path, fileName);

                    using var stream = new FileStream(fullPath, FileMode.Create);
                    await dto.PancardNoFile.CopyToAsync(stream);

                    employer.PancardNoFile = fullPath;
                }

                _context.HRM_EmployerDetails.Add(employer);

                // =========================
                // 3️⃣ HRM_EmployeeSalaryDetails
                // =========================
                var salary = new HRM_EmployeeSalaryDetails
                {
                    EmployeeId = employeeId,
                    MonthlyBasicSalary = dto.MonthlyBasicSalary,
                    MonthlyGrossSalary = dto.MonthlyGrossSalary,
                    DA = dto.DA,
                    DailySalary = dto.DailySalary,
                    MonthlySalary = dto.MonthlySalary,
                    LeaveTravelAllowance = dto.LeaveTravelAllowance,
                    AdditionalBenefits = dto.AdditionalBenefits,
                    PerformanceIncentive = dto.PerformanceIncentive,
                    PFContributionAmount = dto.PFContributionAmount,
                    ESIC = dto.ESIC,
                    StockOption = dto.StockOption,
                    CarAllowance = dto.CarAllowance,
                    MedicalAllowance = dto.MedicalAllowance,
                    TotalDeduction = dto.TotalDeduction,
                    HouseRentAllowance = dto.HouseRentAllowance,
                    HourlySalary = dto.HourlySalary,
                    AnnualIncrement = dto.AnnualIncrement,
                    AnnualIncrementDate = dto.AnnualIncrementDate,
                    TotalMonth = dto.TotalMonth,
                    ProfessionalTax = dto.ProfessionalTax,
                    AnnualCTC = dto.AnnualCTC
                };

                _context.HRM_EmployeeSalaryDetails.Add(salary);
                var authority = await _context.HRM_AuthorityMatrix
    .Where(a => a.AuthorityMatrixId == dto.AuthorityMatrixId && a.IsActive)
    .Select(a => a.AuthorityMatrixName)
    .FirstOrDefaultAsync();

                if (string.IsNullOrEmpty(authority))
                {
                    throw new Exception("Invalid Authority Matrix selection");
                }

                // =========================
                // 4️⃣ HRM_User (USERNAME = EMAIL)
                // =========================
                var user = new HRM_User
                {
                    UserName = dto.Email,
                    Emp_Code = empCode,
                    UserRole = authority,   // ✅ From AuthorityMatrix
                    IsActive = true,
                    CreatedDate = DateTime.Now
                };



                _context.HRM_User.Add(user);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new
                {
                    message = "Employee & User created successfully",
                    EmployeeId = employeeId,
                    EmpCode = empCode,
                    UserName = dto.Email
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, ex.Message);
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

        private async Task UpdateUserAuthority(
          string email,
          List<int> authorityMatrixIds,
          string empCode)
        {
            // 1️⃣ Pick highest priority authority (lowest code wins)
            var authority = await _context.HRM_AuthorityMatrix
                .Where(a => authorityMatrixIds.Contains(a.AuthorityMatrixId) && a.IsActive)
                .OrderBy(a => a.AuthorityMatrixCode)
                .FirstOrDefaultAsync();

            if (authority == null)
                return;

            // 2️⃣ Get or create user
            var user = await _context.HRM_User
                .FirstOrDefaultAsync(u => u.UserName == email);

            if (user == null)
            {
                user = new HRM_User
                {
                    UserName = email,
                    Emp_Code = empCode,
                    CreatedDate = DateTime.Now,
                    IsActive = true
                };
                _context.HRM_User.Add(user);
            }

            // 3️⃣ Assign authority correctly
            user.AuthorityMatrixId = authority.AuthorityMatrixId;
            user.UserRole = authority.AuthorityMatrixName;
            user.UpdatedDate = DateTime.Now;

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
            var employees = await (
                from e in _context.HRM_Employee

                    // 🔹 Employer Details
                join ed in _context.HRM_EmployerDetails
                    on e.EmployeeId equals ed.EmployeeId into edj
                from ed in edj.DefaultIfEmpty()

                    // 🔹 Salary
                join s in _context.HRM_EmployeeSalaryDetails
                    on e.EmployeeId equals s.EmployeeId into sj
                from s in sj.DefaultIfEmpty()

                    // 🔹 Department
                join d in _context.HRM_Department
                    on e.DeptId equals d.DeptId into dj
                from d in dj.DefaultIfEmpty()

                    // 🔹 Designation
                join des in _context.HRM_Designation
                    on e.DesignationId equals des.DesignationId into desj
                from des in desj.DefaultIfEmpty()

                    // 🔹 Authority Matrix
                join a in _context.HRM_AuthorityMatrix
                    on e.AuthorityMatrixId equals a.AuthorityMatrixId into aj
                from a in aj.DefaultIfEmpty()
                    // ✅ CITY JOIN
                join c in _context.Master_City
     on e.CityId equals c.city_id.ToString() into cj
                from c in cj.DefaultIfEmpty()


                select new EmployeeListVM
                {
                    EmployeeId = e.EmployeeId,

                    EmpCode = e.EmpCode ?? "",
                    FullName = e.FullName ?? "",
                    Gender = e.Gender ?? "",
                    ContactNo = e.ContactNo ?? "",
                    DOB = e.DOB,

                    DepartmentName = d != null ? d.DeptName : "",
                    DesignationName = des != null ? des.DesignationName : "",
                    AuthorityName = a != null ? a.AuthorityMatrixName : "",

                    JoiningDate = ed != null ? ed.JoiningDate : null,
                    MonthlySalary = s != null ? s.MonthlySalary ?? 0 : 0,

                    City = e.CityId != null ? c.city_name: "",
                    IsActive = e.IsActive

                }
            ).ToListAsync();

            return Ok(employees);
        }

        // ======================================================
        // GET: api/HrmMaster/AuthorityMatrix
        // ======================================================
        [HttpGet("EmpInfo")]
        public IActionResult GetEmployees()
        {
            var employees =
                from e in _context.HRM_Employee
                join d in _context.HRM_Department on e.DeptId equals d.DeptId into dj
                from d in dj.DefaultIfEmpty()

                join des in _context.HRM_Designation on e.DesignationId equals des.DesignationId into desj
                from des in desj.DefaultIfEmpty()

                join a in _context.HRM_AuthorityMatrix on e.AuthorityMatrixId equals a.AuthorityMatrixId into aj
                from a in aj.DefaultIfEmpty()

                where e.IsActive
                select new
                {
                    employeeId = e.EmployeeId,
                    empCode = e.EmpCode,
                    fullName = e.FullName,
                    email = e.Email,

                    deptId = e.DeptId,
                    department = d.DeptName,
                    departmentCode = d.DeptCode,

                    designationId = e.DesignationId,
                    designation = des.DesignationName,
                    designationCode = des.DesignationCode,

                    authorityMatrixId = e.AuthorityMatrixId,
                    authority = a.AuthorityMatrixName,
                    authorityCode = a.AuthorityMatrixId
                };

            return Ok(employees.ToList());
        }


        // ======================================================
        // POST: api/HrmMaster/AuthorityMatrix
        [HttpPost("SaveEmpInfo")]
        public IActionResult SaveEmpAuthorityMatrix([FromBody] OrgnazationRole model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // 🔒 Validate Employee
            if (!_context.HRM_Employee.Any(x => x.EmployeeId == model.EmployeeId))
                return BadRequest("Selected employee does not exist");

            // 🔒 Validate Reporting Employee
            if (!_context.HRM_Employee.Any(x => x.EmployeeId == model.ReportingEmployeeId))
                return BadRequest("Selected reporting employee does not exist");

            try
            {
                var matrix = new HRM_EmployeeAuthorityMatrix
                {
                    AuthorityMatrixEmployeeId = model.EmployeeId,
                    ReportingEmpId = model.ReportingEmployeeId,
                    MatrixCode = model.Position_Code,
                    IsActive = true,
                    CreatedDate = DateTime.Now
                };

                _context.HRM_EmployeeAuthorityMatrix.Add(matrix);
                _context.SaveChanges();

                return Ok(new { message = "Authority Matrix Created Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
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
            //matrix.Position_Code = model.Position_Code;

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
        public async Task<IActionResult> GetVacantDesignationsByDepartment([FromQuery] int deptId)
        {
            if (deptId <= 0)
                return BadRequest("Department Id is required");

            var designations = await (
                from org in _context.HRM_Organization
                join des in _context.HRM_Designation
                    on org.DesignationId equals des.DesignationId
                where org.IsActive == true
                      && des.IsActive == true
                      && org.DeptId == deptId
                select new
                {
                    id = des.DesignationId,
                    designationName = des.DesignationName   // ✅ REAL NAME
                }
            )
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
        
        [HttpGet("GetEmployeeById/{employeeId:int}")]
        public async Task<IActionResult> GetEmployeeById(int employeeId)
        {
            if (employeeId <= 0)
                return BadRequest("Invalid EmployeeId");

            // ================= EMPLOYEE =================
            var employee = await _context.HRM_Employee
                .AsNoTracking()
                .Where(e => e.EmployeeId == employeeId)
                .Select(e => new
                {
                    e.EmployeeId,
                    e.EmpCode,
                    e.Title,
                    e.FullName,
                    e.Gender,
                    e.DOB,
                    e.BloodGroup,
                    e.Email,
                    e.ContactNo,
                    e.MaritualStatus,
                    e.Address,
                    e.PermanentAddress,
                    e.CountryId,
                    e.StateId,
                    e.CityId,
                    e.Pincode,
                    e.Qualification,
                    e.AadharNo,
                    e.PanNo,
                    e.BankName,
                    e.BankAccountNo,
                    e.IFSCCode,
                    e.BankBranchName,
                    e.Nominee,
                    e.Relation,
                    e.UANNo,
                    e.EPFONo,
                    e.PreviousExperience,
                    e.PreviousIndustry,
                    e.DeptId,
                    e.DesignationId,
                    e.AuthorityMatrixId,
                    e.IsActive
                })
                .FirstOrDefaultAsync();

            if (employee == null)
                return NotFound("Employee not found");

            // ================= EMPLOYER DETAILS =================
            var employer = await _context.HRM_EmployerDetails
                .AsNoTracking()
                .Where(x => x.EmployeeId == employeeId)
                .Select(x => new
                {
                    x.EmplDetailsId,
                    x.EmployeeId,
                    x.Category,
                    x.JoiningDate,
                    x.NoticePeriod,
                    x.WeeklyOff,
                    x.LeaveDate,
                    x.RelievingDate,
                    x.ShiftHours,
                    x.DeptId,
                    x.OTcalculation,
                    x.ESISNo,
                    x.PFContribution,
                    x.Currency,
                    x.PFNo,
                    x.AuthorityLevel,
                    x.DesignationId,
                    x.CTC
                })
                .FirstOrDefaultAsync();

            // ================= SALARY DETAILS =================
            var salary = await _context.HRM_EmployeeSalaryDetails
                .AsNoTracking()
                .Where(x => x.EmployeeId == employeeId)
                .Select(x => new
                {
                    x.SalaryDetailsId,
                    x.MonthlyBasicSalary,
                    x.MonthlyGrossSalary,
                    x.DA,
                    x.DailySalary,
                    x.MonthlySalary,
                    x.LeaveTravelAllowance,
                    x.AdditionalBenefits,
                    x.PerformanceIncentive,
                    x.PFContributionAmount,
                    x.ESIC,
                    x.StockOption,
                    x.CarAllowance,
                    x.MedicalAllowance,
                    x.TotalDeduction,
                    x.HouseRentAllowance,
                    x.HourlySalary,
                    x.AnnualIncrement,
                    x.AnnualIncrementDate,
                    x.TotalMonth,
                    x.ProfessionalTax,
                    x.AnnualCTC
                })
                .FirstOrDefaultAsync();

            return Ok(new
            {
                employee,
                employer,
                salary
            });
        }

        [HttpPut("DeactivateEmployee/{employeeId}")]
        public async Task<IActionResult> DeactivateEmployee(int employeeId)
        {
            var emp = await _context.HRM_Employee
                .FirstOrDefaultAsync(x => x.EmployeeId == employeeId);

            if (emp == null)
                return NotFound();

            emp.IsActive = false;
            await _context.SaveChangesAsync();

            return Ok();
        }


        [HttpPut("UpdateEmployeeStatus/{employeeId}")]
        public async Task<IActionResult> UpdateEmployeeStatus(int employeeId, bool isActive)
        {
            var emp = await _context.HRM_Employee
                .FirstOrDefaultAsync(x => x.EmployeeId == employeeId);

            if (emp == null)
                return NotFound("Employee not found");

            emp.IsActive = isActive;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = isActive ? "Employee activated" : "Employee deactivated"
            });
        }

        [HttpPut("UpdateEmployee/{employeeId}")]
        public async Task<IActionResult> UpdateEmployee(
    int employeeId,
    [FromForm] Employee dto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // ======================
                // HRM_Employee
                // ======================
                var employee = await _context.HRM_Employee
                    .FirstOrDefaultAsync(x => x.EmployeeId == employeeId);

                if (employee == null)
                    return NotFound("Employee not found");

                employee.Title = dto.Title;
                employee.FullName = dto.FullName;
                employee.Gender = dto.Gender;
                employee.DOB = dto.DOB;
                employee.BloodGroup = dto.BloodGroup;
                employee.Email = dto.Email;
                employee.ContactNo = dto.ContactNo;
                employee.MaritualStatus = dto.MaritualStatus;
                employee.Address = dto.Address;
                employee.PermanentAddress = dto.PermanentAddress;
                employee.CountryId = dto.CountryId;
                employee.StateId = dto.StateId;
                employee.CityId = dto.CityId;
                employee.Qualification = dto.Qualification;
                employee.AadharNo = dto.AadharNo;
                employee.PanNo = dto.PanNo;
                employee.BankName = dto.BankName;
                employee.BankAccountNo = dto.BankAccountNo;
                employee.IFSCCode = dto.IFSCCode;
                employee.Nominee = dto.Nominee;
                employee.Relation = dto.Relation;
                employee.UANNo = dto.UANNo;
                employee.EPFONo = dto.EPFONo;
                employee.PreviousExperience = dto.PreviousExperience;
                employee.PreviousIndustry = dto.PreviousIndustry;
                employee.DeptId = dto.DeptId;
                employee.DesignationId = dto.DesignationId;
                employee.AuthorityMatrixId = dto.AuthorityMatrixId;

                // ======================
                // HRM_EmployerDetails
                // ======================
                var employer = await _context.HRM_EmployerDetails
                    .FirstOrDefaultAsync(x => x.EmployeeId == employeeId);

                if (employer != null)
                {
                    employer.Category = dto.Category;
                    employer.JoiningDate = dto.JoiningDate;
                    employer.NoticePeriod = dto.NoticePeriod;
                    employer.WeeklyOff = dto.WeeklyOff;
                    employer.LeaveDate = dto.LeaveDate;
                    employer.RelievingDate = dto.RelievingDate;
                    employer.ShiftHours = dto.ShiftHours;
                    employer.OTcalculation = dto.OTcalculation;
                    employer.ESISNo = dto.ESISNo;
                    employer.PFContribution = dto.PFContribution;
                    employer.Currency = dto.Currency;
                    employer.PFNo = dto.PFNo;
                    employer.AuthorityLevel = dto.AuthorityLevel;
                    employer.DeptId = dto.DeptId;
                    employer.DesignationId = dto.DesignationId;
                    employer.CTC = dto.CTC;

                    // 🔹 FILE UPDATE
                    if (dto.AadharCardFile != null)
                    {
                        var path = Path.Combine("Uploads", "Aadhar");
                        Directory.CreateDirectory(path);

                        var fileName = $"{Guid.NewGuid()}_{dto.AadharCardFile.FileName}";
                        var fullPath = Path.Combine(path, fileName);

                        using var stream = new FileStream(fullPath, FileMode.Create);
                        await dto.AadharCardFile.CopyToAsync(stream);

                        employer.AadharCardFile = fullPath;
                    }

                    if (dto.PancardNoFile != null)
                    {
                        var path = Path.Combine("Uploads", "PanCard");
                        Directory.CreateDirectory(path);

                        var fileName = $"{Guid.NewGuid()}_{dto.PancardNoFile.FileName}";
                        var fullPath = Path.Combine(path, fileName);

                        using var stream = new FileStream(fullPath, FileMode.Create);
                        await dto.PancardNoFile.CopyToAsync(stream);

                        employer.PancardNoFile = fullPath;
                    }
                }

                // ======================
                // HRM_EmployeeSalaryDetails
                // ======================
                var salary = await _context.HRM_EmployeeSalaryDetails
                    .FirstOrDefaultAsync(x => x.EmployeeId == employeeId);

                if (salary != null)
                {
                    salary.MonthlyBasicSalary = dto.MonthlyBasicSalary;
                    salary.MonthlyGrossSalary = dto.MonthlyGrossSalary;
                    salary.DA = dto.DA;
                    salary.DailySalary = dto.DailySalary;
                    salary.MonthlySalary = dto.MonthlySalary;
                    salary.LeaveTravelAllowance = dto.LeaveTravelAllowance;
                    salary.AdditionalBenefits = dto.AdditionalBenefits;
                    salary.PerformanceIncentive = dto.PerformanceIncentive;
                    salary.PFContributionAmount = dto.PFContributionAmount;
                    salary.ESIC = dto.ESIC;
                    salary.StockOption = dto.StockOption;
                    salary.CarAllowance = dto.CarAllowance;
                    salary.MedicalAllowance = dto.MedicalAllowance;
                    salary.TotalDeduction = dto.TotalDeduction;
                    salary.HouseRentAllowance = dto.HouseRentAllowance;
                    salary.HourlySalary = dto.HourlySalary;
                    salary.AnnualIncrement = dto.AnnualIncrement;
                    salary.AnnualIncrementDate = dto.AnnualIncrementDate;
                    salary.TotalMonth = dto.TotalMonth;
                    salary.ProfessionalTax = dto.ProfessionalTax;
                    salary.AnnualCTC = dto.AnnualCTC;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                
                return Ok("Employee updated successfully");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, ex.Message);
            }
        }


    }
}
