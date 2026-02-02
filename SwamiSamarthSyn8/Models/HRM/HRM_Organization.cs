using System.ComponentModel.DataAnnotations;

namespace SwamiSamarthSyn8.Models.HRM
{
    public class HRM_Organization
    {

        [Key] // ✅ REQUIRED
        public int OrganizationId { get; set; }
        public int? DeptId { get; set; }
        public int? DesignationId { get; set; }
        public int? Level { get; set; }
        public string? Qualification { get; set; }
        public string? Experience { get; set; }
        public int? IndustryId { get; set; }
        public int? CountryId { get; set; }
        public int? StateId { get; set; }
        public int? CityId { get; set; }
        public int? CurrencyId { get; set; }
        public decimal? MaxBudget { get; set; }
        public decimal? MinBudget { get; set; }
        public DateTime? OnBoardDate { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool IsActive { get; set; }
    }

}
