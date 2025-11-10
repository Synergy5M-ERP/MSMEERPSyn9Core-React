namespace SwamiSamarthSyn8.Models
{
    public class passab
    {
        public int id { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public Nullable<bool> AdminApprove { get; set; }
        public Nullable<System.DateTime> StartDate { get; set; }
        public Nullable<int> NoOfDays { get; set; }
        public Nullable<System.DateTime> EndDate { get; set; }
        public string ResetToken { get; set; }
        public Nullable<bool> IsAdmin { get; set; }
        public Nullable<bool> IsSubscribed { get; set; }
        public bool IM { get; set; }
        public bool VM { get; set; }
        public bool INTM { get; set; }
        public bool BOM { get; set; }
        public bool LM { get; set; }
        public bool CM { get; set; }
        public bool EQY { get; set; }
        public bool CQ { get; set; }
        public bool PRSH { get; set; }
        public bool SLS { get; set; }
        public bool BTT { get; set; }
        public bool AYT { get; set; }
        public bool WWM { get; set; }
        public bool PDTM { get; set; }

        public string UserRole { get; set; }
        public bool UOM { get; internal set; }
        public bool? OM { get; internal set; }
        public bool? IMSRCH { get; internal set; }
        public bool? IMCAL { get; internal set; }
        public bool MaterialManagement { get; set; }
        public bool SalesAndMarketing { get; set; }
        public bool HRAndAdmin { get; set; }
        public bool AccountAndFinance { get; set; }
        public bool Masters { get; set; }
        public bool Dashboard { get; set; }

        public bool ProductionAndQuality { get; set; }
        public bool External_buyer_seller { get; set; }
    }
}
