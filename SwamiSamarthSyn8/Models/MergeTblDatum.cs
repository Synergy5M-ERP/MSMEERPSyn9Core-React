using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

public partial class MergeTblDatum
{
    [Key]
    public int Id { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? src_name { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? conti_name { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? Country_Name { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? state_name { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? city_name { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? code { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? state_code { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? Country_Code { get; set; }
}
