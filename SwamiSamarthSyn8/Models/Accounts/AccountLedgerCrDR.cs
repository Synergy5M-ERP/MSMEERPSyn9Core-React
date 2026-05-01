using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Accounts
{
    public class AccountLedgerCrDR
    {
        [Key]
        public long LedgerCrDrId { get; set; }

        public long? LedegrId { get; set; }
        public string? InvoiceNO { get; set; }

        [Column(TypeName = "date")]
        public DateTime? Date { get; set; }
        [Column(TypeName = "date")]
        public DateTime? InvoiceDate { get; set; }
        public long? InvoiceId { get; set; }

     
        public long? SubLedgerId { get; set; }

        public decimal? OpeningBalance { get; set; }

        public decimal? ClosingBalance { get; set; }
        public decimal? Credit { get; set; }
        public decimal? Debit { get; set; }

        public long? VoucherId { get; set; }
        public decimal? SubClosingBal { get; set; }
        public decimal? SubOpeningBal { get; set; }
    }
}
