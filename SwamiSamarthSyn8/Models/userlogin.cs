using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("userlogin")]
public partial class userlogin
{
    [Key]
    public int id { get; set; }

    [StringLength(50)]
    public string? username { get; set; }

    [StringLength(10)]
    public string? password { get; set; }

    public bool? AdminApprove { get; set; }

    public DateOnly? StartDate { get; set; }

    public int? NoOfDays { get; set; }

    public DateOnly? EndDate { get; set; }

    [StringLength(500)]
    public string? ResetToken { get; set; }

    public bool? IsAdmin { get; set; }

    public bool? IsSubscribed { get; set; }

    public bool? IM { get; set; }

    public bool? VM { get; set; }

    public bool? INTM { get; set; }

    public bool? BOM { get; set; }

    public bool? LM { get; set; }

    public bool? CM { get; set; }

    public bool? EQY { get; set; }

    public bool? CQ { get; set; }

    public bool? PRSH { get; set; }

    public bool? SLS { get; set; }

    public bool? BTT { get; set; }

    public bool? AYT { get; set; }

    public bool? WWM { get; set; }

    public bool? PDTM { get; set; }

    [StringLength(50)]
    public string? UserRole { get; set; }

    public bool? OM { get; set; }

    public bool? IMSRCH { get; set; }

    public bool? IMCAL { get; set; }

    public bool? UOM { get; set; }

    public bool? MaterialManagement { get; set; }

    public bool? SalesAndMarketing { get; set; }

    public bool? HRAndAdmin { get; set; }

    public bool? AccountAndFinance { get; set; }

    public bool? Masters { get; set; }

    public bool? Dashboard { get; set; }

    public bool? ProductionAndQuality { get; set; }

    public bool? External_buyer_seller { get; set; }
}
