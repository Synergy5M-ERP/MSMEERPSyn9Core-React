using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

public partial class HRM_Employee_SalaryDetail
{
    [Key]
    public int Id { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? Month { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? EmpName { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? EmpCode { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Department { get; set; }

    public int? NoOfDays { get; set; }

    public int? WorkingDays { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? TotalSalary { get; set; }

    public int? PaidLeave { get; set; }

    public int? PublicHoliday { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? OvertimeHours { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? OvertimePay { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ESIC { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? EPF { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? PT { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? PaySalary { get; set; }

    public int? company_Holiday { get; set; }

    public int? Attendance_days { get; set; }

    public int? Paid_Days { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? AdvanceSalary { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? AdvancePaid { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal DailyPay { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal FEIC { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal OvertimeDailyPay { get; set; }

    public string Salary_Categeroy { get; set; } = null!;

    public string? SalarySlipPath { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? WelfareFund { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? DA { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? HRA { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? BasicSalary { get; set; }
}
