using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models
{
    public class AccountSubLedger
    {
        [Key]
        public int AccountLedgerSubid { get; set; }

        public int AccountLedgerid { get; set; }

        public int? VendorCategoryId { get; set; }

        public long? VendorId { get; set; }

        [Required]
        public string? AccountLedgerSubName { get; set; }

        [StringLength(20)]
        public string? AssetsCode { get; set; }

        public decimal? OpeningBal { get; set; }

        public decimal? ClosingBal { get; set; }

        [StringLength(50)]
        public string? MobileNo { get; set; }

        [StringLength(50)]
        public string? EmailId { get; set; }

        [StringLength(50)]
        public string? GSTNo { get; set; }

        [StringLength(500)]
        public string? Address { get; set; }

        public string? AccountLedgerSubNarration { get; set; }

        public bool IsActive { get; set; }
        public bool IsBank { get; set; }

        public virtual AccountLedger? AccountLedger { get; set; }
    }
}
