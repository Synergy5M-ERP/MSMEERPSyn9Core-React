using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Models;

namespace SwamiSamarthSyn8.Data;

public partial class SwamiSamarthDbContext : DbContext
{
    public SwamiSamarthDbContext()
    {
    }

    public SwamiSamarthDbContext(DbContextOptions<SwamiSamarthDbContext> options)
        : base(options)
    {
    }
    //---------Accounts-------//
    public virtual DbSet<AccountJournal> AccountJournal { get; set; }
    public virtual DbSet<AccountVoucherType> AccountVoucherType { get; set; }
    public virtual DbSet<AccountSubLedger> AccountSubLedger { get; set; }
    public virtual DbSet<AccountSubVoucherType> AccountSubVoucherType { get; set; }
    public virtual DbSet<AccountLedger> AccountLedger { get; set; }
    public DbSet<AccountSubGroup> AccountSubGroup { get; set; }
    public DbSet<AccountSubSubGroup> AccountSubSubGroup { get; set; }
    public virtual DbSet<AccountType> AccountType { get; set; }
    public virtual DbSet<AccountFiscalPeriod> AccountFiscalPeriod { get; set; }
    public virtual DbSet<AccountGroup> AccountGroup { get; set; }
    public virtual DbSet<Account> Account { get; set; }
    public virtual DbSet<AccountGRNDetails> AccountGRNDetails { get; set; }
    public virtual DbSet<AccountGRN> AccountGRN { get; set; }
    public virtual DbSet<AccountBankDetails> AccountBankDetails { get; set; }
    //---------Accounts-------//

    public virtual DbSet<AFM_PaymentTransaction> AFM_PaymentTransaction { get; set; }
    public virtual DbSet<AFM_WithdrawTransaction> AFM_WithdrawTransaction{ get; set; }

    public virtual DbSet<AlternateItemMaster> AlternateItemMaster { get; set; }

    public virtual DbSet<ApplicationItem> ApplicationItem { get; set; }

    public virtual DbSet<ApplicationTbl> ApplicationTbl { get; set; }

    public virtual DbSet<BOM_FinishProdTbl> BOM_FinishProdTbl{ get; set; }

    public virtual DbSet<BOM_RawMatTbl> BOM_RawMatTbl { get; set; }

    public virtual DbSet<Category> Categorie { get; set; }

    public virtual DbSet<CityTbl1> CityTbl1 { get; set; }

    public virtual DbSet<ContinentTbl> ContinentTbl { get; set; }

    public virtual DbSet<CountryTbl> CountryTbl { get; set; }

    public virtual DbSet<Currencytbl> Currencytbl { get; set; }

    public virtual DbSet<Demo_tbl> Demo_tbl { get; set; }

    public virtual DbSet<ExtruderTemp> ExtruderTemp { get; set; }

    public virtual DbSet<HRM_AdminRegTbl> HRM_AdminRegTbl { get; set; }

    public virtual DbSet<HRM_AttendanceSummaryTbl> HRM_AttendanceSummaryTbl { get; set; }

    public virtual DbSet<HRM_AuthorityMatrixTbl> HRM_AuthorityMatrixTbl { get; set; }

    public virtual DbSet<HRM_ContactusTbl> HRM_ContactusTbl { get; set; }

    public virtual DbSet<HRM_DailywagesSalary> HRM_DailywagesSalarie { get; set; }

    public virtual DbSet<HRM_DepartmentTbl> HRM_DepartmentTbl { get; set; }

    public virtual DbSet<HRM_DesignationTbl> HRM_DesignationTbl { get; set; }

    public virtual DbSet<HRM_EmpAttendanceTbl> HRM_EmpAttendanceTbl { get; set; }

    public virtual DbSet<HRM_EmpInfoTbl> HRM_EmpInfoTbl { get; set; }

    public virtual DbSet<HRM_EmpPaySalaryTbl> HRM_EmpPaySalaryTbl { get; set; }

    public virtual DbSet<HRM_EmpRegTbl> HRM_EmpRegTbl { get; set; }

    public virtual DbSet<HRM_Employee_SalaryDetail> HRM_Employee_SalaryDetail { get; set; }

    public virtual DbSet<HRM_OganizationTbl> HRM_OganizationTbl { get; set; }

