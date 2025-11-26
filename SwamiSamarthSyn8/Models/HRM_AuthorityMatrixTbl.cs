using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("HRM_AuthorityMatrixTbl")]
public partial class HRM_AuthorityMatrixTbl
{
    [Key]
    public int Id { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? AuthorityName { get; set; }

    [StringLength(2)]
    public string? Authority_code { get; set; }

    [StringLength(3)]
    public string IsSelected { get; set; } = null!;

    public string? Authority_name { get; set; }
    public bool IsActive { get; set; } = true;

}
