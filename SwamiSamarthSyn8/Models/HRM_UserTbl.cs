using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("HRM_UserTbl")]
public partial class HRM_UserTbl
{
    [Key]
    public int id { get; set; }

    [StringLength(50)]
    public string? username { get; set; }

    [StringLength(20)]
    public string? password { get; set; }

    public bool? AdminApprove { get; set; }

    public DateOnly? StartDate { get; set; }

    public int? NoOfDays { get; set; }

    public DateOnly? EndDate { get; set; }

    [StringLength(500)]
    public string? ResetToken { get; set; }

    public bool? IsSubscribed { get; set; }

    public bool? CHIEF_ADMIN { get; set; }

    public bool? SUPERADMIN { get; set; }

    public bool? DEPUTY_SUPERADMIN { get; set; }

    public bool? ADMIN { get; set; }

    public bool? DEPUTY_ADMIN { get; set; }

    public bool? USER { get; set; }

    [StringLength(50)]
    public string? UserRole { get; set; }

    public bool? MaterialManagement { get; set; }

    public bool? SalesAndMarketing { get; set; }

    public bool? HRAndAdmin { get; set; }

    public bool? AccountAndFinance { get; set; }

    public bool? Masters { get; set; }

    public bool? Dashboard { get; set; }

    public bool? ProductionAndQuality { get; set; }

    public bool? External_buyer_seller { get; set; }

    [StringLength(50)]
    public string? Emp_Code { get; set; }

    [StringLength(50)]
    public string? Power_Of_Authority { get; set; }
}
