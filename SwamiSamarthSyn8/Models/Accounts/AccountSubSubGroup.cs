using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SwamiSamarthSyn8.Models.Accounts
{
    public class AccountSubSubGroup
    {
        [Key]
        public int AccountSubSubGroupid { get; set; }

        // FK to SubGroup
        [Required]
        public int AccountSubGroupid { get; set; }

        // FK to Group
        [Required]
        public int AccountGroupid { get; set; }

        [StringLength(100)]
        [Required]
        public string AccountSubSubGroupName { get; set; }

        [StringLength(500)]
        public string AccountSubSubGroupNarration { get; set; }
        public string AccountSubSubGroupCode { get; set; }

        public bool? IsActive { get; set; } = true;

        // 🔥 IMPORTANT FIX
        [ForeignKey("AccountSubGroupid")]
        [JsonIgnore]                     // ignore during POST
        public virtual AccountSubGroup? AccountSubGroup { get; set; }
    }
}
