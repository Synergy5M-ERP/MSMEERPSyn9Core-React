namespace SwamiSamarthSyn8.Models
{
    public class ProductionSubmitDto
    {
        public required List<PQM_TodaysFinPlanTbl> ProductionData { get; set; }
        public required string PlanDate { get; set; }
    }
}
