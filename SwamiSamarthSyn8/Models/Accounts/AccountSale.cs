namespace SwamiSamarthSyn8.Models.Accounts
{
    public class AccountSale
    {
        public int AccountSaleId { get; set; }
        public int BuyerId { get; set; }
        public string InvoiceNo { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public string? PONumber { get; set; }
        public DateTime? PODate { get; set; }
        public string? VehicleNo { get; set; }
        public string? TranspoterName { get; set; }
        public DateTime? PaymentDueDate { get; set; }
        public decimal? TotalAmount { get; set; }
        public decimal? TotalTaxAmount { get; set; }
        public decimal? GrandAmount { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
        public bool IsActive { get; set; }
        public virtual List<AccountSaleDetails> Items { get; set; }
    }
}
