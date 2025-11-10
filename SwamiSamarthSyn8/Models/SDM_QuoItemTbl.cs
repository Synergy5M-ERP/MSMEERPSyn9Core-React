using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("SDM_QuoItemTbl")]
public partial class SDM_QuoItemTbl
{
    [Key]
    public int ItemId { get; set; }

    [StringLength(100)]
    public string? ItemName { get; set; }

    [StringLength(100)]
    public string? Itemcode { get; set; }

    [StringLength(1000)]
    [Unicode(false)]
    public string? Grade { get; set; }

    [StringLength(100)]
    public string? UOM { get; set; }

    [StringLength(100)]
    public string? Currency { get; set; }

    [StringLength(100)]
    public string? OfferedPrice { get; set; }

    [StringLength(100)]
    public string? OfferedQty { get; set; }

    [StringLength(100)]
    public string? Tax { get; set; }

    [StringLength(100)]
    public string? ShippedBy { get; set; }

    [StringLength(100)]
    public string? PaymentTerms { get; set; }

    [StringLength(100)]
    public string? PriceBasis { get; set; }

    [StringLength(100)]
    public string? MOQ { get; set; }

    [StringLength(100)]
    public string? OfferValidity { get; set; }

    [StringLength(100)]
    public string? Drg_TDS_Attachement { get; set; }

    [StringLength(200)]
    public string? PricePerUnit { get; set; }

    [StringLength(100)]
    public string? Value { get; set; }

    [StringLength(100)]
    public string? Discount_In_Percent { get; set; }

    [StringLength(100)]
    public string? Discount_In_Value { get; set; }

    [StringLength(100)]
    public string? Discounted_Price { get; set; }

    [StringLength(100)]
    public string? Tax_Applicable { get; set; }

    [StringLength(100)]
    public string? Tax_Percent { get; set; }

    [StringLength(100)]
    public string? Tax_Value { get; set; }

    [StringLength(100)]
    public string? Total_Item_Cost { get; set; }

    [StringLength(100)]
    public string? Total_Quotation_Value { get; set; }

    public int? HS_Code { get; set; }

    [StringLength(100)]
    public string? IGST_Value { get; set; }

    [StringLength(100)]
    public string? CGST_Value { get; set; }

    [StringLength(100)]
    public string? SGST_Value { get; set; }

    [StringLength(100)]
    public string? ReqQty { get; set; }

    [StringLength(100)]
    public string? ReqBy { get; set; }

    [StringLength(100)]
    public string? SoPrice { get; set; }

    [StringLength(100)]
    public string? SoPayments { get; set; }

    [StringLength(100)]
    public string? SoQuality { get; set; }

    [StringLength(100)]
    public string? SoOther { get; set; }

    [StringLength(100)]
    public string? SoDelivery { get; set; }

    [StringLength(100)]
    public string? SoPending { get; set; }

    public int? Igst_Rate { get; set; }

    public int? Cgst_Rate { get; set; }

    public int? Sgst_Rate { get; set; }

    [InverseProperty("Item")]
    public virtual ICollection<SDM_QuoVendItemTbl> SDM_QuoVendItemTbls { get; set; } = new List<SDM_QuoVendItemTbl>();
}
