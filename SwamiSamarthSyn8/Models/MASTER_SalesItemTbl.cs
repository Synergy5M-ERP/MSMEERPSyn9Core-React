using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("MASTER_SalesItemTbl")]
public partial class MASTER_SalesItemTbl
{
    [Key]
    public int Id { get; set; }

    [StringLength(50)]
    public string? Item_Code { get; set; }

    public string? Item_Name { get; set; }

    public string? Grade { get; set; }

    [StringLength(50)]
    public string? Unit_Of_Measurement { get; set; }

    public int? HS_Code { get; set; }

    [StringLength(50)]
    public string? Company_Name { get; set; }

    [StringLength(50)]
    public string? Country { get; set; }

    [StringLength(500)]
    public string? TDS { get; set; }

    [StringLength(500)]
    public string? MSDS { get; set; }

    [StringLength(500)]
    public string? Free_Trade_Agreement { get; set; }

    public byte[]? Image { get; set; }

    public bool? IsDemoProduct { get; set; }

    [StringLength(50)]
    public string? ItemCategory { get; set; }

    [StringLength(50)]
    public string? Sub_Category { get; set; }

    [StringLength(50)]
    public string? C_Code { get; set; }

    [StringLength(50)]
    public string? SC_Code { get; set; }

    [StringLength(50)]
    public string? Source { get; set; }

    [StringLength(50)]
    public string? Currency { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Average_Price { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal? Opening_Balance { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal? Closing_Balance { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal? Issue { get; set; }

    [Column(TypeName = "decimal(18, 0)")]
    public decimal? Receipt { get; set; }

    [StringLength(100)]
    public string? Industry { get; set; }

    public int? Safe_Stock { get; set; }

    public int? MOQ { get; set; }

    public string? Continent { get; set; }

    public string? State { get; set; }

    public string? City { get; set; }

    public string? Packaging { get; set; }
}
