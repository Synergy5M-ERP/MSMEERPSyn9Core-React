using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("Industry")]
public partial class Industry
{
    [Key]
    public int IndustryId { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? IndustryName { get; set; }

    [StringLength(2)]
    public string? Industry_code { get; set; }

    [InverseProperty("Industry")]
    public virtual ICollection<Category> Categories { get; set; } = new List<Category>();

    [InverseProperty("Industry")]
    public virtual ICollection<Subcategory> Subcategories { get; set; } = new List<Subcategory>();
}
