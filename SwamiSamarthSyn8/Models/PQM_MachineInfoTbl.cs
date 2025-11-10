using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Models;

[Table("PQM_MachineInfoTbl")]
public partial class PQM_MachineInfoTbl
{
    [Key]
    public int ID { get; set; }

    [Column("Machine Code No")]
    [StringLength(500)]
    public string? Machine_Code_No { get; set; }

    [Column("Machine Description")]
    [StringLength(500)]
    public string? Machine_Description { get; set; }

    [Column("Model Name")]
    [StringLength(500)]
    public string? Model_Name { get; set; }

    [Column("Machine Manufacturing Name")]
    [StringLength(500)]
    public string? Machine_Manufacturing_Name { get; set; }

    [Column("Year of Manufacturing")]
    public DateOnly? Year_of_Manufacturing { get; set; }

    [Column("Year of Commissionring")]
    public DateOnly? Year_of_Commissionring { get; set; }

    [Column("Unit of Measurement")]
    [StringLength(500)]
    public string? Unit_of_Measurement { get; set; }

    [Column("Place of Commissionring")]
    [StringLength(500)]
    public string? Place_of_Commissionring { get; set; }

    [Column("Machine Name Plate Capacity")]
    [StringLength(500)]
    public string? Machine_Name_Plate_Capacity { get; set; }

    [Column("Machine Mfg Contact Details")]
    [StringLength(500)]
    public string? Machine_Mfg_Contact_Details { get; set; }

    [StringLength(500)]
    public string? Contact_Person { get; set; }

    [StringLength(500)]
    public string? Contact_Number { get; set; }

    [StringLength(500)]
    public string? Email { get; set; }

    [StringLength(500)]
    public string? Address { get; set; }

    [Column("Cost of Machine")]
    [StringLength(500)]
    public string? Cost_of_Machine { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? Company_Name { get; set; }

    [StringLength(500)]
    [Unicode(false)]
    public string? Location { get; set; }

    [StringLength(500)]
    public string? Service_Manual { get; set; }

    [StringLength(500)]
    public string? Spare_Part_List { get; set; }

    [Column("Model Number")]
    [StringLength(500)]
    public string? Model_Number { get; set; }

    [StringLength(500)]
    public string? WorkingDaysPerYear { get; set; }

    [StringLength(500)]
    public string? AnnualCapacity { get; set; }
}
