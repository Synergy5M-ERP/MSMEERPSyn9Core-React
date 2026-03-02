using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Accounts
{
    public class AccountPaymentAllocation
    {
        [Key]   // ✅ PRIMARY KEY
        public int PaymentAllocateId { get; set; }
        public string GRNNo { get; set; }
        public DateTime? GRNDate { get; set; }
        public string PurchaseNo { get; set; }
        public DateTime? PaymentDueDate { get; set; }
        public int VendorId { get; set; }

        public decimal CGST { get; set; }
        public decimal SGST { get; set; }
        public decimal IGST { get; set; }

        public decimal TotalTaxAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal BalanceAmount { get; set; }

        public string RTGSNo { get; set; }
        public decimal? RTGSAmount { get; set; }
        public DateTime? RTGSDate { get; set; }

        public string Description { get; set; }
        public bool IsActive { get; set; }
    }
}
