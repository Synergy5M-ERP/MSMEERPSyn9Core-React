namespace SwamiSamarthSyn8.Models.Accounts
{
    public class AccountDebitNote
    {
        public int AccountDebitNoteId { get; set; }
        public string Category { get; set; }
        public int VendorId { get; set; }
        public int InvocieNoId { get; set; }
        public string DebitNoteNo { get; set; }
        public DateTime DebitNoteDate { get; set; }
        public DateTime PaymentDueDate { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal TotalTaxAmount { get; set; }
        public decimal GrandAmount { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
        public bool IsActive { get; set; }

        public List<AccountDebitNoteDetails> DebiitNoteEntries { get; set; }
    }
    public class AccountDebitNoteDetails
    {
        public int AccountDebitNoteDetailsId { get; set; }
        public int AccountDebitNoteId { get; set; }
        public int ItemId { get; set; }
        public decimal Qty { get; set; }
        public int UnitId { get; set; }
        public decimal Price { get; set; }
        public decimal TotalAmount { get; set; }
        public int TaxTypeId { get; set; }
        public decimal? CGST { get; set; }
        public decimal? SGST { get; set; }
        public decimal? IGST { get; set; }
        public decimal TotalTax { get; set; }
        public decimal NetAmount { get; set; }
    }
}
