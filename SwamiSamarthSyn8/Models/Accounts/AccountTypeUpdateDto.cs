namespace SwamiSamarthSyn8.DTOs.Accounts
{
    public class AccountTypeUpdateDto
    {
        public string? AccountTypeName { get; set; }
        public string? AccountTypeNarration { get; set; }
        public string? AccountTypeCode { get; set; }

        public bool? IsActive { get; set; }
    }
}
