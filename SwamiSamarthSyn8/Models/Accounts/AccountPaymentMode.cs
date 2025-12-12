namespace SwamiSamarthSyn8.Models.Accounts
{
    public class AccountPaymentMode
    {
        public int PaymentModeId { get; set; }   // PRIMARY KEY
        public string PaymentMode { get; set; }
        public bool IsActive { get; set; }
    }
}
