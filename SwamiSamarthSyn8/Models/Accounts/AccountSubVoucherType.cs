using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SwamiSamarthSyn8.Models
{
    [Table("AccountSubVoucherType")]
    public class AccountSubVoucherType
    {
        [Key]
        public int AccountSubVoucherTypeId { get; set; }

            [Required]
            [ForeignKey("AccountVoucherType")]
        public int AccountVoucherTypeId { get; set; }

        [Required]
        [StringLength(200)]
        public string SubVoucherType { get; set; }

        [StringLength(500)]
        public string SubVoucherNarration { get; set; }

        public bool IsActive { get; set; }

        // ✅ Optional: Navigation Property (if AccountVoucherType table exists)
        public virtual AccountVoucherType AccountVoucherType { get; set; }
    }
}
