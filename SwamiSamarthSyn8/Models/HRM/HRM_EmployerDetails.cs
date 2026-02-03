using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SwamiSamarthSyn8.Models.HRM
{
    public class HRM_EmployerDetails
    {
        [Key] // ✅ REQUIRED
              public int EmplDetailsId { get; set; }
        public int EmployeeId { get; set; }
        public string? Category { get; set; }
        public DateTime? JoiningDate { get; set; }
        public string? NoticePeriod { get; set; }
        public string? WeeklyOff { get; set; }
        public DateTime? LeaveDate { get; set; }
        public DateTime? RelievingDate { get; set; }
        public int? ShiftHours { get; set; }
        public int? DeptId { get; set; }
        public string? OTcalculation { get; set; }
        public string? ESISNo { get; set; }
        public string? PFContribution { get; set; }
        public string? Currency { get; set; }
        public string? PFNo { get; set; }
        public string? AuthorityLevel { get; set; }
        public int? DesignationId { get; set; }
        public string? CTC { get; set; }
        public string? AadharCardFile { get; set; }
        public string? PancardNoFile { get; set; }
        [ForeignKey("EmployeeId")]
        public HRM_Employee? Employee { get; set; }
           }

}
