using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;   // <-- change namespace if needed
using SwamiSamarthSyn8.Models; // <-- change namespace if needed

namespace SwamiSamarthSyn8.Controllers.HRM
{
    [Route("api/HrmOrgInfo")]
    [ApiController]
    public class HrmOrgInfoController : ControllerBase
    {
        private readonly SwamiSamarthDbContext _context;

        public HrmOrgInfoController(SwamiSamarthDbContext db)
        {
            _context = db;
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
    }
}
