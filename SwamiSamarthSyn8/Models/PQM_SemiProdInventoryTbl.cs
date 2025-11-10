using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("PQM_SemiProdInventoryTbl")]
public partial class PQM_SemiProdInventoryTbl
{
    [Key]
    public int SemiProdID { get; set; }

    [StringLength(500)]
    public string ItemName { get; set; } = null!;

    [StringLength(500)]
    public string ItemCode { get; set; } = null!;

    [StringLength(1000)]
    public string? Grade { get; set; }

    [StringLength(100)]
    public string UOM { get; set; } = null!;

    public int SafeStock { get; set; }

    public int LeadTime { get; set; }

    public int MOQ { get; set; }

    public int OpeningBalance { get; set; }

    public int DailyProduction { get; set; }

    public int DailyIssue { get; set; }

    public int ClosingBalance { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? Date { get; set; }

    [Column(TypeName = "decimal(18, 6)")]
    public decimal? Unit_Price { get; set; }

    [Column(TypeName = "decimal(18, 6)")]
    public decimal? Inventory_Value { get; set; }
}
