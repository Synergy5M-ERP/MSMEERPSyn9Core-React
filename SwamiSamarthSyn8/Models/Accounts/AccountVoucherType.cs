using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SwamiSamarthSyn8.Models
{
    [Table("AccountVoucherType")]
    public class AccountVoucherType
    {
        [Key]
        public int AccountVoucherTypeId { get; set; }

        [Required]
        [StringLength(200)]
        public string VoucherType { get; set; }

        [StringLength(500)]
        public string VoucherNarration { get; set; }

        public bool IsActive { get; set; }

        // ✅ Navigation property for related SubVoucherTypes (if applicable)
        public virtual ICollection<AccountSubVoucherType> AccountSubVoucherTypes { get; set; }
    }
}
