using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("HRM_EmpPaySalaryTbl")]
public partial class HRM_EmpPaySalaryTbl
{
    [Key]
    public int Id { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string Emp_Code { get; set; } = null!;

    [StringLength(100)]
    public string Emp_Name { get; set; } = null!;

    public int Working_Days { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Present_Days { get; set; }

    public int Absent_Days { get; set; }

    public int Paid_Days { get; set; }

    public int Paid_Leave { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Monthly_Salary { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Payable_Salary { get; set; }

    public int? No_Of_Days { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Month { get; set; }

    [StringLength(500)]
    public string? Department { get; set; }

    [StringLength(50)]
    public string? Work_from_office { get; set; }

    [StringLength(50)]
    public string? Out_Station_Duty { get; set; }

    [StringLength(50)]
    public string? Compensatory_Off { get; set; }

    public byte[]? SalarySlipPdf { get; set; }
}
