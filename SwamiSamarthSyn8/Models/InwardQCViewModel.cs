namespace SwamiSamarthSyn8.Models
{
    public class InwardQCViewModel
    {
        public int Id { get; set; }
        public string? GRN_NO { get; set; }
        public DateTime? GRN_Date { get; set; }
        public string? Supplier_Name { get; set; }
        public string? Supplier_Address { get; set; }
        public string? Invoice_NO { get; set; }
        public DateTime? Invoice_Date { get; set; }

        public string? PO_No { get; set; }
        public String? Purchase_Date { get; set; }
        public string? Item_Name { get; set; }
        public string? Item_Descrpition { get; set; }
        public string? UOM { get; set; }
        public string? Challan_Qty { get; set; }
        public string? Received_Qty { get; set; }
        public string? Rejected_Qty { get; set; }
        public decimal? QtyTobeRepaired { get; set; }
        public int G_Product_Id { get; set; }
    }
}
