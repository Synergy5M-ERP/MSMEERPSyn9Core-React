using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Masters
{
    public class Master_Subcategory
    {
        [Key]
        public int SubcategoryId { get; set; }

        public string SubcategoryName { get; set; }
        public int CategoryId { get; set; }
        public int IndustryId { get; set; }
        public int? sub_number { get; set; }
        public string Cat_Code { get; set; }
        public string sub_Code { get; set; }
        public bool IsActive { get; set; }
    }

}
