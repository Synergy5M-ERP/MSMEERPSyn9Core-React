using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("SDM_SOVendItemTbl")]
public partial class SDM_SOVendItemTbl
{
    [Key]
    public int Id { get; set; }

    public int SalesItemId { get; set; }

    public int SalesVendorId { get; set; }

    [StringLength(500)]
    public string? SalesOrderNumber { get; set; }

    [StringLength(500)]
    public string? SalesOrderCompany { get; set; }

    [StringLength(500)]
    public string? Emp_Code { get; set; }

    [StringLength(500)]
    public string? Email { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? Date { get; set; }

    [StringLength(100)]
    public string? QuotationNumber { get; set; }

    [StringLength(100)]
    public string? EnquiryNumber { get; set; }

    [StringLength(100)]
    public string? EnqDate { get; set; }

    [StringLength(50)]
    public string? IsDirectSo { get; set; }

    [ForeignKey("SalesItemId")]
    [InverseProperty("SDM_SOVendItemTbls")]
    public virtual SDM_SOItemTbl SalesItem { get; set; } = null!;

    [ForeignKey("SalesVendorId")]
    [InverseProperty("SDM_SOVendItemTbls")]
    public virtual SDM_SOVendTbl SalesVendor { get; set; } = null!;
}
