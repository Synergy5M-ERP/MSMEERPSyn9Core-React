using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("CountryTbl")]
public partial class CountryTbl
{
    [Key]
    public int country_id { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? country_name { get; set; }

    public int conti_id { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? continent_code { get; set; }

    public int country_number { get; set; }

    [StringLength(5)]
    [Unicode(false)]
    public string? Country_Code { get; set; }

    [InverseProperty("country")]
    public virtual ICollection<StateTbl> StateTbls { get; set; } = new List<StateTbl>();

    [ForeignKey("conti_id")]
    [InverseProperty("CountryTbls")]
    public virtual ContinentTbl conti { get; set; } = null!;
}
