using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models
{
    public partial class Master_VendorSubCategory
    {
        [Key]
        public int VendorSubCategoryId { get; set; }
        public int VendorCategoryId { get; set; }
        public string? VendorSubCategory { get; set; }
        public bool IsTDSApplicable { get; set; }
        public decimal? TDSRate { get; set; }
        public decimal? ThreshouldLimit { get; set; }
        public string? Section { get; set; }
        public bool IsActive { get; set; }
    }
}
