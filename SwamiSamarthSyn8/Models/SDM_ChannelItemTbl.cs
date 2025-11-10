using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("SDM_ChannelItemTbl")]
public partial class SDM_ChannelItemTbl
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

    public int? Qty { get; set; }

    [StringLength(100)]
    public string? TaxApp { get; set; }

    [StringLength(100)]
    public string? PaymentTerms { get; set; }

    [StringLength(100)]
    public string? PriceBasis { get; set; }

    public int? MOQ { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? OfferValidTill { get; set; }

    [StringLength(100)]
    public string? Drg_TDS_Attachement { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? offervalue { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? QuotationDate { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? DisValue { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Total_Tax_Value { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Total_Value { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? DiscountPrice { get; set; }

    public int? Id { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Shipment_By { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Price { get; set; }

    [StringLength(100)]
    public string? enq_ItemName { get; set; }

    [StringLength(100)]
    public string? enq_Itemcode { get; set; }

    [StringLength(1000)]
    [Unicode(false)]
    public string? enq_Grade { get; set; }

    [StringLength(100)]
    public string? enq_UOM { get; set; }

    [StringLength(100)]
    public string? enq_Currency { get; set; }

    public int? enq_Qty { get; set; }

    [StringLength(100)]
    public string? enq_TaxApp { get; set; }

    [StringLength(100)]
    public string? enq_PaymentTerms { get; set; }

    [StringLength(100)]
    public string? enq_PriceBasis { get; set; }

    public int? enq_MOQ { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? enq_OfferValidTill { get; set; }

    [StringLength(100)]
    public string? enq_Drg_TDS_Attachement { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? enq_offervalue { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? enq_QuotationDate { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? enq_DisValue { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? enq_Total_Tax_Value { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? enq_Total_Value { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? enq_DiscountPrice { get; set; }

    public int? enq_Id { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? enq_Shipment_By { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? enq_Price { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? enq_TaxRate { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? QuotationNumber { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? HsCode { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? enq_HsCode { get; set; }

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
    public string? SoPrice { get; set; }

    [StringLength(100)]
    public string? SoQuality { get; set; }

    [StringLength(100)]
    public string? SoPayments { get; set; }

    [StringLength(100)]
    public string? SoDelivery { get; set; }

    [StringLength(100)]
    public string? SoOther { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? SoPending { get; set; }

    [ForeignKey("Id")]
    [InverseProperty("SDM_ChannelItemTbls")]
    public virtual SDM_ChannelVendTbl? IdNavigation { get; set; }
}
