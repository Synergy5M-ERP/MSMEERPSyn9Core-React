using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("PQM_CustFinProdTbl")]
public partial class PQM_CustFinProdTbl
{
    [Key]
    public int CustFinProdId { get; set; }

    public DateOnly? Date { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Location { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? MachineName { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? MachineNumber { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? MachineCap { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? SONumber { get; set; }

    [StringLength(500)]
    public string? ItemName { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? ItemCode { get; set; }

    [StringLength(1000)]
    [Unicode(false)]
    public string? Grade { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? UOM { get; set; }

    public DateOnly? OrderDate { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? BuyerName { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? CustProdDone { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? SOQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? SplitQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? CummPlanQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? BalProdQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? BalMachineCap { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? ProdTillDate { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? TotalPlanQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? TotalActualQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? TotalValue { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? TotalWHQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? TotalRejectionQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? TotalReceivedQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? TotalShortQty { get; set; }

    public int? ItemID { get; set; }

    public DateOnly? ReceivedDate { get; set; }

    [InverseProperty("CustFinProd")]
    public virtual ICollection<PQM_TodaysFinPlanTbl> PQM_TodaysFinPlanTbls { get; set; } = new List<PQM_TodaysFinPlanTbl>();
}
