using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("MMM_EnquiryItemTbl")]
public partial class MMM_EnquiryItemTbl
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
    public string? TargetPrice { get; set; }

    [Column(TypeName = "decimal(18, 8)")]
    public decimal? Qty { get; set; }

    [StringLength(100)]
    public string? Tax { get; set; }

    [StringLength(100)]
    public string? RequireBy { get; set; }

    [StringLength(100)]
    public string? PaymentTerms { get; set; }

    [StringLength(100)]
    public string? PriceBasis { get; set; }

    [StringLength(100)]
    public string? MOQ { get; set; }

    [StringLength(100)]
    public string? EnquiryValidity { get; set; }

    [StringLength(100)]
    public string? Drg_TDS_Attachement { get; set; }

    [StringLength(50)]
    public string? Packing { get; set; }

    [StringLength(50)]
    public string? Stuffing { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Seller_Quotation_No { get; set; }

    [StringLength(100)]
    public string? QuotationDate { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? LessDis { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? DisValue { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Total_Tax_Value { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Fright { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Fright_Value { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Net_Gst_Value { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Total_Value { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? IGst_Tax_Amt { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? CGst_Tax_Amt { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? SGst_Tax_Amt { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Check { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? HsnCode { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? DiscountPrice { get; set; }

    [StringLength(400)]
    [Unicode(false)]
    public string? Total_Item_Value { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? Total_Po_Value { get; set; }

    [StringLength(50)]
    public string? PriCmpDate { get; set; }

    [StringLength(50)]
    public string? IsGrnDone { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? PRNo { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? BalEnqQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? BalQutQty { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? PR_Pending { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Po_Qty { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? PRType { get; set; }

    [StringLength(50)]
    public string? TaxPercentageIGST { get; set; }

    [StringLength(50)]
    public string? TaxPercentageSGST { get; set; }

    [StringLength(50)]
    public string? TaxPercentageCGST { get; set; }

    [InverseProperty("Item")]
    public virtual ICollection<MMM_EnquiryVendorItemTbl> MMM_EnquiryVendorItemTbls { get; set; } = new List<MMM_EnquiryVendorItemTbl>();
}
