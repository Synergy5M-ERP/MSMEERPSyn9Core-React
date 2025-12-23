using SwamiSamarthSyn8.Models.Accounts;
using System;
using System.Collections.Generic;

public class AccountGRN
{
    public int AccountGRNId { get; set; }
    public int VendorId { get; set; }
    public string GRNNumber { get; set; }
    public DateTime? GRNDate { get; set; }
    public string InvoiceNumber { get; set; }  // renamed from InvoiceAndPONo
    public string PONumber { get; set; }       // new column
    public DateTime? InvoiceDate { get; set; }
    public string Status { get; set; }
    public string VehicleNo { get; set; }
    public decimal? TotalAmount { get; set; }
    public decimal? TotalTaxAmount { get; set; }
    public decimal? GrandAmount { get; set; }
    public string Description { get; set; }
    public int CreatedBy { get; set; }
    public DateTime CreatedDate { get; set; }
    public int UpdatedBy { get; set; }
    public DateTime? UpdatedDate { get; set; }
    public bool IsActive { get; set; }
    public DateTime? PODate { get; set; }
    public DateTime? PaymentDueDate { get; set; }
    public string TransporterName { get; set; }
   

    // Navigation property
    public virtual ICollection<AccountGRNDetails> GRNDetails { get; set; }
    public string BillStatus { get; set; }   // if it’s varchar/nvarchar
}
