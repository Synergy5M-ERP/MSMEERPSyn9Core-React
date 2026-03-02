using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SwamiSamarthSyn8.Models.HRM
{
    [Table("HRM_User")] // ✅ FORCE TABLE NAME

    public class HRM_User
    {
        [Key] // ✅ REQUIRED

      
            public int UserId { get; set; }

            public string? UserName { get; set; }
            public string? Password { get; set; }
            public string? Emp_Code { get; set; }
            public string? ResetToken { get; set; }
            public string? UserRole { get; set; }

            public bool MaterialManagement { get; set; }
            public bool SalesAndMarketing { get; set; }
            public bool HRAndAdmin { get; set; }
            public bool AccountAndFinance { get; set; }
            public bool Masters { get; set; }
            public bool Dashboard { get; set; }
            public bool Production { get; set; }
            public bool Quality { get; set; }

            public string? NewAssignModule { get; set; }

            public bool IsActive { get; set; }

            public int? AuthorityMatrixId { get; set; }
            public int? CreatedBy { get; set; }
            public DateTime? CreatedDate { get; set; }
            public int? UpdatedBy { get; set; }
            public DateTime? UpdatedDate { get; set; }
        }

    }


