using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

public partial class IndusCatSubDatum
{
    [Key]
    public int Id { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? IndustryName { get; set; }

    [StringLength(255)]
    public string? CategoryName { get; set; }

    [StringLength(255)]
    public string? SubcategoryName { get; set; }

    public int? IndustryId { get; set; }

    public int? CategoryId { get; set; }

    public int? SubcategoryId { get; set; }

    [Unicode(false)]
    public string? Code { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? Industry_Code { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? Category_Code { get; set; }
}
