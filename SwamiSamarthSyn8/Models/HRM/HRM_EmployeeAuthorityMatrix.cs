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
    }

}
