using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("SDM_STKADJTbl")]
public partial class SDM_STKADJTbl
{
    [Key]
    public int Id { get; set; }

    public string? FromBuyer { get; set; }

    public string? FromItem { get; set; }

    public string? FromGrade { get; set; }

    [StringLength(50)]
    public string? FromUom { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? FromInventory { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? StockTransferred { get; set; }

    public string? ToBuyer { get; set; }

    public string? ToItem { get; set; }

    public string? ToGrade { get; set; }

    [StringLength(50)]
    public string? ToUom { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ToInventory { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? StockReceived { get; set; }

    public string? STKADJNO { get; set; }

    public DateOnly? Date { get; set; }
}
