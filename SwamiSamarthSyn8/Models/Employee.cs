using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.DataAnnotations;
namespace SwamiSamarthSyn8.Models
{
      public class Employee
        {
            public int Id { get; set; }
            [Required(ErrorMessage = "This field is required")]

            public string Middle_Name { get; set; }
            [Required(ErrorMessage = "This field is required")]

            public string Name { get; set; }
            [Required(ErrorMessage = "This field is required")]

            public string Surname { get; set; }
            [Required(ErrorMessage = "This field is required")]

            public string Gender { get; set; }

            //[Column(TypeName = "date")]
            public DateTime? DOB { get; set; }
            public string Blood_Group { get; set; }
            public string Email { get; set; }
            public long? Contact_NO { get; set; }
            public string Married_Status { get; set; }
            public string Quallification { get; set; }
            [Required(ErrorMessage = "This field is required")]
            public string Address { get; set; }
            [Required(ErrorMessage = "This field is required")]

            public string Permanent_Address { get; set; }
            public string City { get; set; }
            public int DepartmentId { get; set; }
            public int DesignationId { get; set; }
            public int AuthorityId { get; set; }
            public string AuthorityLevel { get; set; }
            public string DepartmentCode { get; set; }
            public int JoiningDesignationId { get; set; }
            public int CurrentDesignationId { get; set; }
            [Required(ErrorMessage = "This field is required")]

            public int JoiningAuthorityId { get; set; }
            [Required(ErrorMessage = "This field is required")]

            public int CurrentAuthorityId { get; set; }
            public int SelectedCurrentAuthorityId { get; set; }
            public int SelectedJoiningAuthorityId { get; set; }
            public int SelectedCurrentDesignationId { get; set; }
            public string SelectedCountryName { get; set; } // New property for country name
            public string SelectedStateName { get; set; } // New property for state name
            public string SelectedCityName { get; set; } // New property for city name
            public int PositionId { get; set; }
            [Required(ErrorMessage = "This field is required")]

            public long? AdharNO { get; set; }
            public string PanNo { get; set; }
            [Required(ErrorMessage = "This field is required")]

            public string BankAccountNo { get; set; }
            [Required(ErrorMessage = "This field is required")]

            public string BankName { get; set; }
            [Required(ErrorMessage = "This field is required")]

            public string IFSC_Code { get; set; }
            public string Past_Experience { get; set; }
            public string Department { get; set; }
            public string Designation { get; set; }
            //[Column(TypeName = "date")]
            public DateTime? Date_Of_Joing { get; set; }
            public DateTime SelectedDate { get; set; } // Add this property

            public string CTC { get; set; }
            public int SelectedCountryId { get; set; }
            public int SelectedStateId { get; set; }
            public int SelectedCityId { get; set; }
            public string Notices_Period { get; set; }
            public DateTime? Relieving_Date { get; set; }
            public string Emp_Code { get; set; }
            public string DepartmentName { get; set; }
            public string DesignationName { get; set; }
            public string Position { get; set; }
            public string Joining_CTC_Breakup { get; set; }
            public string Joining_AuthorityLevel { get; set; }
            public string Country { get; set; }
            public string State { get; set; }
            public int SelectedDepartmentId { get; set; }
            public int country_id { get; set; }
            public int state_id { get; set; }

            public string Current_Designation { get; set; }
            public string Current_CTC_Breakup { get; set; }
            public string Current_Authoritylevel { get; set; }
            public decimal? Basic_Salary { get; set; }
            public decimal? House_rent_Allownce { get; set; }
            public decimal? Medical_Allownce { get; set; }
            public decimal? Leave_travel_Allowance { get; set; }
            public decimal? Additional_Benefits { get; set; }
            public decimal? Performance_Incentive { get; set; }
            public decimal? PF_Conrtibution { get; set; }
            public decimal? EST_Conrtibution { get; set; }
            public decimal? Stock_Option { get; set; }
            public string Car { get; set; }
            public string Telephone { get; set; }
            public decimal? Total_Month { get; set; }
            public decimal? Annual_CTC_Rs_ { get; set; }
            public decimal? Current_CTC { get; set; }
            public string Password { get; set; }
            public string ConfirmPassword { get; set; }
            public string FullName { get; set; }

            public IEnumerable<SelectListItem> CountryList { get; set; }
            public IEnumerable<SelectListItem> StateList { get; set; }
            public IEnumerable<SelectListItem> CityList { get; set; }
            [Required(ErrorMessage = "This field is required")]

            public string SelectedCTC { get; set; }
            public string Adhaarcard_PanCard { get; set; }
        public IFormFile AdhaarFile { get; set; }

        public string AdhaarFilePath { get; set; }
            public string Status { get; set; }
            public string Joining_Designation { get; internal set; }
            public string PositionType { get; internal set; }
            public string Nominee { get; set; }
            public string Relation { get; set; }

            public Nullable<decimal> Professional_Tax { get; set; }

            public string UAN { get; set; }

            public string EPFO_A_C_NO { get; set; }

            public Nullable<decimal> Salary_Per_Day { get; set; }

            public Nullable<decimal> Salary_Per_Hour { get; set; }

            public string? Average_Monthly_Hours { get; set; }
            public string? Title { get; set; }
            public string? Previous_Industry_Title { get; set; }

            public Nullable<decimal> Average_Monthly_Salary { get; set; }
            public string? Department_Name { get; set; }
            public string Department_Code { get; set; }
            public string SelectedDepartmentName { get; set; }
            public string Weekly_Off { get; set; }
            public DateTime? DOR { get; set; }

            public Nullable<System.DateTime> DOL { get; set; }

            public Nullable<decimal> Shift_Hours { get; set; }


            public string? Currency { get; set; }

            public string? SalaryStatus { get; set; }

            public Nullable<decimal> Salary_Increment { get; set; }

            public string? OT_calculation { get; set; }

            public string? ESIC { get; set; }

            public string? PFContri { get; set; }

            public string? PTax { get; set; }

            public Nullable<decimal> Daily_Salary { get; set; }

            public Nullable<decimal> Hourly_Salary { get; set; }

            public Nullable<decimal> Annual_Increment { get; set; }

            public Nullable<decimal> Special_Allowance { get; set; }

            public Nullable<decimal> Total_Deduction { get; set; }

            public Nullable<System.DateTime> Annual_Inc_Date { get; set; }

            public Nullable<decimal> Gross_Salary_With_OT { get; set; }
            public Nullable<decimal> Monthly_Gross_Salary { get; set; }

            public Nullable<decimal> Month_ofSalary { get; set; }

            public string? PF_No { get; set; }
            public Nullable<decimal> DA { get; set; }


            public string? ESIC_No { get; set; }

            public Nullable<decimal> OT_Daily { get; set; }

            public Nullable<decimal> OT_Hourly { get; set; }
            public DateTime? Date_Of_Increment { get; internal set; }
        }
}
