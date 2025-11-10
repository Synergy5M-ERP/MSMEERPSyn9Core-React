using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("PQM_RMConsumptionTbl")]
public partial class PQM_RMConsumptionTbl
{
    [Key]
    public int Id { get; set; }

    [StringLength(100)]
    public string? ItemName { get; set; }

    [StringLength(200)]
    public string? ItemCode { get; set; }

    [StringLength(1000)]
    public string? Grade { get; set; }

    [StringLength(50)]
    public string? UOM { get; set; }

    [StringLength(50)]
    public string? Level { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Qty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? TotalConsumptionQty { get; set; }

    public DateOnly? ReportDate { get; set; }

    public DateOnly? ConsumptionDate { get; set; }
}
