using System.ComponentModel.DataAnnotations;

public class AccountSubSubGroup
{
    [Key]
    public int AccountSubSubGroupid { get; set; }

    [Required(ErrorMessage = "Subgroup ID is required")]
    public int AccountSubGroupid { get; set; }

    [Required(ErrorMessage = "Group ID is required")]
    public int AccountGroupid { get; set; }

    [Required(ErrorMessage = "Sub-Subgroup Name is required")]
    [StringLength(100, ErrorMessage = "Sub-Subgroup Name cannot exceed 100 characters")]
    public string AccountSubSubGroupName { get; set; }

    [StringLength(500, ErrorMessage = "Narration cannot exceed 500 characters")]
    public string AccountSubSubGroupNarration { get; set; }

    public bool IsActive { get; set; } = true;
    public virtual AccountSubGroup AccountSubGroup { get; set; }

}
