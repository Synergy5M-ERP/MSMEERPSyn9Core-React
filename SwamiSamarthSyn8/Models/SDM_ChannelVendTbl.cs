using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("SDM_ChannelVendTbl")]
public partial class SDM_ChannelVendTbl
{
    [Key]
    public int Id { get; set; }

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

    [StringLength(100)]
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

    public int? ItemId { get; set; }

    [StringLength(100)]
    public string? BuyEnqNo { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? SName { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? SEmpCode { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? SAdd { get; set; }

    [StringLength(20)]
    [Unicode(false)]
    public string? SConatctNo { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? CompanyName { get; set; }

    [StringLength(60)]
    [Unicode(false)]
    public string? SEmail { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? BVendorCode { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? BEmail { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? BConatctNo { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Pin { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Zone { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? SGSTNO { get; set; }

    [InverseProperty("IdNavigation")]
    public virtual ICollection<SDM_ChannelItemTbl> SDM_ChannelItemTbls { get; set; } = new List<SDM_ChannelItemTbl>();
}
