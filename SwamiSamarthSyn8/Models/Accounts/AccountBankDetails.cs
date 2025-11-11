using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SwamiSamarthSyn8.Models
{
    [Table("AccountBankDetails")]
    public class AccountBankDetails
    {
        [Key]
        public int AccountBankDetailId { get; set; }

        public int VendorId { get; set; }

        public string? BankName { get; set; }
        public string? AccountNo { get; set; }
        public string? BranchName { get; set; }
        public string? IFSCCode { get; set; }
        public bool IsActive { get; set; }

        [ForeignKey("VendorId")]
        public Potential_Vendor? Vendor { get; set; }
    }
}
