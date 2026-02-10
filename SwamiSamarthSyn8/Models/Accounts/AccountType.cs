using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SwamiSamarthSyn8.Models.Accounts
{
    [Table("AccountType")]
    public class AccountType
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AccountTypeId { get; set; }

        [StringLength(200)]
        public string? AccountTypeName { get; set; }

        [StringLength(200)]
        public string? AccountTypeNarration { get; set; }
        public string? AccountTypeCode { get; set; }

        public bool? IsActive { get; set; }
        public virtual ICollection<AccountGroup> AccountGroups { get; set; }

    }
}
