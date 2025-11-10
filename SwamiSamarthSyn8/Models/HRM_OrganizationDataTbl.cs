using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("HRM_OrganizationDataTbl")]
public partial class HRM_OrganizationDataTbl
{
    [Key]
    public int Id { get; set; }

    public string? Position_Code { get; set; }

    [StringLength(50)]
    public string? Source { get; set; }

    [StringLength(50)]
    public string? Continent { get; set; }

    [StringLength(50)]
    public string? Country { get; set; }

    [StringLength(50)]
    public string? State { get; set; }

    [StringLength(50)]
    public string? City { get; set; }

    [StringLength(50)]
    public string? Level { get; set; }

    public string? Company_Name { get; set; }

    [StringLength(50)]
    public string? Department { get; set; }

    [StringLength(50)]
    public string? Department_Code { get; set; }

    [StringLength(50)]
    public string? Designation { get; set; }

    [StringLength(50)]
    public string? Designation_Code { get; set; }

    [StringLength(50)]
    public string? ReportingTo { get; set; }

    [StringLength(50)]
    public string? Authority_Matrix { get; set; }

    public string? Authority_Code { get; set; }

    [StringLength(50)]
    public string? Filled_Or_Vacant { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? RP_Department { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? RP_DepartmentCode { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? RP_Designation { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? RP_DesignationCode { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? RP_Authority { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? RP_AuthorityCode { get; set; }

    [StringLength(100)]
    [Unicode(false)]
    public string? Employee_Name { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? Reporting_EmployeeName { get; set; }

    [StringLength(50)]
    [Unicode(false)]
    public string? Emp_Code { get; set; }

    [StringLength(50)]
    public string? Email_Id { get; set; }

    public int? DesignationId { get; set; }

    [StringLength(50)]
    public string? Report_Email { get; set; }
}
