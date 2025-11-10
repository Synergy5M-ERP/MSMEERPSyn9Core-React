using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models
{
    public class AccountSubLedger
    {
        [Key]
        public int AccountLedgerSubid { get; set; }
        public int AccountLedgerid { get; set; }
        public string AccountLedgerSubName { get; set; }
        public string AccountLedgerSubNarration { get; set; }
        public bool IsActive { get; set; }
    }
}
