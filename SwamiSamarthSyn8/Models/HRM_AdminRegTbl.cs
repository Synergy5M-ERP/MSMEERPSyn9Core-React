using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("HRM_AdminRegTbl")]
public partial class HRM_AdminRegTbl
{
    [Key]
    public int id { get; set; }

    public int? userid { get; set; }

    [StringLength(50)]
    public string? company_name { get; set; }

    [StringLength(50)]
    public string? contact_person { get; set; }

    [StringLength(50)]
    public string? email_id { get; set; }

    [StringLength(50)]
    public string? contact_no { get; set; }

    [StringLength(50)]
    public string? gst_no { get; set; }

    [StringLength(50)]
    public string? country { get; set; }

    [StringLength(50)]
    public string? state { get; set; }

    [StringLength(50)]
    public string? city { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? source { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? continent { get; set; }

    [StringLength(255)]
    public string? authority { get; set; }

    [StringLength(255)]
    public string? designation { get; set; }
}
