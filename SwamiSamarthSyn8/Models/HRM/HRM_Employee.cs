using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.HRM
{
    public class HRM_Employee
    {
        [Key] // ✅ REQUIRED
        public int EmployeeId { get; set; }
        public string EmpCode { get; set; }
        public string Title { get; set; }
        public string FullName { get; set; }
        public string Gender { get; set; }
        public DateTime? DOB { get; set; }
        public string BloodGroup { get; set; }
        public string Email { get; set; }
        public string ContactNo { get; set; }
        public string MaritualStatus { get; set; }
        public string Address { get; set; }
        public string PermanentAddress { get; set; }
        public int? CountryId { get; set; }
        public int? StateId { get; set; }
        public int? CityId { get; set; }
        public string Pincode { get; set; }
        public string Qualification { get; set; }
        public string AadharNo { get; set; }
        public string PanNo { get; set; }
        public string BankName { get; set; }
        public string BankAccountNo { get; set; }
        public string IFSCCode { get; set; }
        public string BankBranchName { get; set; }
        public string Nominee { get; set; }
        public string Relation { get; set; }
        public string UANNo { get; set; }
        public string EPFONo { get; set; }
        public string PreviousExperience { get; set; }
        public string PreviousIndustry { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool IsActive { get; set; }
        public int? DeptId { get; set; }
        public int? DesignationId { get; set; }
        public int? AuthorityMatrixId { get; set; }
    }

}
