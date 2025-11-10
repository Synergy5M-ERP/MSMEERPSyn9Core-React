using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("MMM_EnquiryVendorTbl")]
public partial class MMM_EnquiryVendorTbl
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

    [StringLength(50)]
    [Unicode(false)]
    public string? Insurance { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Warranty { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? TestCertificate { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? SpecialRemark { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? PreparedBy { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? CheckedBy { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? ApprovedBy { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? IEC { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? BillToIEC { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? ShipTOIEC { get; set; }

    [InverseProperty("Qut")]
    public virtual ICollection<MMM_EnquiryVendorItemTbl> MMM_EnquiryVendorItemTbls { get; set; } = new List<MMM_EnquiryVendorItemTbl>();
}
