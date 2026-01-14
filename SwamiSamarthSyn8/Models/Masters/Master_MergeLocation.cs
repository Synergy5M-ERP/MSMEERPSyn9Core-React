using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Masters
{
    public class Master_MergeLocation
    {
        [Key]
        public int Id { get; set; }

        public string src_name { get; set; }
        public string conti_name { get; set; }
        public string Country_Name { get; set; }
        public string state_name { get; set; }
        public string city_name { get; set; }
        public string code { get; set; }
        public string state_code { get; set; }
        public string Country_Code { get; set; }
        public bool IsActive { get; set; }
    }

}
