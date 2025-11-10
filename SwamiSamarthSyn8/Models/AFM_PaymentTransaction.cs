using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("AFM_PaymentTransaction")]
public partial class AFM_PaymentTransaction
{
    [Key]
    public int Id { get; set; }

    public DateOnly PaymentDate { get; set; }

    [StringLength(50)]
    public string InvoiceNo { get; set; } = null!;

    public DateOnly InvoiceDate { get; set; }

    [StringLength(255)]
    public string PCompanyOrPPersonName { get; set; } = null!;

    [Column(TypeName = "decimal(18, 2)")]
    public decimal PaymentAmount { get; set; }

    [StringLength(500)]
    public string? ReasonForPayment { get; set; }

    [StringLength(50)]
    public string AmountCurrency { get; set; } = null!;

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ClosingBalance { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal CumulativePayment { get; set; }
}
