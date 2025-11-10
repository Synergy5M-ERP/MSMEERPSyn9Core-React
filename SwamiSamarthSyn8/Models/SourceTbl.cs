using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("SourceTbl")]
public partial class SourceTbl
{
    [Key]
    public int src_id { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? src_name { get; set; }

    [InverseProperty("src")]
    public virtual ICollection<ContinentTbl> ContinentTbls { get; set; } = new List<ContinentTbl>();
}
