using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("HRM_AttendanceSummaryTbl")]
public partial class HRM_AttendanceSummaryTbl
{
    [Key]
    public int Id { get; set; }

    [StringLength(100)]
    public string? Employee_Name { get; set; }

    [StringLength(50)]
    public string? Month { get; set; }

    public int? Present_Count { get; set; }

    public int? Absent_Count { get; set; }

    public int? Holiday_Count { get; set; }

    public int? WeeklyOff_Count { get; set; }

    public int? Paid_Days { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Payable_Salary { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Monthly_Salary { get; set; }

    [Column(TypeName = "decimal(18, 3)")]
    public decimal? Paid_Leave { get; set; }
}
