using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Masters
{
    public class Master_State
    {
        [Key]
        public int state_id { get; set; }

        public string state_name { get; set; }
        public int country_id { get; set; }
        public string Country_Code { get; set; }
        public int? state_number { get; set; }
        public string state_code { get; set; }
        public bool IsActive { get; set; }
    }

}
