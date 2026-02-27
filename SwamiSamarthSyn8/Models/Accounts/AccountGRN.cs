using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("AccountGRN")]
public class AccountGRN
{
    [Key]
    public int AccountGRNId { get; set; }

    public int VendorId { get; set; }

    public string? GRNNumber { get; set; }

    public string? InvoiceNumber { get; set; }

    public string? Description { get; set; }

    public int CreatedBy { get; set; }

    public DateTime CreatedDate { get; set; }

    public int UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public bool? CheckGRN { get; set; }

    public bool? ApprovedGRN { get; set; }

    //[Column("Total_Amount")]
    public decimal? Total_Amount { get; set; }

    public decimal? SGSTAmount { get; set; }

    public decimal? CGSTAmount { get; set; }

    public decimal? IGSTAmount { get; set; }

    public bool IsActive { get; set; }
}