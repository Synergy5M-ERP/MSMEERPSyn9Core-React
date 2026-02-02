namespace SwamiSamarthSyn8.Models.Accounts
{
    public class PaymentAllocationDtos
    {
        public class PaymentAllocationRequest
        {
            public int LedgerId { get; set; }
            public DateTime Date { get; set; }
            public List<PaymentAllocationItemDto> Payments { get; set; }
        }

        public class PaymentAllocationItemDto
        {
            public int AccountGRNId { get; set; }
            public decimal PaidAmount { get; set; }
            public decimal TotalAmount { get; set; }
            public decimal BalanceAmount { get; set; }

            public decimal CGST { get; set; }
            public decimal SGST { get; set; }
            public decimal IGST { get; set; }

            public string RTGSNo { get; set; }
        }

    }
}
