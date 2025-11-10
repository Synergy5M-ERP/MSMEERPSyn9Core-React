using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("Users2")]
public partial class Users2
{
    [Key]
    public int Id { get; set; }

    [StringLength(100)]
    public string? Date { get; set; }

    [StringLength(100)]
    public string? HS_Code { get; set; }

    [Unicode(false)]
    public string? Product_Description { get; set; }

    [StringLength(100)]
    public string? Quantity { get; set; }

    [Unicode(false)]
    public string? Unit { get; set; }

    [StringLength(1000)]
    public string? Total_Ass_Value_INR { get; set; }

    [StringLength(1000)]
    public string? Unit_INR { get; set; }

    [StringLength(1000)]
    public string? Total_AssValue_In_Foreign_Currency { get; set; }

    [StringLength(1000)]
    public string? Unit_Rate_In_Foreign_Currency { get; set; }

    [Unicode(false)]
    public string? Foreign_Currency { get; set; }

    [StringLength(1000)]
    public string? Duty_In_INR { get; set; }

    [Unicode(false)]
    public string? Importer_Name { get; set; }

    [Unicode(false)]
    public string? Importer_Address { get; set; }

    [Unicode(false)]
    public string? Foreign_Exporter_Name { get; set; }

    [Unicode(false)]
    public string? Country_Of_Origin { get; set; }

    [Unicode(false)]
    public string? Part_Of_Destination { get; set; }

    [Unicode(false)]
    public string? Mode { get; set; }

    [Unicode(false)]
    public string? Month { get; set; }

    [StringLength(1000)]
    public string? Year { get; set; }
}
