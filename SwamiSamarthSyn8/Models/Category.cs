using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("Category")]
public partial class Category
{
    [Key]
    public int CategoryId { get; set; }

    [StringLength(255)]
    public string? CategoryName { get; set; }

    public int? IndustryId { get; set; }

    public int? Cat_number { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? Industry_code { get; set; }

    [StringLength(4)]
    [Unicode(false)]
    public string? Cat_Code { get; set; }

    [ForeignKey("IndustryId")]
    [InverseProperty("Categories")]
    public virtual Industry? Industry { get; set; }

    [InverseProperty("Category")]
    public virtual ICollection<Subcategory> Subcategories { get; set; } = new List<Subcategory>();
}
