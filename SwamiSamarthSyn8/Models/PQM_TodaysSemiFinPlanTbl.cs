using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("PQM_TodaysSemiFinPlanTbl")]
public partial class PQM_TodaysSemiFinPlanTbl
{
    [Key]
    public int PlanId { get; set; }

    public int? CustProdId { get; set; }

    public DateOnly? PlanDate { get; set; }

    [StringLength(200)]
    public string? Shift { get; set; }

    [StringLength(200)]
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

    [StringLength(250)]
    public string? BatchNo { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? ShortQty { get; set; }

    [StringLength(200)]
    public string? Location { get; set; }

    [StringLength(200)]
    public string? MachineName { get; set; }

    [StringLength(200)]
    public string? MachineNumber { get; set; }

    [StringLength(200)]
    public string? MachineCap { get; set; }

    [StringLength(100)]
    public string? RollNo { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? NetWeight { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? AvgWeight { get; set; }

    [StringLength(250)]
    public string? Wastage { get; set; }

    [StringLength(100)]
    public string? RollByMeter { get; set; }

    [ForeignKey("CustProdId")]
    [InverseProperty("PQM_TodaysSemiFinPlanTbls")]
    public virtual PQM_SemiFinProdTbl? CustProd { get; set; }
}
