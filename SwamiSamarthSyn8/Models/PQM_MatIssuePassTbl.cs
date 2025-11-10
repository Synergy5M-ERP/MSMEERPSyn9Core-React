using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("PQM_MatIssuePassTbl")]
public partial class PQM_MatIssuePassTbl
{
    [Key]
    public int ID { get; set; }

    [StringLength(100)]
    public string? DeptFrom { get; set; }

    [StringLength(100)]
    public string? DeptTo { get; set; }

    public DateOnly? Date { get; set; }

    public DateOnly? MaterialReqOnDate { get; set; }

    [StringLength(200)]
    public string? ItemCode { get; set; }

    [StringLength(200)]
    public string? ItemName { get; set; }

    [StringLength(500)]
    public string? Grade { get; set; }

    [StringLength(200)]
    public string? UOM { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? TotalReqQty { get; set; }

    [StringLength(200)]
    public string? ProductionPlanCode { get; set; }

    [Column(TypeName = "decimal(18, 8)")]
    public decimal? IssuedQty { get; set; }

    public double? PlannedProduction { get; set; }

    [Column(TypeName = "decimal(18, 8)")]
    public decimal? Total { get; set; }

    public double? TotalIssuedQty { get; set; }

    [StringLength(500)]
    public string? IssuePassNo { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Shift { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Plant_Name { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Machine_name { get; set; }

    [StringLength(500)]
    public string? MIssuePassNo { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? SONumber { get; set; }

    [StringLength(500)]
    public string? SemiFinIssuePassNo { get; set; }
}
