namespace SwamiSamarthSyn8.DTOs.Accounts
{
    public class AccountSubSubGroupUpdateDto
    {
        public int? AccountGroupid { get; set; }
        public int? AccountSubGroupid { get; set; }
        public string? AccountSubSubGroupName { get; set; }
        public string? AccountSubSubGroupCode { get; set; }

        public string? AccountSubSubGroupNarration { get; set; }
        public bool? IsActive { get; set; }
    }
}
