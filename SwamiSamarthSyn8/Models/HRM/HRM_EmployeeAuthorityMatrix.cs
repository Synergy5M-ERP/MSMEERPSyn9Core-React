using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.HRM
{
    public class HRM_EmployeeAuthorityMatrix
    {
        [Key] // ✅ REQUIRED
        public int EmpAuthorityMatrixId { get; set; }
        public int AuthorityMatrixEmployeeId { get; set; }
        public int ReportingEmpId { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool IsActive { get; set; }
        public string? MatrixCode { get; set; }
        // ================= EMPLOYEE INFO =================
        public string? Department { get; set; }
        public string? Emp_Code { get; set; }
        public string? Department_Code { get; set; }

        public string? Designation { get; set; }
        public string? Designation_Code { get; set; }

        // ================= REPORTING INFO =================
        public string? RP_Department { get; set; }
        public string? Reporting_EmpCode { get; set; }
        public string? RP_DepartmentCode { get; set; }

        public string? RP_Designation { get; set; }
        public string? RP_DesignationCode { get; set; }


    }

}
