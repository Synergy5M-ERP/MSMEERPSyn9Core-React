using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SwamiSamarthSyn8.Models.Accounts
{
    [Table("Master_VendorCategory")]
    public class Master_VendorCategory
    {
        [Key]
        public int VendorCategoryId { get; set; }

        public string? VendorCategory { get; set; }

        public bool IsActive { get; set; }
    }
}