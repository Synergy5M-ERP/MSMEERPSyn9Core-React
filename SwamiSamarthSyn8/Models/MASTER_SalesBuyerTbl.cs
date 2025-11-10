using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("MASTER_SalesBuyerTbl")]
public partial class MASTER_SalesBuyerTbl
{
    [Key]
    public int Id { get; set; }

    [StringLength(500)]
    public string? Vendor_Code { get; set; }

    [StringLength(500)]
    public string? industry { get; set; }

    [StringLength(500)]
    public string? Category { get; set; }

    [StringLength(500)]
    public string? Sub_Category { get; set; }

    [StringLength(500)]
    public string? Source { get; set; }

    [StringLength(500)]
    public string? Continent { get; set; }

    [StringLength(500)]
    public string? Country { get; set; }

    [Column("State/Province")]
    [StringLength(500)]
    public string? State_Province { get; set; }

    [StringLength(500)]
    public string? City { get; set; }

    [StringLength(500)]
    public string? Company_Name { get; set; }

    [StringLength(500)]
    public string? Address { get; set; }

    public int? Pin { get; set; }

    [StringLength(500)]
    public string? Contact_Person { get; set; }

    [StringLength(500)]
    public string? Email { get; set; }

    [StringLength(255)]
    public string? Contact_Number { get; set; }

    [StringLength(255)]
    public string? Landline { get; set; }

    [StringLength(500)]
    public string? GST_Number { get; set; }

    [StringLength(500)]
    public string? Website { get; set; }

    [StringLength(500)]
    public string? Type_Of_Business { get; set; }

    [StringLength(500)]
    public string? Product_Catalouge { get; set; }

    public int? User_Id { get; set; }

    [StringLength(500)]
    public string? Zone { get; set; }
}
