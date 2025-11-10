using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("PQM_SemiFinProdTbl")]
public partial class PQM_SemiFinProdTbl
{
    [Key]
    public int CustProdId { get; set; }

    public DateOnly? Date { get; set; }

    [StringLength(200)]
    public string? BuyerName { get; set; }

    [StringLength(200)]
    public string? SONumber { get; set; }

    [StringLength(200)]
    public string? ItemName { get; set; }

    [StringLength(200)]
    public string? ItemCode { get; set; }

    [StringLength(1000)]
    public string? Grade { get; set; }

    [StringLength(200)]
    public string? UOM { get; set; }

    [StringLength(200)]
    public string? CustProdDone { get; set; }

    [Column(TypeName = "decimal(18, 6)")]
    public decimal? SOQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? ActualReqQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? BalProdQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? ProdTillDate { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? TotalPlanQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? TotalActualQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? BalActualQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? TotalWHQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? TotalRejectionQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? TotalReceivedQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? TotalShortQty { get; set; }

    public DateOnly? ReceivedDate { get; set; }

    [StringLength(200)]
    public string? FinishItemName { get; set; }

    [StringLength(1000)]
    public string? FinishGrade { get; set; }

    [StringLength(500)]
    public string? AssemblyCode { get; set; }

    [StringLength(300)]
    public string? BOMLevel { get; set; }

    public int? BOMRMID { get; set; }

    public int? BOMFPID { get; set; }

    [StringLength(100)]
    public string? PlanCode { get; set; }

    [InverseProperty("CustProd")]
    public virtual ICollection<PQM_TodaysSemiFinPlanTbl> PQM_TodaysSemiFinPlanTbls { get; set; } = new List<PQM_TodaysSemiFinPlanTbl>();
}
