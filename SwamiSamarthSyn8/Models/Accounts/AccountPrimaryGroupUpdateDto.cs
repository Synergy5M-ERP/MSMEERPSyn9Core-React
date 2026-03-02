namespace SwamiSamarthSyn8.DTOs.Accounts
{
    public class AccountPrimaryGroupUpdateDto
    {
        public string? AccountPrimaryGroupName { get; set; }
        public string? Type { get; set; }
        public int PrimaryGroupCode { get; set; }

        public string? Description { get; set; }

        public bool? IsActive { get; set; }
    }
}
