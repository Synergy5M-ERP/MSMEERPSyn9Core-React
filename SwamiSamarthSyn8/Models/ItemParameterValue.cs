using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

public partial class ItemParameterValue
{
    [Key]
    public int ID { get; set; }

    [StringLength(150)]
    public string? ItemName { get; set; }

    [StringLength(150)]
    public string? Grade { get; set; }

    [StringLength(150)]
    public string? ParameterName { get; set; }

    [StringLength(150)]
    public string? UOM { get; set; }

    public string? Value { get; set; }

    public int ItemID { get; set; }

    public int ParameterID { get; set; }

    public int? PrimaryID { get; set; }

    [StringLength(150)]
    public string? Type { get; set; }
}
