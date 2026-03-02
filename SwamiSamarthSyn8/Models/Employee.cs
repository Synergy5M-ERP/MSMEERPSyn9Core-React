using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models
{
    public class Employee
    {
        // ================= HRM_Employee =================
        public string? EmpCode { get; set; }
        public string? Title { get; set; }
        public string? FullName { get; set; }
        public string? Gender { get; set; }
        public DateTime? DOB { get; set; }
        public string? BloodGroup { get; set; }
        public string? Email { get; set; }
        public string? ContactNo { get; set; }
        public string? MaritualStatus { get; set; }
        public string? Address { get; set; }
        public string? PermanentAddress { get; set; }

        public string? CountryId { get; set; }
        public string? StateId { get; set; }
        public string? CityId { get; set; }
        public string? Pincode { get; set; }

        public string? Qualification { get; set; }
        public string? AadharNo { get; set; }
        public string? PanNo { get; set; }

        public string? BankName { get; set; }
        public string? BankAccountNo { get; set; }
        public string? IFSCCode { get; set; }
        public string? BankBranchName { get; set; }

        public string? Nominee { get; set; }
        public string? Relation { get; set; }
        public string? UANNo { get; set; }
        public string? EPFONo { get; set; }

        public string? PreviousExperience { get; set; }
        public string? PreviousIndustry { get; set; }

        public int? DeptId { get; set; }
        public int? DesignationId { get; set; }
        public int? AuthorityMatrixId { get; set; }

        // ================= HRM_EmployerDetails =================
        public string Category { get; set; }

        public DateTime? JoiningDate { get; set; }
        public string? NoticePeriod { get; set; }
        public string? WeeklyOff { get; set; }
        public DateTime? LeaveDate { get; set; }
        public DateTime? RelievingDate { get; set; }
        public int? ShiftHours { get; set; }
        public string? OTcalculation { get; set; }
        public string? ESISNo { get; set; }
        public string? PFContribution { get; set; }
        public string? Currency { get; set; }
        public string? PFNo { get; set; }
        public string? AuthorityLevel { get; set; }
        public string? CTC { get; set; }

        public IFormFile? AadharCardFile { get; set; }
        public IFormFile? PancardNoFile { get; set; }

        // ================= HRM_EmployeeSalaryDetails =================
        public decimal? MonthlyBasicSalary { get; set; }
        public decimal? MonthlyGrossSalary { get; set; }
        public decimal? DA { get; set; }
        public decimal? DailySalary { get; set; }
        public decimal? MonthlySalary { get; set; }
        public decimal? LeaveTravelAllowance { get; set; }
        public decimal? AdditionalBenefits { get; set; }
        public decimal? PerformanceIncentive { get; set; }
        public decimal? PFContributionAmount { get; set; }
        public decimal? ESIC { get; set; }
        public decimal? StockOption { get; set; }
        public decimal? CarAllowance { get; set; }
        public decimal? MedicalAllowance { get; set; }
        public decimal? TotalDeduction { get; set; }
        public decimal? HouseRentAllowance { get; set; }
        public decimal? HourlySalary { get; set; }
        public decimal? AnnualIncrement { get; set; }
        public DateTime? AnnualIncrementDate { get; set; }
        public decimal? TotalMonth { get; set; }
        public decimal? ProfessionalTax { get; set; }
        public decimal? AnnualCTC { get; set; }
    }
}
