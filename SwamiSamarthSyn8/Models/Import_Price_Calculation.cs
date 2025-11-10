using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("Import_Price_Calculation")]
public partial class Import_Price_Calculation
{
    [Key]
    public int Id { get; set; }

    public double? Fob_Price { get; set; }

    public double? Ocean_Freight { get; set; }

    public double? Insurance { get; set; }

    public double? Basic_Cif_Price { get; set; }

    public double? Custom_Duty { get; set; }

    public double? Cess_On_Custom { get; set; }

    public double? Price_At_Port { get; set; }

    public double? Exchange_Rate { get; set; }

    public double? Igst { get; set; }

    public double? Price_In_INR { get; set; }

    public double? Clearing_Charges { get; set; }

    public double? Freight_Upto_Buyer_Destination { get; set; }

    public double? Landed_Price_At_Plant { get; set; }

    public double? NETT_Of_Igst_Price { get; set; }

    public double? Insurance_Value { get; set; }

    public double? Igst_Value { get; set; }

    [Unicode(false)]
    public string? Name { get; set; }

    [Unicode(false)]
    public string? Grade { get; set; }

    [Unicode(false)]
    public string? Unit_Of_Measurement { get; set; }

    [Unicode(false)]
    public string? Currency { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ADD_In_Percentage { get; set; }

    public double? ADD_In_Value { get; set; }

    public double? Basic_Cif_Plus_ADD_Value { get; set; }
}
