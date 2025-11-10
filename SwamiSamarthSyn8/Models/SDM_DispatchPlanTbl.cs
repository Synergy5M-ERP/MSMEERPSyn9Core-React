using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("SDM_DispatchPlanTbl")]
public partial class SDM_DispatchPlanTbl
{
    [Key]
    public int D_Id { get; set; }

    [StringLength(500)]
    public string? Item_Name { get; set; }

    [StringLength(500)]
    public string? Grade { get; set; }

    [StringLength(100)]
    public string? Item_Code { get; set; }

    [StringLength(50)]
    public string? UOM { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? SO_Qty { get; set; }

    [StringLength(100)]
    public string? So_No { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? So_Date { get; set; }

    [StringLength(50)]
    public string? BuyerName { get; set; }

    [StringLength(100)]
    public string? City { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? D_Qty { get; set; }

    [StringLength(100)]
    public string? Invoice_No { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Invoice_Balance { get; set; }
}
