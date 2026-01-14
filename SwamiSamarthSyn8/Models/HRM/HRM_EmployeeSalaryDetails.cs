using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.HRM
{
    public class HRM_EmployeeSalaryDetails
    {

        [Key] // ✅ REQUIRED
        public int SalaryDetailsId { get; set; }
        public int EmployeeId { get; set; }
        public decimal? MonthlyBasicSalary { get; set; }
        public decimal? MonthlyGrossSalary { get; set; }
        public decimal? DA { get; set; }
        public decimal? DailySalary { get; set; }
        public decimal? MonthlySalary { get; set; }
        public decimal? LeaveTravelAllowance { get; set; }
        public decimal? AdditionalBenefits { get; set; }
        public decimal? PerformanceIncentive { get; set; }
        public decimal? PFcontribution { get; set; }
        public decimal? ESIC { get; set; }
        public decimal? StockOption { get; set; }
        public decimal? CarAllowance { get; set; }
        public decimal? MedicalAllowance { get; set; }
        public decimal? TotalDeduction { get; set; }
        public decimal? HouseRentAllowance { get; set; }
        public decimal? HourlySalary { get; set; }
        public decimal? AnnualIncrement { get; set; }
        public DateTime? AnnualIncrementDate { get; set; }
        public int? TotalMonth { get; set; }
        public decimal? ProfessionalTax { get; set; }
        public decimal? AnnualCTC { get; set; }
    }

}
