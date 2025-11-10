using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("PQM_SemiFinProdLabelTbl")]
public partial class PQM_SemiFinProdLabelTbl
{
    [Key]
    public int Id { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string ItemName { get; set; } = null!;

    [StringLength(100)]
    [Unicode(false)]
    public string? Grade { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? UOM { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? BatchNo { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Quantity { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? GrossWeight { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? NetWeight { get; set; }

    public DateOnly? Date { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? BuyerName { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? MachineNo { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? RollNo { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Avg { get; set; }

    [StringLength(50)]
    public string? SONO { get; set; }

    public int? RollQuantity { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ActualQuantity { get; set; }
}
