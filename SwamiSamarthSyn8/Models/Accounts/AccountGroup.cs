using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SwamiSamarthSyn8.Models.Accounts
{
    [Table("AccountGroup")]
    public class AccountGroup
    {
        [Key]
        public int AccountGroupid { get; set; }

        [Required]
        [MaxLength(100)]
        public string AccountGroupName { get; set; }

        [MaxLength(500)]
        public string AccountGroupNarration { get; set; }

        public bool IsActive { get; set; } = true;

        [MaxLength(50)]
        public string GroupCode { get; set; }

        // Foreign key
        [Required]
        public int AccountTypeid { get; set; }

        // Navigation properties
        [JsonIgnore]
        public virtual AccountType? AccountType { get; set; }  // nullable

        [JsonIgnore]
        public virtual ICollection<AccountSubGroup>? AccountSubGroups { get; set; } // nullable
    }
}
