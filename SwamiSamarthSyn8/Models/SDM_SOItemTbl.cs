using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("SDM_SOItemTbl")]
public partial class SDM_SOItemTbl
{
    [Key]
    public int SalesItemId { get; set; }

    [StringLength(500)]
    public string? ItemName { get; set; }

    [StringLength(100)]
    public string? Itemcode { get; set; }

    [StringLength(1000)]
    [Unicode(false)]
    public string? Grade { get; set; }

    [StringLength(500)]
    public string? UOM { get; set; }

    [StringLength(100)]
    public string? HS_Code { get; set; }

    [StringLength(500)]
    public string? PricePerUnit { get; set; }

    [StringLength(500)]
    public string? SoQty { get; set; }

    [StringLength(500)]
    public string? SoValue { get; set; }

    [StringLength(500)]
    public string? LeadTime { get; set; }

    [StringLength(200)]
    public string? ExpecDeliveryDate { get; set; }

    [StringLength(200)]
    public string? Currency { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Dis_Value { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Discounted_Price { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Item_Value { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Tax_App { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Tax_Rate { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Tax_Value { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Total_Tax_value { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Total_Item_Cost { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Total_Quotation_Value { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? IGST_TaxValue { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? SGST_TaxValue { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? CGST_TaxValue { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Total_TaxValue { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? IGST_TaxRate { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? SGST_TaxRate { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? CGST_TaxRate { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? PriceBasis { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? PaymentTerms { get; set; }

    [StringLength(100)]
    public string? Plan_Production { get; set; }

    [StringLength(100)]
    public string? Actual_Plan { get; set; }

    [StringLength(500)]
    public string? Packaging { get; set; }

    [StringLength(500)]
    public string? MarksNoContainer { get; set; }

    [InverseProperty("SalesItem")]
    public virtual ICollection<SDM_SOVendItemTbl> SDM_SOVendItemTbls { get; set; } = new List<SDM_SOVendItemTbl>();
}
