using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Masters
{
    public class Master_Source
    {
        [Key]
        public int src_id { get; set; }

        public string src_name { get; set; }
        public bool IsActive { get; set; }
    }

}
