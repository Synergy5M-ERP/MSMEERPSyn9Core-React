using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.HRM
{
    public class HRM_EmployeeDailyAttendance
    {
        [Key] // ✅ REQUIRED
        public int EmpDailyAttendanceId { get; set; }
        public int EmployeeId { get; set; }
        public string EmpCode { get; set; }
        public DateTime AttendanceDate { get; set; }
        public string TimeIn { get; set; }
        public string TimeOut { get; set; }
        public decimal? TotalWorkHours { get; set; }
        public decimal? OverTimeHours { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool IsActive { get; set; }
    }

}
