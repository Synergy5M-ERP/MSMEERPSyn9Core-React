using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SwamiSamarthSyn8.Models.Accounts
{
    public class AccountPaymentAllocation
    {
        [Key]   // ✅ PRIMARY KEY
        public int PaymentAllocateId { get; set; }
        public string? GRNNo { get; set; }
        public DateTime? GRNDate { get; set; }
        public string? PurchaseNo { get; set; }
        public DateTime? PaymentDueDate { get; set; }
        public int VendorId { get; set; }

        public decimal? CGST { get; set; }
        public decimal? SGST { get; set; }
        public decimal? IGST { get; set; }

        public decimal TotalTaxAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal BalanceAmount { get; set; }

        public string? RTGSNo { get; set; }
        public decimal? RTGSAmount { get; set; }
        public DateTime? RTGSDate { get; set; }

        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public bool? IsBalanceNil { get; set; }

        public string? InvoiceNo { get; set; }

        [Column(TypeName = "date")]
        public DateTime? InvoiceDate { get; set; }
        public DateTime? Date { get; set; }

        public int? SubLedgerId { get; set; }

        public int? BankId { get; set; }

        public string? VendorCode { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool IsVoucherDone { get; set; }
        public string? GST_No { get; set; }

     
        public bool? IsGSTRecoDone { get; set; }
    }
}
