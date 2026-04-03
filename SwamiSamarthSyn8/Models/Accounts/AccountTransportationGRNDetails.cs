using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Accounts
{
    public class AccountTransportationGRNDetails
    {
        [Key]
        public long TransporterGRNDetailsId { get; set; }

        public long TransporterGRNId { get; set; }  // FK

        public int GRNId { get; set; }

        public bool IsLRPass { get; set; }

        // ✅ Navigation Property (optional but recommended)
        [ForeignKey("TransporterGRNId")]
        public virtual AccountTransportationGRN AccountTransportationGRN { get; set; }
    }
}
