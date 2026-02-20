using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models
{
    public class AccountLedger
    {
        [Key]
        public int AccountLedgerId { get; set; }
        public int PrimaryGroupId { get; set; }
        public int AccountGroupId { get; set; }
        public int AccountSubGroupId { get; set; }
        public int AccountSubSubGroupId { get; set; }
        public string AccountLedgerName { get; set; }
        public int GLCode { get; set; }
        public string? MobileNo { get; set; }
        public string? EmailId { get; set; }
        public string? GSTNo { get; set; }
        public decimal? OpeningBal { get; set; }
        public decimal? ClosingBal { get; set; }
        public string? Address { get; set; }
        public string? AccountLedgerNarration { get; set; }
        public bool IsActive { get; set; }
    }
}
