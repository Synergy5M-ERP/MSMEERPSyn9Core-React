using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Masters
{
    public class Master_VendorBankDetails
    {
        [Key]
        public int VendorbankDetailsId { get; set; }
        public int VendorId { get; set; }
        public string? CurrentAccountNo { get; set; }
        public string? BankName { get;  set; }

        public string? BranchName { get; set; }
        public string? IFSCCode { get; set; }

        public bool IsActive { get; set; }
    }
}
