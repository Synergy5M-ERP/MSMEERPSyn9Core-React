using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Masters
{
    public class Master_UOM
    {
        [Key]
        public int UOMId { get; set; }

        public string UnitOfMeasurement { get; set; }
        public bool IsActive { get; set; }
    }

}
