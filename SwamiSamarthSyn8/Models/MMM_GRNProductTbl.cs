using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("MMM_GRNProductTbl")]
public partial class MMM_GRNProductTbl
{
    [Key]
    public int G_Product_Id { get; set; }

    public int? G_Id { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Item_Code { get; set; }

    [StringLength(1000)]
    [Unicode(false)]
    public string? Item_Descrpition { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? Dept_Name { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? UOM { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Challan_Qty { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Received_Qty { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? short_Qty { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Excess_Qty { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Rejected_Qty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Accepted_Qty { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Rate { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Discount { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Total_Value { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? RatePerUnit { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Quntity { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? TaxType { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? TaxRate { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? TaxAmount { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? NetAmount { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Cummulativ_Qty { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? PO_Balannce { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Purchase_Date { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Employee_Code { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? PO_No { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? POID { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? Cgst_Tax_Amt { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? Igst_Tax_Amt { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? Sgst_Tax_Amt { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Item_Name { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Currency { get; set; }

    public DateOnly? Expiry_Date { get; set; }

    [StringLength(500)]
    public string? Payment_Due_On { get; set; }

    public int? QtyTobeRepaired { get; set; }

    [StringLength(50)]
    public string? IGSTtaxrate { get; set; }

    [StringLength(50)]
    public string? CGSTtaxrate { get; set; }

    [StringLength(50)]
    public string? SGSTtaxrate { get; set; }

    [StringLength(500)]
    public string? BatchNo { get; set; }

    [StringLength(500)]
    public string? ARNo { get; set; }

    public bool IsSubmitted { get; set; }

    [ForeignKey("G_Id")]
    [InverseProperty("MMM_GRNProductTbls")]
    public virtual MMM_GRNTbl? G_IdNavigation { get; set; }
}
