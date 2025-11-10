using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("HRM_ContactusTbl")]
public partial class HRM_ContactusTbl
{
    [Key]
    public int Id { get; set; }

    [StringLength(500)]
    public string? Name { get; set; }

    [StringLength(500)]
    public string? Email { get; set; }

    [StringLength(500)]
    public string? Subject { get; set; }

    public long? Mobile { get; set; }

    [StringLength(500)]
    public string? Message { get; set; }
}
