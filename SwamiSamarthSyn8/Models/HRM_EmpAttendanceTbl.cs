using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("HRM_EmpAttendanceTbl")]
public partial class HRM_EmpAttendanceTbl
{
    [Key]
    public int EmployeeID { get; set; }

    [StringLength(100)]
    public string? Employee_Name { get; set; }

    [StringLength(1000)]
    public string? Date { get; set; }

    [StringLength(50)]
    public string? Shift { get; set; }

    [StringLength(50)]
    public string? Time_In { get; set; }

    public string? Time_In_Image { get; set; }

    [StringLength(50)]
    public string? Time_Out { get; set; }

    public string? Time_Out_Image { get; set; }

    [StringLength(100)]
    public string? Status { get; set; }

    [StringLength(50)]
    public string? Logged_Hours { get; set; }
}
