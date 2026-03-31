using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Masters
{
    public class Master_ItemVendorCategory
    {
        [Key]
        public int ItemVendorCategoryId { get; set; }

        public int ItemVendorCatCode { get; set; }

        [Display(Name = "Item Category")]
        public string? ItemVendorCategory { get; set; }

        public bool IsActive { get; set; }
    }
}
