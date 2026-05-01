using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class AccountNonGRNInvoice
{
    [Key]
    public long NonGrnInvoiceId { get; set; }

    public string? NonGrnInvoice { get; set; }

    public long? EmployeeId { get; set; }
    public int? VendorId { get; set; }

    public string? VendorCode { get; set; }
    public string? InvoiceNo { get; set; }
    public DateTime? InvoiceDate { get; set; }
    public DateTime? PayDueDate { get; set; }

    public decimal? TotalTaxAmount { get; set; }
    public decimal? TotalAmount { get; set; }

    public decimal? SGSTAmount { get; set; }
    public decimal? CGSTAmount { get; set; }
    public decimal? IGSTAmount { get; set; }

    public string? CheckNonGRNInvoice { get; set; }

    public bool? ApproveNonGRNInvoice { get; set; }

    public int CreatedBy { get; set; }
    public DateTime? CreatedDate { get; set; }

    public bool? IsActive { get; set; }

    [JsonIgnore]
    [ValidateNever]
    public AccountVendor? Vendor { get; set; }

    [JsonIgnore]
    [ValidateNever]
    public ICollection<AccountNonGRNInvoiceDetails>? InvoiceDetails { get; set; }
}