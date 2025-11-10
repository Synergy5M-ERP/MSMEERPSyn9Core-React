using System;
using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models
{
    public class AccountJournal
    {
        public int AccountJournalId { get; set; }

        [Required]
        public string JournalNo { get; set; }

        [Required]
        public DateTime JournalDate { get; set; }

        [Required]
        public decimal TotalDebitAmount { get; set; }

        [Required]
        public decimal TotalCreditAmount { get; set; }

        public string JournalNarration { get; set; }

        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }

        public string UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public bool IsActive { get; set; }
    }
}
