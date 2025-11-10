using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace SwamiSamarthSyn8.Models
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

        // Foreign key to AccountType table
        [ForeignKey("AccountTypeid")]
        public int AccountTypeid { get; set; }
        public virtual AccountType AccountType { get; set; }

    }
}
