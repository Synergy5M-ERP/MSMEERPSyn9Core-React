
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("Potential_Vendor")]
public partial class Potential_Vendor
{
    [Key]
    public int Id { get; set; }

    public string? Vendor_Code { get; set; }
    public string? industry { get; set; }
    public string? Category { get; set; }
    public string? Sub_Category { get; set; }
    public string? Source { get; set; }
    public string? Continent { get; set; }
    public string? Country { get; set; }

    [Column("State/Province")]
    public string? State_Province { get; set; }

    public string? City { get; set; }
    public string? Company_Name { get; set; }
    public string? Address { get; set; }
    public string? Address1 { get; set; }      // ✅ ADD
    public string? Pin { get; set; }
    public string? Contact_Person { get; set; }
    public string? Email { get; set; }
    public string? Contact_Number { get; set; }
    public string? Landline { get; set; }
    public string? GST_Number { get; set; }
    public string? Website { get; set; }
    public string? CurrentAcNo { get; set; }
    public string? Branch { get; set; }
    public string? Bank_Name { get; set; }
    public string? IFSC_No { get; set; }
    public string? CIN_No { get; set; }
    public string? MSME_No { get; set; }
    public string? State_Code { get; set; }
    public string? Std_Payment_Days { get; set; }
    public string? PAN_No { get; set; }         // ✅ IMPORTANT — used in TDS logic
    public string? GLCode { get; set; }
    public string? LedgerName { get; set; }
    public string? TDSSection { get; set; }     // ✅ ADD

    public int? VendorCategoryId { get; set; }
    public int? VendorSubCategoryId { get; set; }
    public bool? IsTDSApplicable { get; set; }
    public decimal? TDSRate { get; set; }
    public decimal? TDSLimit { get; set; }

    [NotMapped]
    public string? Vendor_Categories { get; set; }
}