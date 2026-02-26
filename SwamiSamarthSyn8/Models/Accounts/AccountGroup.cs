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

        public string AccountGroupName { get; set; }

        // ✅ Tell EF this is FK
        [ForeignKey("AccountPrimaryGroup")]
        public int PrimaryGroupId { get; set; }

        public string? AccountGroupCode { get; set; }

        public string? AccountGroupNarration { get; set; }

        public bool IsActive { get; set; }

        // ✅ Navigation
        public virtual AccountPrimaryGroup? AccountPrimaryGroup { get; set; }

        public virtual ICollection<AccountSubGroup>? AccountSubGroups { get; set; }
    }
}