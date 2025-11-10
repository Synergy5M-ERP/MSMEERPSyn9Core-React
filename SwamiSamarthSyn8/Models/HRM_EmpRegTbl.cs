using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("HRM_EmpRegTbl")]
public partial class HRM_EmpRegTbl
{
    [Key]
    public int Id { get; set; }

    [StringLength(100)]
    public string? Employee_Name { get; set; }

    [StringLength(50)]
    public string? Emp_Code { get; set; }

    [StringLength(10)]
    public string? Time_In { get; set; }

    [StringLength(10)]
    public string? Time_Out { get; set; }

    [StringLength(50)]
    public string? TotalHours { get; set; }

    [StringLength(50)]
    public string? OvertimeHours { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? DailyPay { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? OvertimePay { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? Time_In_Date { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? Time_Out_Date { get; set; }

    [StringLength(500)]
    public string? Department { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Advance_Paid { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? Advance_Date { get; set; }
}
