namespace SwamiSamarthSyn8.Models
{
    public class Account
    {
        public int AccountId { get; set; }
        public string AccountName { get; set; }
        //public string AccountCode { get; set; }
        public int AccountTypeId { get; set; }
        public int AccountGroupid { get; set; }
        public int AccountSubGroupid { get; set; }
        public bool IsActive { get; set; }
    }
}
