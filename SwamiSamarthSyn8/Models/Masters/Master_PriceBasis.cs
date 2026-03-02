using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Masters
{
    public class Master_PriceBasis
    {
        [Key]
        public int PriceBasisId { get; set; }

        public string PriceBasis { get; set; }
        public bool IsActive { get; set; }
    }

}
