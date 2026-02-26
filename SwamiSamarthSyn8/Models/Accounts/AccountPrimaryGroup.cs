using SwamiSamarthSyn8.Models.Accounts;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Accounts
{
    [Table("AccountPrimaryGroup")]
    public class AccountPrimaryGroup
    {
        [Key]
    public int PrimaryGroupId { get; set; }   // ✅ NOT NULLABLE

        [StringLength(200)]
        public string? AccountPrimaryGroupName { get; set; }

    public string? Type { get; set; }

    public int? PrimaryGroupCode { get; set; }

        public string? Description { get; set; }

    public bool IsActive { get; set; }

    public virtual ICollection<AccountGroup>? AccountGroups { get; set; }
}