    public virtual DbSet<HRM_OrganizationDataTbl> HRM_OrganizationDataTbl { get; set; }

    public virtual DbSet<HRM_UserTbl> HRM_UserTbl { get; set; }

    public virtual DbSet<Import_Price_Calculation> Import_Price_Calculation { get; set; }

    public virtual DbSet<IndusCatSubDatum> IndusCatSubData { get; set; }

    public virtual DbSet<Industry> Industries { get; set; }

    public virtual DbSet<ItemParameterValue> ItemParameterValues { get; set; }

    public virtual DbSet<MASTER_FloorInvTbl> MASTER_FloorInvTbl { get; set; }

    public virtual DbSet<MASTER_InventoryTbl> MASTER_InventoryTbl { get; set; }

    public virtual DbSet<MASTER_ItemTbl> MASTER_ItemTbl { get; set; }

    public virtual DbSet<MASTER_SalesBuyerTbl> MASTER_SalesBuyerTbl { get; set; }

    public virtual DbSet<MASTER_SalesInventoryTbl> MASTER_SalesInventoryTbl { get; set; }

    public virtual DbSet<MASTER_SalesItemTbl> MASTER_SalesItemTbl { get; set; }

    public virtual DbSet<MMM_AutoPRTbl> MMM_AutoPRTbl { get; set; }

    public virtual DbSet<MMM_EnquiryItemTbl> MMM_EnquiryItemTbl { get; set; }

    public virtual DbSet<MMM_EnquiryVendorItemTbl> MMM_EnquiryVendorItemTbl { get; set; }

    public virtual DbSet<MMM_EnquiryVendorTbl> MMM_EnquiryVendorTbl { get; set; }

    public virtual DbSet<MMM_GRNProductTbl> MMM_GRNProductTbl { get; set; }

    public virtual DbSet<MMM_GRNTbl> MMM_GRNTbl { get; set; }

    public virtual DbSet<MMM_PrItemTbl> MMM_PrItemTbl { get; set; }

    public virtual DbSet<MMM_PurchaseReqTbl> MMM_PurchaseReqTbl { get; set; }

    public virtual DbSet<MMM_StoredIssuePasstbl> MMM_StoredIssuePasstbl { get; set; }

    public virtual DbSet<MMM_WorldWideMTbl> MMM_WorldWideMTbl { get; set; }

    public virtual DbSet<MergeTblDatum> MergeTblDatas { get; set; }

    public virtual DbSet<PAYMENT_TERMSTbl> PAYMENT_TERMSTbl { get; set; }

    public virtual DbSet<PQM_CustFinProdTbl> PQM_CustFinProdTbl { get; set; }

    public virtual DbSet<PQM_FinishPlanTbl> PQM_FinishPlanTbl { get; set; }

    public virtual DbSet<PQM_FinishProdTbl> PQM_FinishProdTbl { get; set; }

    public virtual DbSet<PQM_GenFinProdTbl> PQM_GenFinProdTbl { get; set; }

    public virtual DbSet<PQM_MachineInfoTbl> PQM_MachineInfoTbl { get; set; }

    public virtual DbSet<PQM_MatIssuePassTbl> PQM_MatIssuePassTbl { get; set; }

    public virtual DbSet<PQM_ProdLabelTbl> PQM_ProdLabelTbl{ get; set; }

    public virtual DbSet<PQM_RMConsumptionTbl> PQM_RMConsumptionTbl { get; set; }

    public virtual DbSet<PQM_RawMatTbl> PQM_RawMatTbl { get; set; }

    public virtual DbSet<PQM_SemiFinInventoryIssueTbl> PQM_SemiFinInventoryIssueTbl { get; set; }

    public virtual DbSet<PQM_SemiFinMfgItemTbl> PQM_SemiFinMfgItemTbl { get; set; }

    public virtual DbSet<PQM_SemiFinProdLabelTbl> PQM_SemiFinProdLabelTbl { get; set; }

    public virtual DbSet<PQM_SemiFinProdTbl> PQM_SemiFinProdTbl { get; set; }

    public virtual DbSet<PQM_SemiProdInventoryTbl> PQM_SemiProdInventoryTbl{ get; set; }

    public virtual DbSet<PQM_TodaysFinPlanTbl> PQM_TodaysFinPlanTbl { get; set; }

