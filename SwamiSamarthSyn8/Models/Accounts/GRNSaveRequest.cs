using System;
using System.Collections.Generic;

namespace SwamiSamarthSyn8.Models.Accounts
{
    public class GRNSaveRequest
    {

        public int VendorId { get; set; }   // 🔥 ADD THIS

        public string SellerName { get; set; }       // Vendor lookup key
        public string GrnNumber { get; set; }
        public DateTime GrnDate { get; set; }
        public string PoNumber { get; set; }
        public string InvoiceNumber { get; set; }
        public DateTime InvoiceDate { get; set; }
        public DateTime? poDate { get; set; }
        public string Status { get; set; }
        public string VehicleNo { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal TotalTaxAmount { get; set; }
        public decimal GrandAmount { get; set; }
        public string Description { get; set; }
        public string TransporterName { get; set; }
        public List<GRNItemRequest> Items { get; set; }
        public string BillStatus { get; set; }   // if it’s varchar/nvarchar

    }

    public class GRNItemRequest
    {
        public string ItemName { get; set; }
        public int ReceivedQty { get; set; }
        public int ApprovedQty { get; set; }
        public int DamagedQty { get; set; }
        public string Unit { get; set; }
        public string TaxType { get; set; }
        public decimal? CGST { get; set; }
        public decimal? SGST { get; set; }
        public decimal? IGST { get; set; }
        public string Description { get; set; }
        public string? Item_Code { get;  set; }
        public string? Item_Grade { get;  set; }
        public decimal? TotalAmount { get;  set; }
        public decimal? TotalTaxAmount { get;  set; }
    }


}
