namespace SwamiSamarthSyn8.Models.Accounts
{
    public class GRNApprovedDto
    {
        public int AccountGRNId { get; set; }
        public string GRNNumber { get; set; }
        public DateTime? GRNDate { get; set; }
        public string VendorName { get; set; }
        public string PONumber { get; set; }
        public string InvoiceNumber { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public decimal CGST { get; set; }
        public decimal SGST { get; set; }
        public decimal IGST { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }        // ✅ ADD
        public decimal BalanceAmount { get; set; }
    }
}
