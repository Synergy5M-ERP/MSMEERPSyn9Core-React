namespace SwamiSamarthSyn8.Models.Accounts
{
    public class PaymentAllocationRequest
    {
        public int LedgerId { get; set; }
        public DateTime Date { get; set; }
        public List<PaymentAllocationDto> Payments { get; set; }
    }

    public class PaymentAllocationDto
    {
        public int AccountGRNId { get; set; }
        public long NonGrnInvoiceId { get; set; }
        public int SubLedgerId { get; set; }
        public int BankId { get; set; }
        public int VendorId { get; set; }

        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal BalanceAmount { get; set; }
        public string? InvoiceNo { get; set; }

        public decimal CGST { get; set; }
        public decimal SGST { get; set; }
        public decimal IGST { get; set; }
        public string? Source { get; set; }

        public string? RTGSNo { get; set; }
        public DateTime? RTGSDate { get; set; }
    }
}