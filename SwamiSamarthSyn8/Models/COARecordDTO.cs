namespace SwamiSamarthSyn8.Models
{
    public class COARecordDTO
    {
        public int PlanId { get; set; }

        public DateTime? ProdPlanDate { get; set; }
        public DateTime? PlanDate { get; set; }

        public string BuyerName { get; set; } = "";
        public string SONo { get; set; } = "";
        public string ItemName { get; set; } = "";
        public string ItemCode { get; set; } = "";
        public string Grade { get; set; } = "";
        public string MachineNo { get; set; } = "";
        public string OperatorName { get; set; } = "";
        public string Shift { get; set; } = "";
        public string BatchNo { get; set; } = "";

        public decimal PlanQty { get; set; }
        public decimal ActualQty { get; set; }

        public decimal? Width { get; set; }
        public decimal? Length { get; set; }
        public decimal? Thickness { get; set; }
        public decimal? Height { get; set; }
        public decimal? Weight { get; set; }
        public decimal? WeightperCover { get; set; }

        public string PartNumber { get; set; } = "";
        public string PrintingQuality { get; set; } = "";
        public string Color { get; set; } = "";
        public string VciTest { get; set; } = "";
        public string Dust { get; set; } = "";
        public string Remark { get; set; } = "";
        public string MoistureFree { get; set; } = "";
    }

}
