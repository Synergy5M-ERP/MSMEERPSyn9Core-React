namespace SwamiSamarthSyn8.Models.Accounts;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


public class AccountSubGroup
{
    [Key]
    public int AccountSubGroupid { get; set; }

    // Correct FK to AccountGroup
    [Required]
    public int AccountGroupid { get; set; }

    [ForeignKey("AccountGroupid")]
    public virtual AccountGroup? AccountGroup { get; set; }
    public string SubGroupCode { get; set; }

    [Required]
    [StringLength(100)]
    public string AccountSubGroupName { get; set; }

    [StringLength(500)]
    public string AccountSubGroupNarration { get; set; }
    public string AccountSubGroupCode { get; set; }

    public bool? IsActive { get; set; } = true;

    [JsonIgnore]   // 🔥 IMPORTANT
    public virtual ICollection<AccountSubSubGroup>? AccountSubSubGroups { get; set; }

}
