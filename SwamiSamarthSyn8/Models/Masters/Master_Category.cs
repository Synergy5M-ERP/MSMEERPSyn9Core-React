using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Masters
{

    public class Master_Category
    {
        [Key]
        public int CategoryId { get; set; }

        public string CategoryName { get; set; }
        public int IndustryId { get; set; }
        public int? Cat_number { get; set; }
        public string Industry_code { get; set; }
        public string Cat_Code { get; set; }
        public bool IsActive { get; set; }
    }
}
