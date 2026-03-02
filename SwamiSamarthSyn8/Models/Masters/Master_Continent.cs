using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Masters
{
    public class Master_Continent
    {
        [Key]
        public int conti_id { get; set; }

        public string conti_name { get; set; }
        public int src_id { get; set; }
        public int? Continent_number { get; set; }
        public string Continent_Code { get; set; }
        public bool IsActive { get; set; }
    }

}
