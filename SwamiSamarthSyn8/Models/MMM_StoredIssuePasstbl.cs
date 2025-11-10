using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("MMM_StoredIssuePasstbl")]
public partial class MMM_StoredIssuePasstbl
{
    [Key]
    public int Id { get; set; }

    [StringLength(50)]
    public string? ItemName { get; set; }

    [StringLength(50)]
    public string? Itemcode { get; set; }

    [StringLength(50)]
    public string? Grade { get; set; }

    [StringLength(50)]
    public string? UOM { get; set; }

    [StringLength(50)]
    public string? Shift { get; set; }

    [StringLength(50)]
    public string? Planned_Production { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Total { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Total_Req_Qty { get; set; }

    [StringLength(50)]
    public string? Issue_PassNo { get; set; }

    [StringLength(50)]
    public string? MachineName { get; set; }

    [StringLength(50)]
    public string? PlantName { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? IssuedQty { get; set; }

    public DateOnly? Date { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Balance { get; set; }

    [StringLength(500)]
    public string? ARN_No { get; set; }

    [StringLength(50)]
    public string? Batch_No { get; set; }

    [StringLength(50)]
    public string? Batch_Size { get; set; }

    [StringLength(50)]
    public string? SO_No { get; set; }
}
