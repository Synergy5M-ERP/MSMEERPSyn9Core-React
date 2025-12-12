using System;

public class AccountGRNDetails
{

    public int AccountGRNDetailsId { get; set; }
    public int AccountGRNId { get; set; }
    public int ItemId { get; set; }
    public int ReceivedQty { get; set; }
    public int ApprovedQty { get; set; }
    public int DamagedQty { get; set; }
    public string Unit { get; set; }
    public string TaxType { get; set; }
    public decimal? CGST { get; set; }
    public decimal? SGST { get; set; }
    public decimal? IGST { get; set; }
    public string Description { get; set; }

    // Navigation property
    public virtual AccountGRN GRN { get; set; }
    public string? Item_Code { get; set; }
    public string? Item_Grade { get; set; }
    public decimal? TotalAmount { get; set; }
    public decimal? TotalTaxAmount { get; set; }
    public bool? BillApprove { get; set; }

}
