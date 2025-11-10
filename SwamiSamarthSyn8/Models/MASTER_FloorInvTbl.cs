using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("MASTER_FloorInvTbl")]
public partial class MASTER_FloorInvTbl
{
    [Key]
    public int Id { get; set; }

    public DateOnly? Date { get; set; }

    [StringLength(50)]
    public string? Item_Code { get; set; }

    public string? Item_Name { get; set; }

    [StringLength(50)]
    public string? Unit_Of_Measurement { get; set; }

    public int? Safe_Stock { get; set; }

    public int? Lead_Time { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Opening_Balance { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Pending_PO { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? FloorReceipt { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? FloorIssue { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Closing_Balance { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Requirement_Month { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? PO_Placed { get; set; }

    public int? MOQ { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? PR_Pending { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Pending_PO_Rate { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Average_Price { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Quantity_Required { get; set; }

    public string? Grade { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Currency { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? ClosingInvValue { get; set; }
}
