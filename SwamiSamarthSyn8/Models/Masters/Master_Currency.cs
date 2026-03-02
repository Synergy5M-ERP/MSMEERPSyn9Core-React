using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Masters
{
    public class Master_Currency
    {
        [Key]
        public int CurrencyId { get; set; }

        public string Currency_Code { get; set; }
        public bool IsActive { get; set; }
    }

}
