using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("MMM_GRNTbl")]
public partial class MMM_GRNTbl
{
    [Key]
    public int Id { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? GRN_NO { get; set; }

    public DateOnly? GRN_Date { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Supplier_Name { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? Supplier_Address { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? GE_NO { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? BILL_NO { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? Invoice_NO { get; set; }

    public DateOnly? BILL_Date { get; set; }

    public DateOnly? Invoice_Date { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? LR_NO { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Transporter { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Vehicle_No { get; set; }

    [StringLength(300)]
    [Unicode(false)]
    public string? Prepared_By { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Checked_By { get; set; }

    [StringLength(200)]
    [Unicode(false)]
    public string? Approved_By { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Supplier_Email { get; set; }

    [StringLength(50)]
    public string? PO_No { get; set; }

    public DateOnly? Payment_Due_On { get; set; }

    public DateOnly? QC_Clearance_Date { get; set; }

    [InverseProperty("G_IdNavigation")]
    public virtual ICollection<MMM_GRNProductTbl> MMM_GRNProductTbls { get; set; } = new List<MMM_GRNProductTbl>();
}
