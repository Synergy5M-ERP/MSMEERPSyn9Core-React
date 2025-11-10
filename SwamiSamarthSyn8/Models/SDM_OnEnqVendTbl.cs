using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("SDM_OnEnqVendTbl")]
public partial class SDM_OnEnqVendTbl
{
    [Key]
    public int VendId { get; set; }

    [StringLength(150)]
    public string? Company_Name { get; set; }

    [StringLength(150)]
    public string? Gst_no { get; set; }

    [StringLength(100)]
    public string? Contact_Person { get; set; }

    [StringLength(100)]
    public string? Email { get; set; }

    [StringLength(20)]
    public string? Contact_No { get; set; }

    [StringLength(100)]
    public string? EnqNo { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? EnqDate { get; set; }

    [InverseProperty("Vend")]
    public virtual ICollection<SDM_OnEnqItemTbl> SDM_OnEnqItemTbls { get; set; } = new List<SDM_OnEnqItemTbl>();
}
