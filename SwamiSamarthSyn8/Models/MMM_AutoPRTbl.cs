using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("MMM_AutoPRTbl")]
public partial class MMM_AutoPRTbl
{
    [Key]
    public int Id { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Item_Name { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Unit_Of_Measurement { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Opening_Balance { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? MOQ { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Pending_PO { get; set; }

    [Column(TypeName = "decimal(18, 8)")]
    public decimal? RM_Req { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Enq_Pending { get; set; }

    [Column(TypeName = "decimal(18, 8)")]
    public decimal? QtyProcured { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? GreaterValue { get; set; }

    [StringLength(1000)]
    [Unicode(false)]
    public string? Grade { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Item_Code { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? PRNo { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? PRdate { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Currency { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Avg_Price { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? SalesOrderNumber { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? BalQtyAutoPr { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? AutoPRPending { get; set; }
}
