using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("MMM_WorldWideMTbl")]
public partial class MMM_WorldWideMTbl
{
    [Key]
    public int ID { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Continent { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Country { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Company_Name { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Plant_Location { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Product_Name { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Unit_Of_Measurement { get; set; }

    public int? Annual_Capacity { get; set; }

    [Column(TypeName = "decimal(5, 2)")]
    public decimal? Anuual_Capacity_MMT { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Industry { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Category { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Sub_Category { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Source { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Email { get; set; }

    public int? User_id { get; set; }

    public bool? is_deleted { get; set; }
}
