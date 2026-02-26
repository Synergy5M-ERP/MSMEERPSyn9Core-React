namespace SwamiSamarthSyn8.Models.Accounts
{
    public class AccountGroupUpdateDto
    {
        public string? AccountGroupName { get; set; }
        public string? AccountGroupNarration { get; set; }
        public int? AccountGroupCode { get; set; }

        public int? PrimaryGroupId { get; set; }
        public bool? IsActive { get; set; }
    }

}
