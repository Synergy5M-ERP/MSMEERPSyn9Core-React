using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("TTR_ParameterTbl")]
public partial class TTR_ParameterTbl
{
    [Key]
    public int Parameter_Id { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Strength { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Elongation { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Tape_Width { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Total { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Average { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Elongation_Total { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Elongation_Avg { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Tape_Total { get; set; }

    [Column(TypeName = "decimal(18, 4)")]
    public decimal? Tape_Avg { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ActDenier { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Denier_Total { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? Denier_Avg { get; set; }

    [InverseProperty("Parameter")]
    public virtual ICollection<TTR_MachineTbl> TTR_MachineTbls { get; set; } = new List<TTR_MachineTbl>();
}
