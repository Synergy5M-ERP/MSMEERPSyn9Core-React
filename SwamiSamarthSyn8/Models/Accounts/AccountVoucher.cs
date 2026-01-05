namespace SwamiSamarthSyn8.Models.Accounts
{
    public class AccountVoucher
    {
        public int AccountVoucherId { get; set; }
        public string? VoucherCategory { get; set; }
        public string VoucherNo { get; set; }
        public int? VendorId { get; set; }
        public string? OtherVendor { get; set; }
        public int AccountVoucherTypeId { get; set; }
        public DateTime VoucherDate { get; set; }
        public int ReferenceNo { get; set; }
        public string? OtherReferenceNo { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime PaymentDueDate { get; set; }
        public int PaymentModeId { get; set; }
        public int AccountStatusId { get; set; }
        public string Description { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime UpdatedDate { get; set; }
        public bool IsActive { get; set; }

        public List<AccountVoucherDetails> LedgerEntries { get; set; }
    }

    public class AccountVoucherDetails
    {
        public int AccountVoucherDetailsId { get; set; }
        public int AccountVoucherId { get; set; }
        public int AccountLedgerId { get; set; }
        public decimal CreditAmount { get; set; }
        public decimal DebitAmount { get; set; }
        public string Description { get; set; }
    }
}
