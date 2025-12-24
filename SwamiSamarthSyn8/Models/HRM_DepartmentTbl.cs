using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("HRM_DepartmentTbl")]
public partial class HRM_DepartmentTbl
{
    [Key]
    public int Id { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? DepartmentName { get; set; }

    [StringLength(2)]
    public string? Department_code { get; set; }
    public bool? IsActive { get; set; }

}
