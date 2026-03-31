using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class AccountNonGRNInvoiceDetails
{
    [Key]
    public long NonGrnDetailsId { get; set; }

    public long? NonGrnId { get; set; }

    public string Itemname { get; set; }

    public decimal? Qty { get; set; }

    public decimal? BasicAmount { get; set; }

    public string TaxType { get; set; }

    public decimal? SGST { get; set; }
    public decimal? CGST { get; set; }
    public decimal? IGST { get; set; }

    public decimal? TaxAmount { get; set; }
    public decimal? TotalValue { get; set; }

    public string Description { get; set; }

    public int? LedgerId { get; set; }

    public string TaxRate { get; set; }

    [JsonIgnore]
    [ForeignKey("NonGrnId")]   // ⭐ IMPORTANT

    [ValidateNever]
    public AccountNonGRNInvoice Invoice { get; set; }
}