namespace SwamiSamarthSyn8.Models
{
    public class SemiFinPlanViewModel
    {
        public int CustProdId { get; set; }
        public string? BuyerName { get; set; } = string.Empty;   
        public string? SONumber { get; set; } = string.Empty;
        public string? SemiFinishItemName { get; set; } = string.Empty;
        public string? SemiFinishGrade { get; set; } = string.Empty;
        public string? FinishItemName { get; set; } = string.Empty;
        public string? FinishGrade { get; set; } = string.Empty;
        public string? PlanCode { get; set; } = string.Empty;
        public DateTime? Date { get; set; }

        // From PQM_TodaysSemiFinPlanTbl
        public int PlanId { get; set; }
        public string? Location { get; set; } = string.Empty;
        public string? MachineName { get; set; } = string.Empty;
        public string? MachineNumber { get; set; } = string.Empty;
        public string? MachineCap { get; set; } = string.Empty;
        public DateTime? PlanDate { get; set; }
        public string? Shift { get; set; } = string.Empty;
        public string? OpName { get; set; } = string.Empty;
        public string? BatchNo { get; set; } = string.Empty;
        public decimal? PlanQty { get; set; }
        public decimal? ActualQty { get; set; }
        public decimal? RejectionQty { get; set; }
        public decimal? QtyToWH { get; set; }
    }

}
