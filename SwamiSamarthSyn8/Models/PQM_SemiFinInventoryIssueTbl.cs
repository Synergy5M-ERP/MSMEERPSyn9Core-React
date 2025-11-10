using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("PQM_SemiFinInventoryIssueTbl")]
public partial class PQM_SemiFinInventoryIssueTbl
{
    [Key]
    public int Id { get; set; }

    [StringLength(250)]
    public string FromMachine { get; set; } = null!;

    [StringLength(250)]
    public string ToMachine { get; set; } = null!;

    public string ItemName { get; set; } = null!;

    [StringLength(250)]
    public string ItemCode { get; set; } = null!;

    public string Grade { get; set; } = null!;

    [StringLength(200)]
    public string UOM { get; set; } = null!;

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Qty { get; set; }

    public DateOnly Date { get; set; }

    [StringLength(250)]
    public string CreatedBy { get; set; } = null!;

    public DateOnly CreatedDate { get; set; }

    [StringLength(250)]
    public string UpdatedBy { get; set; } = null!;

    public DateOnly UpdatedDate { get; set; }
}
