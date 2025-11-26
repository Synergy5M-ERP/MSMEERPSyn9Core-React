using System;

public class AccountGRNDetails
{
    public int AccountGRNDetailsId { get; set; }
    public int AccountGRNId { get; set; }
    public int ItemId { get; set; }
    public int ReceivedQty { get; set; }
    public decimal ApprovedQty { get; set; }
    public decimal DamagedQty { get; set; }
    public string Unit { get; set; }
    public string TaxType { get; set; }
    public decimal CGST { get; set; }
    public decimal SGST { get; set; }
    public decimal IGST { get; set; }
    public string Description { get; set; }

    // Navigation property
    public virtual AccountGRN GRN { get; set; }
}
