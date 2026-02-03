namespace SwamiSamarthSyn8.Models.Accounts
{
    public class GRNApprovalDto
    {
        public int AccountGRNId { get; set; }
        public string BillStatus { get; set; }
        public List<GRNItemDto> Items { get; set; }
    }
}
