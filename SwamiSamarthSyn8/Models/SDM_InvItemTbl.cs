using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("SDM_InvItemTbl")]
public partial class SDM_InvItemTbl
{
    [Key]
    public int product_id { get; set; }
    public int? supplied_id_id { get; set; }
    
    [ForeignKey("supplied_id_id")]
    public virtual SDM_Inv_VendTbl? supplied_id { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? HSNCode { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? ProductDiscription { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? references_no { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? supplier_batch { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? UOM { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Quantity { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? RatePerUnit { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? LessDiscount { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? net_amount { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Tax_Type { get; set; }

    public string? Tax_Rate { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Tax_Amount { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? total_amount { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? ItemCode { get; set; }

    [StringLength(1000)]
    [Unicode(false)]
    public string? Grade { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Currency { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Total_Item_Value { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Balance { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? SoQty { get; set; }

    [StringLength(500)]
    public string? MarksNoContainer { get; set; }

    [StringLength(500)]
    public string? Packaging { get; set; }

    [ForeignKey("supplied_id_id")]
    [InverseProperty("SDM_InvItemTbls")]
    //public virtual SDM_Inv_VendTbl? supplied_id { get; set; }
    public decimal? RejectedQty { get; set; }
}
