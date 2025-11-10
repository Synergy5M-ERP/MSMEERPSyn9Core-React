using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("PQM_FinishProdTbl")]
public partial class PQM_FinishProdTbl
{
    [Key]
    public int FinProdid { get; set; }

    public int? FPBID { get; set; }

    public DateOnly? ProdDate { get; set; }

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
    public string? ItemName { get; set; }

    [StringLength(1000)]
    public string? Grade { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? BuyerName { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? SONumber { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? ItemCode { get; set; }

    public DateOnly? SODate { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? UOM { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? SOQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? BalProdQty { get; set; }

    [StringLength(200)]
    public string? FinProdDone { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? TotalPlanQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? TotalActualQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? TotalAmount { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? TotalRejectionQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? TotalQtyToWH { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? TotalReceivedQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? TotalShortQty { get; set; }

    public DateOnly? ReceivedDate { get; set; }

    [InverseProperty("FinProd")]
    public virtual ICollection<PQM_FinishPlanTbl> PQM_FinishPlanTbls { get; set; } = new List<PQM_FinishPlanTbl>();
}
