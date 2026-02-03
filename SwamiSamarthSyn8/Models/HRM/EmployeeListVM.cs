namespace SwamiSamarthSyn8.Models.HRM
{
    public class EmployeeListVM
    {

        public int EmployeeId { get; set; }

        public string? EmpCode { get; set; }
        public string? FullName { get; set; }
        public string? Gender { get; set; }
        public DateTime? DOB { get; set; }
        public int? CountryId { get; set; }
        public int? StateId { get; set; }
        public int? CityId { get; set; }
        public string? Department { get; set; }
        public string? Designation { get; set; }
        public DateTime? JoiningDate { get; set; }
        public int? DeptId { get; set; }
        public int? DesignationId { get; set; }
        public int? AuthorityMatrixId { get; set; }
        public decimal? MonthlySalary { get; set; }
        public string? City { get; set; }
        public string? ContactNo { get; set; }
        public string DepartmentName { get; set; }
        public string DesignationName { get; set; }
        public bool IsActive { get; set; }

        public string AuthorityName { get; set; }

    }

}