    public virtual DbSet<PQM_TodaysSemiFinPlanTbl> PQM_TodaysSemiFinPlanTbl { get; set; }

    public virtual DbSet<PRICE_BASISTBL> PRICE_BASISTBL { get; set; }

    public virtual DbSet<Parametertbl> Parametertbl { get; set; }

    public virtual DbSet<Potential_Vendor> Potential_Vendor { get; set; }

    public virtual DbSet<PrimaryItemMaster> PrimaryItemMaster { get; set; }

    public virtual DbSet<SDM_ChannelItemTbl> SDM_ChannelItemTbl { get; set; }

    public virtual DbSet<SDM_ChannelVendTbl> SDM_ChannelVendTbl { get; set; }

    public virtual DbSet<SDM_DispatchPlanTbl> SDM_DispatchPlanTbl { get; set; }

    public virtual DbSet<SDM_Finish_Prod_Costing> SDM_Finish_Prod_Costings { get; set; }

    public virtual DbSet<SDM_InvItemTbl> SDM_InvItemTbls { get; set; }

    public virtual DbSet<SDM_Inv_VendTbl> SDM_Inv_VendTbls { get; set; }

    public virtual DbSet<SDM_OnEnqItemTbl> SDM_OnEnqItemTbls { get; set; }

    public virtual DbSet<SDM_OnEnqVendTbl> SDM_OnEnqVendTbls { get; set; }

    public virtual DbSet<SDM_QuoItemTbl> SDM_QuoItemTbls { get; set; }

    public virtual DbSet<SDM_QuoVendItemTbl> SDM_QuoVendItemTbls { get; set; }

    public virtual DbSet<SDM_QuoVendTbl> SDM_QuoVendTbls { get; set; }

    public virtual DbSet<SDM_SOItemTbl> SDM_SOItemTbls { get; set; }

    public virtual DbSet<SDM_SOVendItemTbl> SDM_SOVendItemTbls { get; set; }

    public virtual DbSet<SDM_SOVendTbl> SDM_SOVendTbls { get; set; }

    public virtual DbSet<SDM_STKADJTbl> SDM_STKADJTbls { get; set; }

    public virtual DbSet<SourceTbl> SourceTbls { get; set; }

    public virtual DbSet<StateTbl> StateTbls { get; set; }

    public virtual DbSet<Subcategory> Subcategories { get; set; }

    public virtual DbSet<TTR_ItemTbl> TTR_ItemTbls { get; set; }

    public virtual DbSet<TTR_MachineTbl> TTR_MachineTbls { get; set; }

    public virtual DbSet<TTR_ParameterTbl> TTR_ParameterTbls { get; set; }

    public virtual DbSet<UOMTbl> UOMTbls { get; set; }

    public virtual DbSet<Users2> Users2s { get; set; }

    public virtual DbSet<plantSettingpara> plantSettingparas { get; set; }

