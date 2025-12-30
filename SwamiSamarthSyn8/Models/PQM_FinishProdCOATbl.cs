namespace SwamiSamarthSyn8.Models
{
    public class PQM_FinishProdCOATbl
    {
        public int Id { get; set; }
        public int PlanId { get; set; }
        public DateTime? ProdPlanDate { get; set; }
        public required string BuyerName { get; set; }
        public required string SONo { get; set; }
        public required string ItemName { get; set; }
        public required string Grade { get; set; }
        public required string MachineNo { get; set; }
        public required string OperatorName { get; set; }
        public DateTime? PlanDate { get; set; }
        public required string Shift { get; set; }
        public required string BatchNo { get; set; }
        public decimal? PlanQty { get; set; }
        public decimal? ActualQty { get; set; }

        // Parameter rows
        public decimal? Width { get; set; }
        public decimal? Length { get; set; }
        public decimal? Thickness { get; set; }
        public decimal? Height { get; set; }
        public required string PartNumber { get; set; }

        public decimal? Weight { get; set; }
        public decimal? WeightperCover { get; set; }

        public required string PrintingQuality { get; set; }

        public required string Color { get; set; }

        public required string VciTest { get; set; }

        public required string Dust { get; set; }
        public required string MoistureFree { get; set; }

        public required string Remark { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public  bool IsSubmitted { get; set; }
        public required string ItemCode { get; set; }
    }
}
