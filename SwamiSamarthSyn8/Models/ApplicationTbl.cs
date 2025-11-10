using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("ApplicationTbl")]
public partial class ApplicationTbl
{
    [Key]
    public int ID { get; set; }

    [StringLength(150)]
    public string? INDUSTRY { get; set; }

    [StringLength(150)]
    public string? CATEGORY { get; set; }

    [StringLength(150)]
    public string? SUB_CATEGORY { get; set; }

    [StringLength(150)]
    public string? USES { get; set; }

    public int? PID { get; set; }

    [ForeignKey("PID")]
    [InverseProperty("ApplicationTbls")]
    public virtual ApplicationItem? PIDNavigation { get; set; }
}
