using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("MMM_PrItemTbl")]
public partial class MMM_PrItemTbl
{
    [Key]
    public int ItemId { get; set; }

    [StringLength(100)]
    public string? ItemName { get; set; }

    [StringLength(100)]
    public string? ItemCode { get; set; }

    [StringLength(50)]
    public string? UOM { get; set; }

    [StringLength(50)]
    public string? Currency { get; set; }

    [StringLength(1000)]
    [Unicode(false)]
    public string? Grade { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? AvgPrice { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? RequireQty { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Value { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? BudgetAvalable { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Balance { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? TotalBalance { get; set; }

    public int? Id { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Status { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Hsncode { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? RequiredBy { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? BalQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? PR_Pending { get; set; }

    [ForeignKey("Id")]
    [InverseProperty("MMM_PrItemTbls")]
    public virtual MMM_PurchaseReqTbl? IdNavigation { get; set; }
}