    public virtual DbSet<userlogin> userlogins { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=synergy-swamisamarth.database.windows.net;Database=SwamiSamarthDb;User ID=swamisamarthsyn8;Password=Synergy5m@786;Encrypt=True;TrustServerCertificate=False;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AFM_PaymentTransaction>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__AFM_Paym__3214EC071804142F");

            entity.Property(e => e.AmountCurrency).HasDefaultValue("INR");
            entity.Property(e => e.InvoiceDate).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.InvoiceNo).HasDefaultValue("N/A");
            entity.Property(e => e.PCompanyOrPPersonName).HasDefaultValue("Unknown");
            entity.Property(e => e.PaymentDate).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<AFM_WithdrawTransaction>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__AFM_With__3214EC07F828C3ED");
        });

        modelBuilder.Entity<AlternateItemMaster>(entity =>
        {
            entity.HasOne(d => d.PIdNavigation).WithMany(p => p.AlternateItemMasters).HasConstraintName("FK_AlternateItemMaster_AlternateItemMaster");
        });

        modelBuilder.Entity<ApplicationTbl>(entity =>
        {
            entity.HasOne(d => d.PIDNavigation).WithMany(p => p.ApplicationTbls).HasConstraintName("FK_ApplicationTbl_ApplicationItem");
        });

        modelBuilder.Entity<BOM_FinishProdTbl>(entity =>
        {
            entity.HasKey(e => e.FPBID).HasName("PK__BOM_Fini__459ED042B5930621");
        });

        modelBuilder.Entity<BOM_RawMatTbl>(entity =>
        {
            entity.HasOne(d => d.FPB).WithMany(p => p.BOM_RawMatTbls).HasConstraintName("FK_BOM_RawMatTbl_BOM_FinishProdTbl");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Category__19093A0B8558A7C7");

            entity.Property(e => e.Cat_Code).HasComputedColumnSql("(right('00'+CONVERT([varchar](3),[Industry_code]),(2))+right('00'+CONVERT([varchar](3),[Cat_number]),(2)))", false);

            entity.HasOne(d => d.Industry).WithMany(p => p.Categories).HasConstraintName("FK_Category_Industry");
        });

        modelBuilder.Entity<CityTbl1>(entity =>
        {
            entity.HasKey(e => e.city_id).HasName("PK_CityTbl");

            entity.Property(e => e.city_code).HasComputedColumnSql("(CONVERT([varchar](7),[state_code])+right('00'+CONVERT([varchar](7),[city_number]),(2)))", false);

            entity.HasOne(d => d.state).WithMany(p => p.CityTbl1s)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CityTbl_StateTbl");
        });

        modelBuilder.Entity<ContinentTbl>(entity =>
        {
            entity.Property(e => e.Continent_Code).HasComputedColumnSql("(concat([src_id],right(CONVERT([varchar],[Continent_number]),(2))))", false);

            entity.HasOne(d => d.src).WithMany(p => p.ContinentTbls).HasConstraintName("FK_ContinentTbl_SourceTbl");
        });

        modelBuilder.Entity<CountryTbl>(entity =>
        {
            entity.Property(e => e.Country_Code).HasComputedColumnSql("(right(CONVERT([varchar](3),[continent_code]),(3))+right('00'+CONVERT([varchar](2),[country_number]),(2)))", false);

            entity.HasOne(d => d.conti).WithMany(p => p.CountryTbls)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CountryTbl_ContinentTbl");
        });

        modelBuilder.Entity<Currencytbl>(entity =>
        {
            entity.HasKey(e => e.Id)
                .HasName("PK_Currencytbl_Id")
                .IsClustered(false);
        });

        modelBuilder.Entity<Demo_tbl>(entity =>
        {
            entity.Property(e => e.id).ValueGeneratedNever();
        });

        modelBuilder.Entity<ExtruderTemp>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Extruder__3214EC0792D59C0E");
        });

        modelBuilder.Entity<HRM_AdminRegTbl>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PK_RegistrationForm");
        });

        modelBuilder.Entity<HRM_AuthorityMatrixTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__HRM_Auth__3214EC07B6873500");

            entity.Property(e => e.AuthorityName)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(e => e.Authority_code)
                  .IsRequired()
                  .HasColumnType("NVARCHAR(MAX)")
                  .ValueGeneratedNever();          // <-- manual code

            entity.Property(e => e.IsSelected)
                  .HasDefaultValue("No");
        });


        modelBuilder.Entity<HRM_ContactusTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_HRMContactusTbl");
        });

        modelBuilder.Entity<HRM_DailywagesSalary>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__HRM_Dail__3214EC07AF88F291");
        });
        modelBuilder.Entity<HRM_DepartmentTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__HRM_DepartmentTbl");

            entity.Property(e => e.DepartmentName)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(e => e.Department_code)
                  .IsRequired()
                  .HasColumnType("NVARCHAR(MAX)") // <- here
                  .ValueGeneratedNever();         // EF will save your value
        });


        modelBuilder.Entity<HRM_DesignationTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__HRM_Desi__3214EC07AC6F3B7E");

            entity.Property(e => e.DesignationName)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(e => e.Designation_code)
                  .IsRequired()
                  .HasColumnType("NVARCHAR(MAX)")
                  .ValueGeneratedNever();          // <-- manual code, not computed
        });


        modelBuilder.Entity<HRM_EmpAttendanceTbl>(entity =>
        {
            entity.HasKey(e => e.EmployeeID).HasName("PK__HRM_EmpA__7AD04FF1EBF137A0");
        });

        modelBuilder.Entity<HRM_EmpRegTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__HRM_EmpR__3214EC073DCDE877");
        });

        modelBuilder.Entity<HRM_Employee_SalaryDetail>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__HRM_Empl__3214EC07DED16A33");

            entity.Property(e => e.Salary_Categeroy).HasDefaultValue("");
        });

        modelBuilder.Entity<HRM_OganizationTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__HRM_Ogan__3214EC076ECA001B");
        });

        modelBuilder.Entity<HRM_OrganizationDataTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Organization");
        });

        modelBuilder.Entity<HRM_UserTbl>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PK_User_ERP");
        });

        modelBuilder.Entity<Industry>(entity =>
        {
            entity.HasKey(e => e.IndustryId).HasName("PK__Industry__808DEDCC8D27942E");

            entity.Property(e => e.Industry_code).HasComputedColumnSql("(right('0'+CONVERT([nvarchar](10),[IndustryId]),(2)))", true);
        });

        modelBuilder.Entity<ItemParameterValue>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_ItemParameterValue");
        });

        modelBuilder.Entity<MASTER_FloorInvTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("MASTER_FloorInvntoryTbl");
        });

        modelBuilder.Entity<MASTER_ItemTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Products");
        });

        modelBuilder.Entity<MASTER_SalesInventoryTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_SalesInventoryMaster");
        });

        modelBuilder.Entity<MASTER_SalesItemTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_Product");
        });

        modelBuilder.Entity<MMM_EnquiryItemTbl>(entity =>
        {
            entity.HasKey(e => e.ItemId).HasName("PK__MMM_Enqu__727E838B29C3ABCB");
        });

        modelBuilder.Entity<MMM_EnquiryVendorItemTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__MMM_Enqu__3214EC0720FF56B3");

            entity.HasOne(d => d.Item).WithMany(p => p.MMM_EnquiryVendorItemTbls)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MMM_EnquiryVendorItemTbl_MMM_EnquiryItemTbl");

            entity.HasOne(d => d.Qut).WithMany(p => p.MMM_EnquiryVendorItemTbls)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_MMM_EnquiryVendorItemTbl_MMM_EnquiryVendorTbl");
        });

        modelBuilder.Entity<MMM_EnquiryVendorTbl>(entity =>
        {
            entity.HasKey(e => e.QutId).HasName("PK__MMM_Enqu__53EE61EBE358D32C");
        });

        modelBuilder.Entity<MMM_GRNProductTbl>(entity =>
        {
            entity.HasKey(e => e.G_Product_Id).HasName("PK__MMM_GRNP__B3C9E9180A02E604");

            entity.HasOne(d => d.G_IdNavigation).WithMany(p => p.MMM_GRNProductTbls).HasConstraintName("FK_MMM_GRNProductTbl_MMM_GRNTbl");
        });

        modelBuilder.Entity<MMM_GRNTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__MMM_GRNT__3214EC0777019C89");
        });

        modelBuilder.Entity<MMM_PrItemTbl>(entity =>
        {
            entity.HasKey(e => e.ItemId).HasName("PK__MMM_PrIt__727E838B9CEB35D6");

            entity.HasOne(d => d.IdNavigation).WithMany(p => p.MMM_PrItemTbls).HasConstraintName("FK_MMM_PrItemTbl_MMM_PurchaseReqTbl1");
        });

        modelBuilder.Entity<MMM_PurchaseReqTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__MMM_Purc__3214EC07B802A8BF");
        });

        modelBuilder.Entity<MMM_StoredIssuePasstbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_StoredIssuePasstbl");
        });

        modelBuilder.Entity<MMM_WorldWideMTbl>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_Manufacturetbl_Test");
        });

        modelBuilder.Entity<MergeTblDatum>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__MergeTbl__3214EC075AC4914F");
            entity.ToTable("MergeTblData"); // 👈 map to the correct table
        });

        modelBuilder.Entity<PAYMENT_TERMSTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PAYMENT___3214EC070F328D76");
        });

        modelBuilder.Entity<PQM_CustFinProdTbl>(entity =>
        {
            entity.HasKey(e => e.CustFinProdId).HasName("PK__PQM_Cust__8466BD7CFFE72312");
        });

        modelBuilder.Entity<PQM_FinishPlanTbl>(entity =>
        {
            entity.HasKey(e => e.FinPlanid).HasName("PK__PQM_Fini__BC4A616AFB1D9548");

            entity.HasOne(d => d.FinProd).WithMany(p => p.PQM_FinishPlanTbls).HasConstraintName("FK_PQM_FinishPlanTbl_PQM_FinishProdTbl");
        });

        modelBuilder.Entity<PQM_FinishProdTbl>(entity =>
        {
            entity.HasKey(e => e.FinProdid).HasName("PK__PQM_Fini__74EDED63139FEB3A");
        });

        modelBuilder.Entity<PQM_GenFinProdTbl>(entity =>
        {
            entity.HasKey(e => e.GenFinProdId).HasName("PK__PQM_GenF__FDF74119AFF90759");
        });

        modelBuilder.Entity<PQM_MachineInfoTbl>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK_MachineInfo");
        });

        modelBuilder.Entity<PQM_MatIssuePassTbl>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK__PQM_MatI__3214EC27AC336E40");
        });

        modelBuilder.Entity<PQM_ProdLabelTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PQM_Prod__3214EC07FADFB277");
        });

        modelBuilder.Entity<PQM_RMConsumptionTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PQM_RMCo__3214EC0766884D05");
        });

        modelBuilder.Entity<PQM_RawMatTbl>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK__PQM_RawM__3214EC272971BF08");
        });

        modelBuilder.Entity<PQM_SemiFinInventoryIssueTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PQM_Semi__3214EC0797044314");
        });

        modelBuilder.Entity<PQM_SemiFinMfgItemTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PQM_Semi__3214EC070441FE29");
        });

        modelBuilder.Entity<PQM_SemiFinProdLabelTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PQM_Semi__3214EC071E1C26CF");
        });

        modelBuilder.Entity<PQM_SemiFinProdTbl>(entity =>
        {
            entity.HasKey(e => e.CustProdId).HasName("PK__PQM_Semi__F15906BCBE1CCBE9");
        });

        modelBuilder.Entity<PQM_SemiProdInventoryTbl>(entity =>
        {
            entity.HasKey(e => e.SemiProdID).HasName("PK__PQM_Semi__13DD1B618C36E424");
        });

        modelBuilder.Entity<PQM_TodaysFinPlanTbl>(entity =>
        {
            entity.HasKey(e => e.PlanId).HasName("PK__PQM_Toda__755C22B72C907B0E");

            entity.HasOne(d => d.CustFinProd).WithMany(p => p.PQM_TodaysFinPlanTbls).HasConstraintName("FK_PQM_TodaysFinPlanTbl_PQM_CustFinProdTbl");

            entity.HasOne(d => d.GenFinProd).WithMany(p => p.PQM_TodaysFinPlanTbls).HasConstraintName("FK_PQM_TodaysFinPlanTbl_PQM_GenFinProdTbl");
        });

        modelBuilder.Entity<PQM_TodaysSemiFinPlanTbl>(entity =>
        {
            entity.HasKey(e => e.PlanId).HasName("PK__PQM_Toda__755C22B7623FCA28");

            entity.HasOne(d => d.CustProd).WithMany(p => p.PQM_TodaysSemiFinPlanTbls).HasConstraintName("FK_PQM_TodaysSemiFinPlanTbl_PQM_SemiFinProdTbl");
        });

        modelBuilder.Entity<PRICE_BASISTBL>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__PRICE_BA__3214EC0725D73B48");
        });

        modelBuilder.Entity<SDM_ChannelItemTbl>(entity =>
        {
            entity.HasKey(e => e.ItemId).HasName("PK__SDM_Chan__727E838B0FCF261D");

            entity.HasOne(d => d.IdNavigation).WithMany(p => p.SDM_ChannelItemTbls).HasConstraintName("FK_SDM_ChannelItemTbl_SDM_ChannelVendTbl");
        });

        modelBuilder.Entity<SDM_ChannelVendTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SDM_Chan__3214EC0734D2E65E");
        });

        modelBuilder.Entity<SDM_InvItemTbl>(entity =>
        {
            entity.HasKey(e => e.product_id).HasName("PK__SDM_InvI__47027DF58B42144D");

            entity.HasOne(d => d.supplied_id).WithMany(p => p.SDM_InvItemTbls).HasConstraintName("FK_SDM_InvItemTbl_SDM_Inv_VendTbl");
        });

        modelBuilder.Entity<SDM_Inv_VendTbl>(entity =>
        {
            entity.HasKey(e => e.supplied_id).HasName("PK__SDM_Inv___74A553030E555BB6");
        });

        modelBuilder.Entity<SDM_OnEnqItemTbl>(entity =>
        {
            entity.HasOne(d => d.Vend).WithMany(p => p.SDM_OnEnqItemTbls).HasConstraintName("FK_SDM_OnEnqItemTbl_SDM_OnEnqVendTbl");
        });

        modelBuilder.Entity<SDM_QuoItemTbl>(entity =>
        {
            entity.HasKey(e => e.ItemId).HasName("PK__SDM_QuoI__727E838BA8D1EE12");
        });

        modelBuilder.Entity<SDM_QuoVendItemTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SDM_QuoV__3214EC0710A7729C");

            entity.HasOne(d => d.Item).WithMany(p => p.SDM_QuoVendItemTbls)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SDM_QuoVendItemTbl_SDM_QuoItemTbl");

            entity.HasOne(d => d.Qut).WithMany(p => p.SDM_QuoVendItemTbls)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SDM_QuoVendItemTbl_SDM_QuoVendTbl");
        });

        modelBuilder.Entity<SDM_QuoVendTbl>(entity =>
        {
            entity.HasKey(e => e.QutId).HasName("PK__SDM_QuoV__53EE61EB5212EE59");
        });

        modelBuilder.Entity<SDM_SOItemTbl>(entity =>
        {
            entity.HasKey(e => e.SalesItemId).HasName("PK_SalesOrderItem");
        });

        modelBuilder.Entity<SDM_SOVendItemTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK_SalesOrderVendorItem");

            entity.HasOne(d => d.SalesItem).WithMany(p => p.SDM_SOVendItemTbls)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SDM_SOVendItemTbl_SDM_SOItemTbl");

            entity.HasOne(d => d.SalesVendor).WithMany(p => p.SDM_SOVendItemTbls)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_SDM_SOVendItemTbl_SDM_SOVendTbl");
        });

        modelBuilder.Entity<SDM_SOVendTbl>(entity =>
        {
            entity.HasKey(e => e.SalesVendorId).HasName("PK_SalesOrderVendor");
        });

        modelBuilder.Entity<StateTbl>(entity =>
        {
            entity.Property(e => e.state_code).HasComputedColumnSql("(CONVERT([varchar](7),[Country_Code])+right('00'+CONVERT([varchar](7),[state_number]),(2)))", false);

            entity.HasOne(d => d.country).WithMany(p => p.StateTbls)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_StateTbl_CountryTbl");
        });

        modelBuilder.Entity<Subcategory>(entity =>
        {
            entity.HasKey(e => e.SubcategoryId).HasName("PK__Subcateg__9C4E705DF0EECB27");

            entity.Property(e => e.sub_Code).HasComputedColumnSql("(CONVERT([varchar](7),[Cat_Code])+right('00'+CONVERT([varchar](7),[sub_number]),(2)))", false);

            entity.HasOne(d => d.Category).WithMany(p => p.Subcategories).HasConstraintName("FK_Subcategory_Category");

            entity.HasOne(d => d.Industry).WithMany(p => p.Subcategories).HasConstraintName("FK_Subcategory_Industry");
        });

        modelBuilder.Entity<TTR_MachineTbl>(entity =>
        {
            entity.HasOne(d => d.Item).WithMany(p => p.TTR_MachineTbls).HasConstraintName("FK_TTR_MachineTbl_TTR_ItemTbl");

            entity.HasOne(d => d.Parameter).WithMany(p => p.TTR_MachineTbls).HasConstraintName("FK_TTR_MachineTbl_TTR_ParameterTbl");
        });

        modelBuilder.Entity<UOMTbl>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__UOMTbl__3214EC070392D65C");
        });

        modelBuilder.Entity<plantSettingpara>(entity =>
        {
            entity.HasKey(e => e.ID).HasName("PK__plantSet__3214EC2712012991");
        });

        modelBuilder.Entity<userlogin>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PK_UserLogin");

            entity.Property(e => e.password).IsFixedLength();
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
