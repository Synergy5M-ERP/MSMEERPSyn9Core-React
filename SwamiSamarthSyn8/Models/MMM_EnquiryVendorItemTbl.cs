using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("MMM_EnquiryVendorItemTbl")]
public partial class MMM_EnquiryVendorItemTbl
{
    [Key]
    public int Id { get; set; }

    public int QutId { get; set; }

    public int ItemId { get; set; }

    [StringLength(50)]
    public string? EnquiryNumber { get; set; }

    [StringLength(50)]
    public string? BuyerName { get; set; }

    [StringLength(50)]
    public string? Email { get; set; }

    [StringLength(50)]
    public string? VendorCode { get; set; }

    [StringLength(50)]
    public string? DomesticorInternational { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? BAdd { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? BGst { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? BDate { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? BContactPerson { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? BContactNumber { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? DName { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? DAdd { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? DEmail { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Ddate { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? DContactPer { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? DContactNo { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? DGst { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? PODate { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? PONO { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? EnqDate { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? isPODone { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? SelectedPRNumber { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? PR_Pending { get; set; }

    [StringLength(200)]
    public string? Emp_Name { get; set; }

    [ForeignKey("ItemId")]
    [InverseProperty("MMM_EnquiryVendorItemTbls")]
    public virtual MMM_EnquiryItemTbl Item { get; set; } = null!;

    [ForeignKey("QutId")]
    [InverseProperty("MMM_EnquiryVendorItemTbls")]
    public virtual MMM_EnquiryVendorTbl Qut { get; set; } = null!;
}
