using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("StateTbl")]
public partial class StateTbl
{
    [Key]
    public int state_id { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? state_name { get; set; }

    public int country_id { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? Country_Code { get; set; }

    public int state_number { get; set; }

    [StringLength(9)]
    [Unicode(false)]
    public string? state_code { get; set; }

    [InverseProperty("state")]
    public virtual ICollection<CityTbl1> CityTbl1s { get; set; } = new List<CityTbl1>();

    [ForeignKey("country_id")]
    [InverseProperty("StateTbls")]
    public virtual CountryTbl country { get; set; } = null!;
}
