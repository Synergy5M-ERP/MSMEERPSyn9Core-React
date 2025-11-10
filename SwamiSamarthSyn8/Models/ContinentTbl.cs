using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("ContinentTbl")]
public partial class ContinentTbl
{
    [Key]
    public int conti_id { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? conti_name { get; set; }

    public int? src_id { get; set; }

    public int Continent_number { get; set; }

    [StringLength(14)]
    [Unicode(false)]
    public string Continent_Code { get; set; } = null!;

    [InverseProperty("conti")]
    public virtual ICollection<CountryTbl> CountryTbls { get; set; } = new List<CountryTbl>();

    [ForeignKey("src_id")]
    [InverseProperty("ContinentTbls")]
    public virtual SourceTbl? src { get; set; }
}
