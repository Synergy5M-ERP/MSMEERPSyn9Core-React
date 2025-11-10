using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("Parametertbl")]
public partial class Parametertbl
{
    [Key]
    public int ID { get; set; }

    [StringLength(150)]
    public string? Parameter { get; set; }

    [StringLength(50)]
    public string? UOM { get; set; }
}
