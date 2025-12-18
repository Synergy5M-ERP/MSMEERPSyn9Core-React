using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("HRM_OganizationTbl")]
public partial class HRM_OganizationTbl
{
    [Key]
    public int Id { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Position { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Level { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Qualification { get; set; }

    [StringLength(50)]
    public string? Experience { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Industry { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Country { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? State { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? City { get; set; }

    [StringLength(10)]
    [Unicode(false)]
    public string? Currency { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Minimum_Budget { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Maximum_Budget { get; set; }

    public DateOnly? Onboard_Date { get; set; }

    [StringLength(500)]
    public string? Department { get; set; }

    [StringLength(255)]
    public string? Employee_Name { get; set; }

    [StringLength(50)]
    public string? Department_Code { get; set; }

    [StringLength(50)]
    public string? Position_Code { get; set; }

    [StringLength(50)]
    public string? Status { get; set; }

    public string? Position_name { get; set; }

    [StringLength(1000)]
    public string? Emp_Code { get; set; }
    public bool? IsActive { get; set; }

}
