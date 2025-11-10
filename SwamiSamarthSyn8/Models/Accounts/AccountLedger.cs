using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models
{
    public class AccountLedger
    {
        [Key]
        public int AccountLedgerId { get; set; }
        public string AccountLedgerName { get; set; }
        public string AccountLedgerNarration { get; set; }
        public bool IsActive { get; set; }
    }
}
