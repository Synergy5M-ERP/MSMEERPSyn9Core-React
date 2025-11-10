using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("BOM_FinishProdTbl")]
public partial class BOM_FinishProdTbl
{
    [Key]
    public int FPBID { get; set; }

    [StringLength(500)]
    public string? ItemCode { get; set; }

    [StringLength(200)]
    public string? ItemName { get; set; }

    [StringLength(1000)]
    public string? Grade { get; set; }

    [StringLength(200)]
    public string? UOM { get; set; }

    [StringLength(200)]
    public string? Currency { get; set; }

    [StringLength(500)]
    public string? AssemblyCode { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? AveragePrice { get; set; }

    [StringLength(200)]
    public string? ProcureType { get; set; }

    [StringLength(200)]
    public string? Level { get; set; }

    [Column(TypeName = "decimal(18, 8)")]
    public decimal? Quantity { get; set; }

    [Column(TypeName = "decimal(18, 5)")]
    public decimal? TotalRmQty { get; set; }

    public string? Buyer_Name { get; set; }

    [InverseProperty("FPB")]
    public virtual ICollection<BOM_RawMatTbl> BOM_RawMatTbls { get; set; } = new List<BOM_RawMatTbl>();
}
