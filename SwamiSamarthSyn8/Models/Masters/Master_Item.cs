using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SwamiSamarthSyn8.Models.Masters
{
    [Table("Master_Item")]
    public class Master_Item
    {
        [Key]
        public int ItemId { get; set; }

        public int? ItemCategoryId { get; set; }
        public int? VendorId { get; set; }
        public int? IndustryId { get; set; }
        public int? CategoryId { get; set; }
        public int? SubCategoryId { get; set; }

        [Required]
        public string ItemName { get; set; } = string.Empty;

        [Column("ItemSpecification/Grade")]
        [StringLength(250)]
        public string? ItemSpecificationGrade { get; set; }

        [StringLength(100)]
        public string? ItemCode { get; set; }

        public int? UOMId { get; set; }
        public int? AlternateUOMId { get; set; }

        [StringLength(20)]
        public string? HSCode { get; set; }

        public int? CurrencyId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? AveragePrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? SafeStockLevel { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? MOQ { get; set; }

        [StringLength(50)]
        public string? ItemLocationCode { get; set; }

        [StringLength(50)]
        public string? PrimaryandAlternative { get; set; }

        [StringLength(50)]
        public string? CheckSemiFinish { get; set; }

        [StringLength(50)]
        public string? TCandCOA { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Packaging { get; set; }

        public int? GLCode { get; set; }

        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }

        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }

        public int? DeletedBy { get; set; }
        public DateTime? DeletedDate { get; set; }

        public bool IsActive { get; set; }
    }
}
