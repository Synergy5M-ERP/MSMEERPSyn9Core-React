using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("ApplicationItem")]
public partial class ApplicationItem
{
    [Key]
    public int ID { get; set; }

    [StringLength(150)]
    public string? ITEM_NAME { get; set; }

    [StringLength(150)]
    public string? GRADE { get; set; }

    [StringLength(150)]
    public string? UOM { get; set; }

    [StringLength(150)]
    public string? ITEM_CODE { get; set; }

    [InverseProperty("PIDNavigation")]
    public virtual ICollection<ApplicationTbl> ApplicationTbls { get; set; } = new List<ApplicationTbl>();
}
