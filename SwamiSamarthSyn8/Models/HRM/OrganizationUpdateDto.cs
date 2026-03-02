namespace SwamiSamarthSyn8.Models.HRM
{
    public class OrganizationUpdateDto
    {
        public int DeptId { get; set; }
        public int DesignationId { get; set; }
        public int Level { get; set; }
        public string Qualification { get; set; }
        public string Experience { get; set; }
        public int IndustryId { get; set; }
        public int CountryId { get; set; }
        public int StateId { get; set; }
        public int CityId { get; set; }
        public int CurrencyId { get; set; }
        public decimal MinBudget { get; set; }
        public decimal MaxBudget { get; set; }
        public DateTime OnBoardDate { get; set; }
    }

}
