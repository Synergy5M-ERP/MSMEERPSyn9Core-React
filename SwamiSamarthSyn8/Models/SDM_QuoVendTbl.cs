using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("SDM_QuoVendTbl")]
public partial class SDM_QuoVendTbl
{
    [Key]
    public int QutId { get; set; }

    [StringLength(100)]
    public string VendorName { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime Date { get; set; }

    [StringLength(100)]
    public string? Vendorcode { get; set; }

    [StringLength(100)]
    public string? City { get; set; }

    [StringLength(100)]
    public string? Country { get; set; }

    [StringLength(100)]
    public string? State { get; set; }

    public string? Address { get; set; }

    [StringLength(100)]
    public string? GstNo { get; set; }

    [StringLength(100)]
    public string? Email { get; set; }

    [StringLength(100)]
    public string? ContactPerson { get; set; }

    [StringLength(100)]
    public string? ContactNo { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? QuotationCompany { get; set; }

    [StringLength(100)]
    public string? Zone { get; set; }

    public int? Pin { get; set; }

    [StringLength(100)]
    public string? PaymentTerms { get; set; }

    [StringLength(200)]
    public string? PriceBasis { get; set; }

    [StringLength(100)]
    public string? Tax { get; set; }

    [StringLength(100)]
    public string? OfferValidity { get; set; }

    [StringLength(200)]
    public string? ShippedBy { get; set; }

    [StringLength(500)]
    public string? EnquiryNo { get; set; }

    [StringLength(50)]
    public string? DateEnq { get; set; }

    [StringLength(200)]
    public string? Emp_Code { get; set; }

    [StringLength(50)]
    public string? IsQuotDone { get; set; }

    [InverseProperty("Qut")]
    public virtual ICollection<SDM_QuoVendItemTbl> SDM_QuoVendItemTbls { get; set; } = new List<SDM_QuoVendItemTbl>();
}
