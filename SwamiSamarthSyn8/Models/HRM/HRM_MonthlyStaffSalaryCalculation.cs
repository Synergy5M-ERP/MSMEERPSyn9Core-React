using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.HRM
{
    public class HRM_MonthlyStaffSalaryCalculation
    {
        [Key] // ✅ REQUIRED

        public int StaffSalCalId { get; set; }
        public int EmployeeId { get; set; }
        public string SelectedMonth { get; set; }
        public int? MonthDays { get; set; }
        public int? WeeklyHolidays { get; set; }
        public int? PaidHolidays { get; set; }
        public int? WorkingDays { get; set; }
        public decimal? WelfareFund { get; set; }
        public int? AttendanceDays { get; set; }
        public decimal? DailyPaid { get; set; }
        public decimal? OTPaidDailyHourly { get; set; }
        public int? PaidLeave { get; set; }
        public int? PaidDays { get; set; }
        public decimal? OvertimeDaysHours { get; set; }
        public decimal? OvertimePaid { get; set; }
        public decimal? ESIC { get; set; }
        public decimal? EPF { get; set; }
        public decimal? PTax { get; set; }
        public decimal? TotalSalary { get; set; }
        public decimal? AdvancedPaid { get; set; }
        public decimal? PaySalary { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool IsActive { get; set; }
    }

}
