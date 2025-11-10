using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("SDM_QuoVendItemTbl")]
public partial class SDM_QuoVendItemTbl
{
    [Key]
    public int Id { get; set; }

    public int QutId { get; set; }

    public int ItemId { get; set; }

    [StringLength(50)]
    public string? QuotationNumber { get; set; }

    [StringLength(50)]
    public string? QuotationCompany { get; set; }

    [StringLength(50)]
    public string? Emp_Code { get; set; }

    [StringLength(50)]
    public string? Email { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? Date { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? QuotationAdd { get; set; }

    [ForeignKey("ItemId")]
    [InverseProperty("SDM_QuoVendItemTbls")]
    public virtual SDM_QuoItemTbl Item { get; set; } = null!;

    [ForeignKey("QutId")]
    [InverseProperty("SDM_QuoVendItemTbls")]
    public virtual SDM_QuoVendTbl Qut { get; set; } = null!;
}
