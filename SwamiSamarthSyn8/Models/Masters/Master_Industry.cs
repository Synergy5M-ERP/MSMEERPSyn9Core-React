using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Masters
{
    public class Master_Industry
    {
        [Key]
        public int IndustryId { get; set; }

        public string IndustryName { get; set; }
        public string Industry_code { get; set; }
        public bool IsActive { get; set; }
    }

}
