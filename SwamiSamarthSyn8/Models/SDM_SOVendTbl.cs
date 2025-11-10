using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("SDM_SOVendTbl")]
public partial class SDM_SOVendTbl
{
    [Key]
    public int SalesVendorId { get; set; }

    [StringLength(100)]
    public string? QuoDate { get; set; }

    [StringLength(50)]
    public string? PurchaseOrderNo { get; set; }

    [StringLength(100)]
    public string? PurchaseDate { get; set; }

    [StringLength(100)]
    public string? Vendorcode { get; set; }

    [StringLength(100)]
    public string? VendorName { get; set; }

    [StringLength(100)]
    public string? Country { get; set; }

    [StringLength(100)]
    public string? Zone { get; set; }

    [StringLength(100)]
    public string? State { get; set; }

    [StringLength(100)]
    public string? City { get; set; }

    public int? Pin { get; set; }

    public string? Address { get; set; }

    [StringLength(100)]
    public string? ContactPerson { get; set; }

    [StringLength(100)]
    public string? ContactNo { get; set; }

    [StringLength(100)]
    public string? Email { get; set; }

    [StringLength(70)]
    public string? GstNo { get; set; }

    [InverseProperty("SalesVendor")]
    public virtual ICollection<SDM_SOVendItemTbl> SDM_SOVendItemTbls { get; set; } = new List<SDM_SOVendItemTbl>();
}
