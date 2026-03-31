using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SwamiSamarthSyn8.Models.Masters
{
   [Table("Master_ItemCategory")]   
    public class Master_ItemCategory
    {
        [Key]
        public int ItemCategoryId { get; set; }

        [Display(Name = "Item Category")]
        public string? ItemCategory { get; set; }

        [Display(Name = "Active Status")]
        public bool IsActive { get; set; } = true;
    }
}
