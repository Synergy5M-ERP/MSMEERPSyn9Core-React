using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("Subcategory")]
public partial class Subcategory
{
    [Key]
    public int SubcategoryId { get; set; }

    [StringLength(255)]
    public string SubcategoryName { get; set; } = null!;

    public int? CategoryId { get; set; }

    public int? IndustryId { get; set; }

    public int? sub_number { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? Cat_Code { get; set; }

    [StringLength(9)]
    [Unicode(false)]
    public string? sub_Code { get; set; }

    [ForeignKey("CategoryId")]
    [InverseProperty("Subcategories")]
    public virtual Category? Category { get; set; }

    [ForeignKey("IndustryId")]
    [InverseProperty("Subcategories")]
    public virtual Industry? Industry { get; set; }
}
