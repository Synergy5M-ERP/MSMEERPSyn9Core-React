using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.Accounts
{
    public class AccountTransporterGRNViewModel
    {
        // ✅ HEADER - AccountTransportationGRN
        public int VendorId { get; set; }   // 🔥 IMPORTANT (DB save)

        public string? SellerName { get; set; }
        public string? TransporterInvoiceNo { get; set; }
        [DataType(DataType.Date)]
        public DateTime? InvoiceDate { get; set; }
        public DateTime? Date { get; set; }
        public decimal Qty { get; set; }
        public decimal Price { get; set; }
        public decimal NetAmount { get; set; }
        public int TaxTypeId { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal IGSTAmount { get; set; }
        public decimal SGSTAmount { get; set; }
        public decimal CGSTAmount { get; set; }
        public decimal TotalAmount { get; set; }
        public List<int> LedgerIds { get; set; }
        public bool CheckTransportation { get; set; }
        public bool ApproveTransportation { get; set; }

        // ✅ DETAILS - AccountTransportationGRNDetails (table rows)
        public List<TransporterGRNDetailItem> Details { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? Payment_Due_Date { get; set; }
        public string? VendorCode { get; set; }


    }

    public class TransporterGRNDetailItem
    {
        public int GRNId { get; set; }   // from MMM_GRNTbl
        public bool IsLRPass { get; set; }
        public DateTime? Date { get; set; } // ✅ ADD THIS
                                            // checkbox selected
    }
}
