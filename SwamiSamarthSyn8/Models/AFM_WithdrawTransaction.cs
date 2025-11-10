using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("AFM_WithdrawTransaction")]
public partial class AFM_WithdrawTransaction
{
    [Key]
    public int Id { get; set; }

    public DateOnly Date { get; set; }

    [StringLength(255)]
    public string BankName { get; set; } = null!;

    [StringLength(50)]
    public string? ChequeNo { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Amount { get; set; }

    [StringLength(255)]
    public string PersonName { get; set; } = null!;

    public bool IsWithdrawal { get; set; }

    [StringLength(50)]
    public string? Currency { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal CumulativeWithdrawal { get; set; }
}
