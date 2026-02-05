namespace SwamiSamarthSyn8.Models
{
    public class OrgnazationRole
    {
        public int AuthorityMatrixEmployeeId { get; set; }
        public int ReportingEmpId { get; set; }
        public int? MatrixCode { get; set; }
        public int EmployeeId { get; set; }
        public int ReportingEmployeeId { get; set; }
        public string Emp_Code { get; set; }
        public string Department { get; set; }
        public string Department_Code { get; set; }
        public string Designation { get; set; }
        public string Designation_Code { get; set; }
        public string? Authority_Matrix { get; set; }

        public string Authority_Code { get; set; }
        public string RP_Authority { get; set; }
        public string RP_AuthorityCode { get; set; }

        public string RP_Department { get; set; }
        public string RP_DepartmentCode { get; set; }
        public string RP_Designation { get; set; }
        public string RP_DesignationCode { get; set; }

        public string Employee_Name { get; set; }
        public string Reporting_EmployeeName { get; set; }

        //public string ReportingTo { get; set; }
        public string Email { get; set; }
        public string? Report_Email { get; set; }
        public int Position_Code { get; set; } // MATRIX CODE
        public bool? IsActive { get; set; } = true;

    }
}
