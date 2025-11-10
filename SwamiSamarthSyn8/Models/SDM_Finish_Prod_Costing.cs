using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("SDM_Finish_Prod_Costing")]
public partial class SDM_Finish_Prod_Costing
{
    [Key]
    public int Id { get; set; }

    public string? Finish_Item_Name { get; set; }

    public string? Finish_Grade { get; set; }

    [StringLength(150)]
    public string? Finish_UOM { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Finish_Qty { get; set; }

    public string? RM_Item_Name { get; set; }

    public string? RM_Grade { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? RM_Qty_In_Grams { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? RM_Average_Price { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? RM_Cost { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? RM_Total_Cost { get; set; }

    public string? Cost_Type { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Percentage { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Cost { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Total { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Sub_Total { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Profit { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Cost_Per_Unit { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Profit_Percentage { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Profit_Per_Piece { get; set; }
}
