using SwamiSamarthSyn8.Models.Masters;

namespace SwamiSamarthSyn8.Models.DTOs
{
    public class VendorSaveRequest
    {
        public Master_Vendor Vendor { get; set; }

        public List<Master_VendorBankDetails> BankDetails { get; set; }

        public List<Master_VendorAddresses> Addresses { get; set; }
    }
}
