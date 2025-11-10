using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("MMM_PurchaseReqTbl")]
public partial class MMM_PurchaseReqTbl
{
    [Key]
    public int Id { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? DepartmentName { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? EmpCode { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? EmpName { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? TypeOfRequision { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? PlantLocation { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? PlantNo { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? RequireBy { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? PurchaseReqNo { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? Date { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? DepartmentCode { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? CreatedBy { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? CheckedBy { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? ApprovedBy { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? BudgetAllocated { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? BudgetBalance { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? TotalValue { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? TotalBudgetAvalable { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Balance { get; set; }

    [InverseProperty("IdNavigation")]
    public virtual ICollection<MMM_PrItemTbl> MMM_PrItemTbls { get; set; } = new List<MMM_PrItemTbl>();
}
