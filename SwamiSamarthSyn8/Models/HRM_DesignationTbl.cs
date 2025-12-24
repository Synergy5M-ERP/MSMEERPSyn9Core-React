using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("HRM_DesignationTbl")]
public partial class HRM_DesignationTbl
{
    [Key]
    public int Id { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? DesignationName { get; set; }

    [StringLength(2)]
    public string? Designation_code { get; set; }
    public bool? IsActive { get; set; }

}
