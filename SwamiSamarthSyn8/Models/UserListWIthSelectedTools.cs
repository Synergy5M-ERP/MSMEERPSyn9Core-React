namespace SwamiSamarthSyn8.Models
{
    public class UserListWIthSelectedTools
    {
        public int id { get; set; }
        public string Name { get; set; }

        public string Surname { get; set; }

        public string Gender { get; set; }

        public Nullable<System.DateTime> DOB { get; set; }

        public string Blood_Group { get; set; }

        public string Email { get; set; }

        public Nullable<long> Contact_NO { get; set; }

        public string Married_Status { get; set; }

        public string Quallification { get; set; }

        public string Address { get; set; }

        public string permanent_Address { get; set; }

        public string City { get; set; }

        public Nullable<long> AdharNO { get; set; }

        public string PanNo { get; set; }

        public string BankAccountNo { get; set; }

        public string BankName { get; set; }

        public string IFSC_Code { get; set; }

        public string Past_Experience { get; set; }

        public string Department { get; set; }

        public string Joining_Designation { get; set; }

        public Nullable<System.DateTime> Date_Of_Joing { get; set; }

        public string Joining_CTC_Breakup { get; set; }

        public string Password { get; set; }

        public string Position_Code { get; set; }

        public string DepartmentCode { get; set; }

        public string DesignationCode { get; set; }

        public string Joining_AuthorityLevel { get; set; }

        public string AuthorityCode { get; set; }

        public string Emp_Code { get; set; }

        public string Notices_Period { get; set; }

        public Nullable<System.DateTime> Relieving_Date { get; set; }

        public string ResetToken { get; set; }

        public string Country { get; set; }

        public string State { get; set; }

        public string Current_Designation { get; set; }

        public string Current_CTC_Breakup { get; set; }

        public string Current_Authoritylevel { get; set; }

        public string username { get; set; }

        public string password { get; set; }

        public Nullable<bool> AdminApprove { get; set; }

        public Nullable<System.DateTime> StartDate { get; set; }

        public Nullable<int> NoOfDays { get; set; }

        public Nullable<System.DateTime> EndDate { get; set; }

        public Nullable<decimal> Annual_CTC_Rs_ { get; set; }

        public Nullable<bool> IsSubscribed { get; set; }

        public Nullable<bool> CHIEF_ADMIN { get; set; }

        public Nullable<bool> SUPERADMIN { get; set; }

        public Nullable<bool> DEPUTY_SUPERADMIN { get; set; }

        public Nullable<bool> ADMIN { get; set; }

        public Nullable<bool> DEPUTY_ADMIN { get; set; }

        public Nullable<bool> USER { get; set; }
        public bool? MaterialManagement { get; set; }
        public bool? SalesAndMarketing { get; set; }
        public bool? HRAndAdmin { get; set; }
        public bool? AccountAndFinance { get; set; }
        public bool? Masters { get; set; }
        public Nullable<bool> Dashboard { get; set; }

        public Nullable<bool> ProductionAndQuality { get; set; }
        public Nullable<bool> External_buyer_seller { get; set; }
    }
}
