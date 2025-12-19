using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

    [ForeignKey("AccountSubGroupid")]
    public virtual AccountSubGroup AccountSubGroup { get; set; }

    [Required]
    [StringLength(100)]
    public string AccountSubSubGroupName { get; set; }

    [StringLength(500)]
    public string AccountSubSubGroupNarration { get; set; }

    public bool IsActive { get; set; } = true;

}
