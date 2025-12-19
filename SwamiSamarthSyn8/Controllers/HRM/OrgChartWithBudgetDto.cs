public class OrgChartWithBudgetDto
{
    public string Department { get; set; }
    public string Position { get; set; }
    public string Level { get; set; }
    public string Qualification { get; set; }
    public string Experience { get; set; }
    public string Industry { get; set; }
    public string Country { get; set; }
    public string State { get; set; }
    public string City { get; set; }
    public string Currency { get; set; }
    public decimal BudgetMin { get; set; }
    public decimal BudgetMax { get; set; }
    public DateTime? OnboardDate { get; set; }
    public bool? IsActive { get; set; }

}
