using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("AlternateItemMaster")]
public partial class AlternateItemMaster
{
    [Key]
    public int ID { get; set; }

    [StringLength(1000)]
    [Unicode(false)]
    public string? ITEM_NAME { get; set; }

    [StringLength(1000)]
    [Unicode(false)]
    public string? GRADE { get; set; }

    [StringLength(1000)]
    [Unicode(false)]
    public string? UOM { get; set; }

    [StringLength(1000)]
    [Unicode(false)]
    public decimal? QTY { get; set; }

    [StringLength(1000)]
    [Unicode(false)]
    public string? TYPE { get; set; }

    public int? PId { get; set; }

    [StringLength(500)]
    public string? Item_Code { get; set; }

    [ForeignKey("PId")]
    [InverseProperty("AlternateItemMasters")]
    public virtual PrimaryItemMaster? PIdNavigation { get; set; }
}
