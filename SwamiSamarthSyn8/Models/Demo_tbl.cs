using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("Demo_tbl")]
public partial class Demo_tbl
{
    [Key]
    public int id { get; set; }

    [StringLength(50)]
    public string? name { get; set; }
}
