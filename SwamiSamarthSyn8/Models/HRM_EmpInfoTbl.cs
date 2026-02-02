using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("HRM_EmpInfoTbl")]
public partial class HRM_EmpInfoTbl
{
    [Key]
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Surname { get; set; }

    public string? Gender { get; set; }

    public DateOnly? DOB { get; set; }

    [StringLength(50)]
    public string? Blood_Group { get; set; }

    public string? Email { get; set; }

    public long? Contact_NO { get; set; }

    [StringLength(50)]
    public string? Married_Status { get; set; }

    public string? Quallification { get; set; }

    public string? Address { get; set; }

    public string? permanent_Address { get; set; }

    public string? City { get; set; }

    public long? AdharNO { get; set; }

    [StringLength(50)]
    public string? PanNo { get; set; }

    [StringLength(50)]
    public string? BankAccountNo { get; set; }

    public string? BankName { get; set; }

    [StringLength(20)]
    public string? IFSC_Code { get; set; }

    [StringLength(50)]
    public string? Past_Experience { get; set; }

    public string? Department { get; set; }

    public string? Joining_Designation { get; set; }

    public DateOnly? Date_Of_Joing { get; set; }

    [StringLength(50)]
    public string? Joining_CTC_Breakup { get; set; }

    [StringLength(50)]
   

    public string? DepartmentCode { get; set; }

    [StringLength(50)]
    public string? DesignationCode { get; set; }

    [StringLength(50)]
    public string? Joining_AuthorityLevel { get; set; }

    [StringLength(50)]
    public string? AuthorityCode { get; set; }

    [StringLength(50)]
    public string? Emp_Code { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Notices_Period { get; set; }

    public DateOnly? Relieving_Date { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? ResetToken { get; set; }

    [StringLength(100)]
    public string? Country { get; set; }

    [StringLength(100)]
    public string? State { get; set; }

    [StringLength(100)]
    public string? Current_Designation { get; set; }

    [StringLength(255)]
    public string? Current_CTC_Breakup { get; set; }

    [StringLength(100)]
    public string? Current_Authoritylevel { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Basic_Salary { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? House_rent_Allownce { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Medical_Allownce { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Leave_travel_Allowance { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Additional_Benefits { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Performance_Incentive { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? PF_Conrtibution { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? EST_Conrtibution { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Stock_Option { get; set; }

    [StringLength(100)]
    public string? car { get; set; }

    [StringLength(100)]
    public string? Telephone { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Total_Month { get; set; }

    

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Current_CTC { get; set; }

    [Column("Adhaarcard/PanCard")]
    public string? Adhaarcard_PanCard { get; set; }

    [StringLength(10)]
    public string Status { get; set; } = null!;

    [StringLength(100)]
    public string? Middle_Name { get; set; }

    [StringLength(255)]
    public string? Nominee { get; set; }

    [StringLength(255)]
    public string? Relation { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? Professional_Tax { get; set; }

    [StringLength(50)]
    public string? UAN { get; set; }

    [Column("EPFO_A/C_NO")]
    [StringLength(50)]
    public string? EPFO_A_C_NO { get; set; }

    public string? FullName { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Total_Salary { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Salary_Per_Day { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Salary_Per_Hour { get; set; }

    public string? Average_Monthly_Hours { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Average_Monthly_Salary { get; set; }

    public int? Resign { get; set; }

    [StringLength(50)]
    public string? SalaryStatus { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Salary_Increment { get; set; }

    public DateOnly? Date_Of_Increment { get; set; }

    [StringLength(200)]
    public string? Previous_Industry_Title { get; set; }

    [StringLength(50)]
    public string? Weekly_Off { get; set; }

    public DateOnly? DOL { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? Shift_Hours { get; set; }

    [StringLength(20)]
    public string? Currency { get; set; }

    [StringLength(100)]
    public string? Title { get; set; }

    [StringLength(50)]
    public string? OT_calculation { get; set; }

    [StringLength(10)]
    public string? ESIC { get; set; }

    [StringLength(50)]
    public string? PFContri { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? PTax { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Daily_Salary { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Hourly_Salary { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Annual_Increment { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? DA { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Total_Deduction { get; set; }

    public DateOnly? Annual_Inc_Date { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Gross_Salary_With_OT { get; set; }

    [StringLength(50)]
    public string? PF_No { get; set; }

    [StringLength(50)]
    public string? ESIC_No { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? OT_Daily { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? OT_Hourly { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Monthly_Gross_Salary { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Monthly_Salary { get; set; }
    public bool? IsActive { get; set; }
    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Annual_CTC_Rs { get; set; }




}
