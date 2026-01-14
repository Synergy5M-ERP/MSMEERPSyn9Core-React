using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Masters
{
    public class Master_City
    {
        [Key]
        public int city_id { get; set; }

        public string city_name { get; set; }
        public int state_id { get; set; }
        public string state_code { get; set; }
        public int? city_number { get; set; }
        public string city_code { get; set; }
        public string Country_Code { get; set; }
        public bool IsActive { get; set; }
    }

}
