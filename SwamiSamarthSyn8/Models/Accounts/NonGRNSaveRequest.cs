using System.Collections.Generic;

namespace SwamiSamarthSyn8.Models.Accounts
{
    public class NonGRNSaveRequest
    {
        // Vendor info
        public AccountVendor Vendor { get; set; }

        // Invoice / Header info
        public AccountNonGRNInvoice Invoice { get; set; }

        // Line items / Details
        public List<AccountNonGRNInvoiceDetails> Details { get; set; }
    }
}