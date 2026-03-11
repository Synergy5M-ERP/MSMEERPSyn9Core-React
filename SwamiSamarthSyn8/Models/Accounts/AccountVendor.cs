using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

public class AccountVendor
{
    [Key]
    public long AccountVendorId { get; set; }

    public int? VendorCategoryId { get; set; }

    [MaxLength(250)]
    public string VendorName { get; set; }

    public string VendorCode { get; set; }
    public string Address { get; set; }

    [MaxLength(100)]
    public string City { get; set; }

    [MaxLength(50)]
    public string GSTNo { get; set; }

    [MaxLength(50)]
    public string EmailID { get; set; }

    [MaxLength(250)]
    public string ContactPerson { get; set; }

    [MaxLength(20)]
    public string ContactNo { get; set; }

    [MaxLength(50)]
    public string BanckName { get; set; }

    [MaxLength(250)]
    public string BranchName { get; set; }

    [MaxLength(50)]
    public string AccountNo { get; set; }

    public string IFSCCode { get; set; }

    public int? CreatedBy { get; set; }
    public DateTime? CreatedDate { get; set; }

    public bool? IsActive { get; set; }

    [JsonIgnore]
    [ValidateNever]
    public ICollection<AccountNonGRNInvoice> NonGRNInvoices { get; set; }
}