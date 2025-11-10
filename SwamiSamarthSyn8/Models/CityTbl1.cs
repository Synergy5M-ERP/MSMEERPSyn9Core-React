using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("CityTbl1")]
public partial class CityTbl1
{
    [Key]
    public int city_id { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? city_name { get; set; }

    public int state_id { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? state_code { get; set; }

    public int city_number { get; set; }

    [StringLength(9)]
    [Unicode(false)]
    public string? city_code { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? Country_Code { get; set; }

    [ForeignKey("state_id")]
    [InverseProperty("CityTbl1s")]
    public virtual StateTbl state { get; set; } = null!;
}
