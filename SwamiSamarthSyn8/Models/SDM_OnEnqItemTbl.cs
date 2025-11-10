using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("SDM_OnEnqItemTbl")]
public partial class SDM_OnEnqItemTbl
{
    [Key]
    public int ItemId { get; set; }

    [StringLength(200)]
    public string? ItemDetail { get; set; }

    [StringLength(50)]
    public string? Uom { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Qty_Req { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? Valid_Date { get; set; }

    public int? VendId { get; set; }

    [ForeignKey("VendId")]
    [InverseProperty("SDM_OnEnqItemTbls")]
    public virtual SDM_OnEnqVendTbl? Vend { get; set; }
}
