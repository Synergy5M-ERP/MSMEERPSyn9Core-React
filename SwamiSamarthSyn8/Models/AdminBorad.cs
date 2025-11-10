namespace SwamiSamarthSyn8.Models
{
    public class AdminBorad
    {
        public int id { get; set; }
        public bool ItemMaster { get; set; }
        public int userid { get; set; }
        public bool VendorMaster { get; set; }
        public bool InventroyMaster { get; set; }
        public bool BOMMaster { get; set; }
        public bool LocationMaster { get; set; }
        public bool CommodityMaster { get; set; }
        public bool Enquiry { get; set; }
        public bool CompareQuation { get; set; }
        public bool Parchase { get; set; }
        public bool Sales { get; set; }
        public bool BusinessTrackingTool { get; set; }
        public bool Analytics { get; set; }
        public bool WorldwideManufacturingCapacities { get; set; }
        public bool ProductManegment { get; set; }
        public bool? UOMCURRENCY { get; internal set; }
        public bool CHIEF_ADMIN { get; set; }
        public bool SUPERADMIN { get; set; }
        public bool DEPUTY_SUPERADMIN { get; set; }
        public bool ADMIN { get; set; }
        public bool DEPUTY_ADMIN { get; set; }
        public bool USER { get; set; }
        public string UserRole { get; set; }
        public bool MaterialManagementModule { get; set; }
        public bool SalesAndMarketingModule { get; set; }
        public bool HRAndAdminModule { get; set; }
        public bool AccountAndFinanceModule { get; set; }
        public bool MastersModule { get; set; }
        public bool DashboardModule { get; set; }

        public bool ProductionAndQualityModule { get; set; }
        public bool External_buyer_seller { get; set; }
        public string username { get; set; }
        public string Emp_Code { get; set; }

    }
}
