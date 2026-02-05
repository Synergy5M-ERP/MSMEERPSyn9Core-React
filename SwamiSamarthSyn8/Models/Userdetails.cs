using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SwamiSamarthSyn8.Models
{
    public class Userdetails
    {
        public int id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Gender { get; set; }
        public DateTime? DOB { get; set; }
        public string Blood_Group { get; set; }
        public string Email { get; set; }
        public string Contact_NO { get; set; }
        public string Married_Status { get; set; }
        public string Quallification { get; set; }
        public string Address { get; set; }
        public string permanent_Address { get; set; }
        public string City { get; set; }
        public long? AdharNO { get; set; }
        public string PanNo { get; set; }
        public string BankAccountNo { get; set; }
        public string BankName { get; set; }
        public string IFSC_Code { get; set; }
        public string Past_Experience { get; set; }
        public string Department { get; set; }
        public string Joining_Designation { get; set; }
        public DateTime? Date_Of_Joing { get; set; }
        public string Joining_CTC_Breakup { get; set; }

        public string Password { get; set; }   // KEEP THIS ONE


        public string Position_Code { get; set; }
        public string DepartmentCode { get; set; }
        public string DesignationCode { get; set; }
        public string Joining_AuthorityLevel { get; set; }
        public string AuthorityCode { get; set; }
        public string Emp_Code { get; set; }
        public string Notices_Period { get; set; }
        public DateTime? Relieving_Date { get; set; }
        public string ResetToken { get; set; }
        public string Country { get; set; }
        public string State { get; set; }
        public string Current_Designation { get; set; }
        public string Current_CTC_Breakup { get; set; }
        public string Current_Authoritylevel { get; set; }
        public string username { get; set; }
        public bool? AdminApprove { get; set; }
        public DateTime? StartDate { get; set; }
        public int? NoOfDays { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal? Annual_CTC_Rs_ { get; set; }
        public bool? IsSubscribed { get; set; }
        public bool? CHIEF_ADMIN { get; set; }
        public bool? SUPERADMIN { get; set; }
        public bool? DEPUTY_SUPERADMIN { get; set; }
        public bool? ADMIN { get; set; }
        public bool? DEPUTY_ADMIN { get; set; }
        public bool? USER { get; set; }
        public bool? MaterialManagement { get; set; }
        public bool? SalesAndMarketing { get; set; }
        public bool? HRAndAdmin { get; set; }
        public bool? AccountAndFinance { get; set; }
        public bool? Masters { get; set; }
        public bool? Dashboard { get; set; }
        public bool? ProductionAndQuality { get; set; }
        public bool? External_buyer_seller { get; set; }
    }
}
