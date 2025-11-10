using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("plantSettingpara")]
public partial class plantSettingpara
{
    [Key]
    public int ID { get; set; }

    public DateOnly Date { get; set; }

    [StringLength(10)]
    public string Time { get; set; } = null!;

    [StringLength(100)]
    public string Parameter { get; set; } = null!;

    public int? RPM { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? CurrentValue { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? Ratio { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? P1 { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? P3 { get; set; }

    [StringLength(255)]
    public string? ItemName { get; set; }

    [StringLength(100)]
    public string? Grade { get; set; }

    [StringLength(50)]
    public string? UOM { get; set; }

    public int? Quantity { get; set; }

    [StringLength(255)]
    public string? Location { get; set; }

    [StringLength(255)]
    public string? MachineName { get; set; }

    [StringLength(50)]
    public string? MachineNo { get; set; }
}
