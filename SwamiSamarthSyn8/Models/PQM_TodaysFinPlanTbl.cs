using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("PQM_TodaysFinPlanTbl")]
public partial class PQM_TodaysFinPlanTbl
{
    [Key]
    public int PlanId { get; set; }

    public int? CustFinProdId { get; set; }

    public int? GenFinProdId { get; set; }

    public DateOnly? PlanDate { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Shift { get; set; }

    [StringLength(250)]
    public string? BatchNo { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? OpName { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? PlanQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? ActualQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? RPUnit { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Total { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? RejectionQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? QtyToWH { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? ReceivedQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? ShortQty { get; set; }

    [ForeignKey("CustFinProdId")]
    [InverseProperty("PQM_TodaysFinPlanTbls")]
    public virtual PQM_CustFinProdTbl? CustFinProd { get; set; }

    [ForeignKey("GenFinProdId")]
    [InverseProperty("PQM_TodaysFinPlanTbls")]
    public virtual PQM_GenFinProdTbl? GenFinProd { get; set; }
    public bool IsRejectedSubmitted { get; set; }
}
