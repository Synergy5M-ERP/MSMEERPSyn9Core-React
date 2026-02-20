using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SwamiSamarthSyn8.Models.Accounts
{
    [Table("AccountPrimaryGroup")]
    public class AccountPrimaryGroup
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PrimaryGroupId { get; set; }

        [StringLength(200)]
        public string? AccountPrimaryGroupName { get; set; }

        [StringLength(200)]
        public string? Description { get; set; }
        public string? Type { get; set; }
        public int PrimaryGroupCode { get; set; }
        public bool? IsActive { get; set; }
        public virtual ICollection<AccountGroup> AccountGroups { get; set; }
    }
}
