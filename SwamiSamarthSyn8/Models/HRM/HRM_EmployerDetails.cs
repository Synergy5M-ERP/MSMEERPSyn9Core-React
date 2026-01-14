using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.HRM
{
    public class HRM_EmployerDetails
    {
        [Key] // ✅ REQUIRED
              public int EmplDetailsId { get; set; }
        public int EmployeeId { get; set; }
        public int? CategoryId { get; set; }
        public DateTime? JoiningDate { get; set; }
        public int? NoticePeriod { get; set; }
        public string WeeklyOff { get; set; }
        public DateTime? LeaveDate { get; set; }
        public DateTime? RelievingDate { get; set; }
        public decimal? ShiftHours { get; set; }
        public int? DeptId { get; set; }
        public bool? OTcalculation { get; set; }
        public string ESISNo { get; set; }
        public decimal? PFContribution { get; set; }
        public string Currency { get; set; }
        public string PFNo { get; set; }
        public string AuthorityLevel { get; set; }
        public int? DesignationId { get; set; }
        public decimal? CTC { get; set; }
        public string AadharCardFile { get; set; }
        public string PancardNoFile { get; set; }
    }

}
