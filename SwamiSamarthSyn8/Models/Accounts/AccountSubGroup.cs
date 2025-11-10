using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using SwamiSamarthSyn8.Models;

public class AccountSubGroup
{
    [Key]
    public int AccountSubGroupid { get; set; }
    [ForeignKey("AccountTypeid")]


    [Required(ErrorMessage = "Account Group ID is required")]
    public int AccountGroupid { get; set; }

    [Required(ErrorMessage = "Subgroup Name is required")]
    [StringLength(100, ErrorMessage = "Subgroup Name cannot exceed 100 characters")]
    public string AccountSubGroupName { get; set; }

    [StringLength(500, ErrorMessage = "Narration cannot exceed 500 characters")]
    public string AccountSubGroupNarration { get; set; }

    public bool IsActive { get; set; } = true;
    public virtual AccountGroup AccountGroup { get; set; }

}
