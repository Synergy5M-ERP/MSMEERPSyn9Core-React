using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Masters
{
    public class Master_Country
    {
        [Key]
        public int country_id { get; set; }

        public string country_name { get; set; }
        public int conti_id { get; set; }
        public string continent_code { get; set; }
        public int? country_number { get; set; }
        public string Country_Code { get; set; }
        public bool IsActive { get; set; }
    }

}
