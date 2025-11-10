using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("BOM_RawMatTbl")]
public partial class BOM_RawMatTbl
{
    [Key]
    public int RMID { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? ItemCode { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? ItemName { get; set; }

    [StringLength(1000)]
    [Unicode(false)]
    public string? Grade { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? UOM { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Currency { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? AssemblyCode { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? AveragePrice { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? ProcureType { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? Level { get; set; }

    [Column(TypeName = "decimal(18, 8)")]
    public decimal? Quantity { get; set; }

    public int? FPBID { get; set; }

    [Column(TypeName = "decimal(18, 6)")]
    public decimal? QtyInGrms { get; set; }

    [ForeignKey("FPBID")]
    [InverseProperty("BOM_RawMatTbls")]
    public virtual BOM_FinishProdTbl? FPB { get; set; }
}
