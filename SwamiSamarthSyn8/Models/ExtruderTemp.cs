using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("ExtruderTemp")]
public partial class ExtruderTemp
{
    [Key]
    public int Id { get; set; }

    public DateOnly Date { get; set; }

    [StringLength(100)]
    public string TemperatureType { get; set; } = null!;

    [StringLength(50)]
    public string Zone { get; set; } = null!;

    [Column(TypeName = "decimal(10, 2)")]
    public decimal Temperature { get; set; }
}
