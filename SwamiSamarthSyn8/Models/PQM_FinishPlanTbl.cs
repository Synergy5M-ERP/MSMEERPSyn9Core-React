using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("PQM_FinishPlanTbl")]
public partial class PQM_FinishPlanTbl
{
    [Key]
    public int FinPlanid { get; set; }

    public int? FinProdid { get; set; }

    public DateOnly? PlanDate { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Shift { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? OpName { get; set; }

    [StringLength(250)]
    public string? BatchNo { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? PlanQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? ActualQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? RPUnit { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Amount { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? RejectionQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? QtyToWH { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? ReceivedQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? ShortQty { get; set; }

    [ForeignKey("FinProdid")]
    [InverseProperty("PQM_FinishPlanTbls")]
    public virtual PQM_FinishProdTbl? FinProd { get; set; }
}
