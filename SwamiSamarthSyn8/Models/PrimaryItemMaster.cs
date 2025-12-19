using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("PrimaryItemMaster")]
public partial class PrimaryItemMaster
{
    [Key]
    public int ID { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? ITEM_NAME { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? GRADE { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? UOM { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public decimal? QTY { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? TYPE { get; set; }

    [StringLength(500)]
    public string? Item_Code { get; set; }

    [InverseProperty("PIdNavigation")]
    public virtual ICollection<AlternateItemMaster> AlternateItemMasters { get; set; } = new List<AlternateItemMaster>();
}
