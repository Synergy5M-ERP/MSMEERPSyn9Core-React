using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models
{

    [Table("AccountBankDetails")]
    public class AccountBankDetails
    {
        [Key]
        public int AccountBankDetailId { get; set; }
        public string Vendor_Code { get; set; }
        public string BankName { get; set; }
        public string AccountNo { get; set; }
        public string BranchName { get; set; }
        public string IFSCCode { get; set; }
        public bool IsActive { get; set; }
    }

}

