using System;
using System.Collections.Generic;

namespace SwamiSamarthSyn8.Models.Accounts
{
    public class GRNSaveRequest
    {
        public int VendorId { get; set; }
        public string GrnNumber { get; set; }
        public string InvoiceNumber { get; set; }
        public string Description { get; set; }

        public decimal? TotalAmount { get; set; }
        public decimal? SGSTAmount { get; set; }
        public decimal? CGSTAmount { get; set; }
        public decimal? IGSTAmount { get; set; }
    }
   


}
