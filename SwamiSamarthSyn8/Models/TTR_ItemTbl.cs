using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("TTR_ItemTbl")]
public partial class TTR_ItemTbl
{
    [Key]
    public int Item_Id { get; set; }

    [Unicode(false)]
    public string? Name { get; set; }

    [Unicode(false)]
    public string? Grade { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? Date { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? Time { get; set; }

    [InverseProperty("Item")]
    public virtual ICollection<TTR_MachineTbl> TTR_MachineTbls { get; set; } = new List<TTR_MachineTbl>();
}
