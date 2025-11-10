using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("HRM_DailywagesSalary")]
public partial class HRM_DailywagesSalary
{
    [Key]
    public int Id { get; set; }

    [StringLength(50)]
    public string? Month { get; set; }

    [StringLength(50)]
    public string? Emp_Code { get; set; }

    [StringLength(100)]
    public string? Department { get; set; }

    [StringLength(100)]
    public string? Designation { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? Total_Work_Hours { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Salary_Per_Hour { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? PF { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ESIC { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? PT { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Advance_Paid { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Average_Month_Salary { get; set; }

    [StringLength(100)]
    public string? Employee_Name { get; set; }
}
