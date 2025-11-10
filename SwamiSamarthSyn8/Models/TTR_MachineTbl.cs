using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("TTR_MachineTbl")]
public partial class TTR_MachineTbl
{
    [Key]
    public int Machine_Id { get; set; }

    [StringLength(150)]
    public string? Machine_Name { get; set; }

    [StringLength(150)]
    public string? Location { get; set; }

    public string? Machine_No { get; set; }

    public int? Item_Id { get; set; }

    public int? Parameter_Id { get; set; }

    [ForeignKey("Item_Id")]
    [InverseProperty("TTR_MachineTbls")]
    public virtual TTR_ItemTbl? Item { get; set; }

    [ForeignKey("Parameter_Id")]
    [InverseProperty("TTR_MachineTbls")]
    public virtual TTR_ParameterTbl? Parameter { get; set; }
}
