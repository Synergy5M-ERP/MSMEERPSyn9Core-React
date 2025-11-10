using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("PQM_RawMatTbl")]
public partial class PQM_RawMatTbl
{
    [Key]
    public int ID { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string Item_Name { get; set; } = null!;

    [StringLength(500)]
    [Unicode(false)]
    public string Item_Code { get; set; } = null!;

    [StringLength(1000)]
    public string? Grade { get; set; }

    [StringLength(500)]
    public string? SONumber { get; set; }

    [StringLength(500)]
    public string? BuyerName { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? UOM { get; set; }

    [Column(TypeName = "decimal(18, 8)")]
    public decimal? Total_Required_Qty { get; set; }

    public DateOnly? Date { get; set; }
}
