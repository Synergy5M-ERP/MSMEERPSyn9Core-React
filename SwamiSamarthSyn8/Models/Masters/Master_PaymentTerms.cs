using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Masters
{
    public class Master_PaymentTerms
    {
        [Key]
        public int PaymentTermsId { get; set; }

        public string PaymentTerms { get; set; }
        public bool IsActive { get; set; }
    }

}
