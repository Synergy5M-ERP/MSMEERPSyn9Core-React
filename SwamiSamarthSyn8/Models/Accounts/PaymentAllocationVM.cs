namespace SwamiSamarthSyn8.Models.Accounts
{
     public class PaymentAllocationVM
    {
        public string? GRNNumber { get; set; }
        public DateTime? GRN_Date { get; set; }
        public DateTime? Due_Date { get; set; }
        public string? Supplier_Name { get; set; }
        public string? PO_No { get; set; }
        public string? Invoice_NO { get; set; }
        public decimal? Total_Amount { get; set; }
        public DateTime? Invoice_Date { get; set; }
        public string? Purchase_Date { get; set; }
        public string? RTGSNo { get; set; }
        public string? VendorCode { get; set; }
        public decimal? PaidAmount { get; set; }
        public decimal? BalanceAmount { get; set; }
        public DateTime? RTGSDate { get; set; }
        public bool? IsBalanceNil { get; set; }
        public bool HasAllocation { get; set; }
        public int SubLedgerId { get; set; }
        public int BankId { get; set; }
        public int? VendorId { get; set; }
        public int? GRNId { get; set; }

    }
}
