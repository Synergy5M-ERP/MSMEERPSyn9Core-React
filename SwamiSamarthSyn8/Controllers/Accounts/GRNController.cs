using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models;
using SwamiSamarthSyn8.Models.Accounts;
using System;

namespace SwamiSamarthSyn8.Controllers.Accounts
{
    [Route("api/[controller]")]
    [ApiController]
    public class GRNController : ControllerBase
    {
        private readonly SwamiSamarthDbContext _swamiContext;   // 🔹 MMM DB
        private readonly MsmeERPDbContext _msmeContext;         // 🔹 Accounts DB
        private readonly ILogger<GRNController> _logger;

        public GRNController(
            SwamiSamarthDbContext swamiContext,
            MsmeERPDbContext msmeContext,
            ILogger<GRNController> logger)
        {
            _swamiContext = swamiContext;
            _msmeContext = msmeContext;
            _logger = logger;
        }

        [HttpGet("suppliers")]
        public async Task<IActionResult> GetSellers()
        {
            var sellers = _swamiContext.MMM_GRNTbl
              .Where(x => x.Supplier_Name != null && x.QC_Clearance_Date != null)
              .Select(x => x.Supplier_Name)
              .Distinct()
              .ToList();
            return Ok(new { success = true, data = sellers });
        }

        [HttpGet("GetInvoicesBySeller")]
        public async Task<IActionResult> GetInvoicesBySeller([FromQuery] string sellerName)
        {
            try
            {
                if (string.IsNullOrEmpty(sellerName))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Seller name is required"
                    });
                }

                var invoices = await (
                    from g in _swamiContext.MMM_GRNTbl

                    where g.Supplier_Name == sellerName
                          && g.QC_Clearance_Date != null
                          && !string.IsNullOrEmpty(g.Invoice_NO)

                    join a in _swamiContext.AccountGRN
                    on new
                    {
                        Supplier = g.Supplier_Name,
                        Invoice = g.Invoice_NO
                    }
                    equals new
                    {
                        Supplier = a.Description,
                        Invoice = a.InvoiceNumber
                    }
                    into gj

                    from sub in gj.DefaultIfEmpty()

                        // ✅ EXCLUDE APPROVED GRN
                    where sub == null || sub.ApprovedGRN == false

                    select new
                    {
                        g.Id,
                        invoiceNumber = g.Invoice_NO,
                        invoiceDate = g.Invoice_Date,
                        qcDate = g.QC_Clearance_Date
                    }

                )
                .Distinct()
                .OrderBy(x => x.invoiceNumber)
                .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = invoices
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [HttpGet("GetPODetailsByGRN")]
        public async Task<IActionResult> GetPODetailsByGRN([FromQuery] string grnNumber)
        {
            if (string.IsNullOrEmpty(grnNumber))
                return BadRequest(new { success = false, message = "GRN number is required" });

            // Step 1: Get PO numbers linked with GRN
            var poNumbers = await _swamiContext.MMM_GRNTbl
                .Where(g => g.GRN_NO == grnNumber)
                .Select(g => g.PO_No)
                .Distinct()
                .ToListAsync();

            if (!poNumbers.Any())
                return Ok(new { success = true, data = new List<object>() });

            // Step 2: Get ONLY PO Date + PONO from MMM_EnquiryVendorItemTbl
            var poDetails = await _swamiContext.MMM_EnquiryVendorItemTbl
                .Where(po => poNumbers.Contains(po.PONO))
                .Select(po => new
                {
                    po.PONO,
                    po.PODate
                })
                .Distinct()
                .ToListAsync();

            return Ok(new { success = true, data = poDetails });
        }

        // ✔ GET FULL GRN DETAILS WITH TDS + NET PAYABLE (UPDATED API)
        [HttpGet("GetGRNDetails")]
        public async Task<IActionResult> GetGRNDetails(string invoice)
        {
            if (string.IsNullOrEmpty(invoice))
                return BadRequest(new { success = false, message = "Invoice number is required" });

            // ✅ ToListAsync first — avoids EF Core GetString() NULL crash
            var headerRaw = await _swamiContext.MMM_GRNTbl
                .Where(g => g.Invoice_NO == invoice)
                .ToListAsync();

            var header = headerRaw.Select(g => new
            {
                grnId = g.Id,
                grnNumber = g.GRN_NO ?? "",
                poNumber = g.PO_No ?? "",
                supplierName = g.Supplier_Name ?? "",
                supplierAddress = g.Supplier_Address ?? "",
                grnDate = g.GRN_Date,
                invoiceNumber = g.Invoice_NO ?? "",
                invoiceDate = g.Invoice_Date,
                vehicleNo = g.Vehicle_No ?? "",
                transporterName = g.Transporter ?? "",
                paymentDue = g.Payment_Due_On,
                qcDate = g.QC_Clearance_Date,
                vendorCode = g.GRNVendorCode ?? "",
                DebitNoteNo = g.DebitNoteNo ?? "",
                DebitDate = g.InvIssueDate
            }).FirstOrDefault();

            if (header == null)
                return NotFound(new { success = false, message = "Invoice not found" });

            // ✅ PO Details — ToListAsync first
            var poDetailsRaw = await _swamiContext.MMM_GRNProductTbl
                .Where(p => p.PO_No == header.poNumber)
                .ToListAsync();

            var poDetails = poDetailsRaw.Select(p => new
            {
                PO_No = p.PO_No ?? "",
                purchaseDate = p.Purchase_Date
            }).FirstOrDefault();

            // ✅ Vendor — ToListAsync first to avoid GetString crash
            var vendorRaw = await _swamiContext.Potential_Vendor
                .Where(v => v.Vendor_Code == header.vendorCode)
                .ToListAsync();                          // ← KEY FIX

            var vendor = vendorRaw.FirstOrDefault();

            decimal tdsRate = 0;
            decimal thresholdLimit = 0;
            string vendorType = "";
            bool isTdsApplicable = false;

            if (vendor != null)
            {
                // ✅ Exact same logic as MVC
                isTdsApplicable = vendor.IsTDSApplicable == true;

                if (string.IsNullOrWhiteSpace(vendor.PAN_No))
                {
                    // No PAN → use vendor master TDS rate directly
                    tdsRate = vendor.TDSRate ?? 0;
                    thresholdLimit = vendor.TDSLimit ?? 0;
                    vendorType = "Vendor";
                }
                else
                {
                    // Has PAN → use SubCategory or Category
                    if (vendor.VendorSubCategoryId != null)
                    {
                        var subCatRaw = await _swamiContext.Master_VendorSubCategory
                            .Where(x => x.VendorSubCategoryId == vendor.VendorSubCategoryId)
                            .ToListAsync();

                        var subCategory = subCatRaw.FirstOrDefault();

                        if (subCategory != null)
                        {
                            decimal.TryParse(Convert.ToString(subCategory.TDSRate), out tdsRate);
                            decimal.TryParse(Convert.ToString(subCategory.ThreshouldLimit), out thresholdLimit);
                            vendorType = "SubCategory";
                        }
                    }
                    else if (vendor.VendorCategoryId != null)
                    {
                        var catRaw = await _swamiContext.Master_VendorCategory
                            .Where(x => x.VendorCategoryId == vendor.VendorCategoryId)
                            .ToListAsync();

                        var category = catRaw.FirstOrDefault();

                        if (category != null)
                        {
                            decimal.TryParse(Convert.ToString(category.TDSRate), out tdsRate);
                            decimal.TryParse(Convert.ToString(category.ThreshouldLimit), out thresholdLimit);
                            vendorType = "Category";
                        }
                    }
                }
            }

            // ✅ Total net amount for threshold check
            var vendorProducts = await (
                from grn in _swamiContext.MMM_GRNTbl
                join prod in _swamiContext.MMM_GRNProductTbl
                    on grn.Id equals prod.G_Id
                where grn.GRNVendorCode == header.vendorCode
                select prod
            ).ToListAsync();

            decimal totalNetAmount = 0;
            foreach (var item in vendorProducts)
            {
                decimal.TryParse(Convert.ToString(item.NetAmount), out decimal netAmt);
                totalNetAmount += netAmt;
            }

            // ✅ Same threshold logic as MVC
            isTdsApplicable = isTdsApplicable && totalNetAmount > thresholdLimit;

            // ✅ Product list — already in memory, Select() runs in C# not SQL
            var productList = await _swamiContext.MMM_GRNProductTbl
                .Where(i => i.G_Id == header.grnId)
                .ToListAsync();

            var items = productList.Select(i =>
            {
                decimal.TryParse(Convert.ToString(i.NetAmount), out decimal netAmount);
                decimal.TryParse(Convert.ToString(i.Total_Value), out decimal totalValue);

                decimal invNetAmount = i.InvNetamt ?? 0m;
                decimal invTotalItemVal = i.InvTotalItemVal ?? 0m;

                decimal taxableAmount = invNetAmount <= 0
                    ? netAmount
                    : netAmount - invNetAmount;

                if (taxableAmount < 0) taxableAmount = 0;

                decimal tdsAmount = 0m;
                if (isTdsApplicable && taxableAmount > 0)
                    tdsAmount = (taxableAmount * tdsRate) / 100;

                decimal netPayable = totalValue - invTotalItemVal - tdsAmount;
                if (netPayable < 0) netPayable = 0;
                netPayable = Math.Round(netPayable, 2);

                return new
                {
                    i.G_Id,
                    itemName = i.Item_Name ?? "",
                    grade = i.Item_Descrpition ?? "",
                    itemCode = i.Item_Code ?? "",

                    receivedQty = i.Received_Qty,
                    acceptedQty = i.Accepted_Qty,
                    rejectedQty = i.Rejected_Qty,

                    rate = i.RatePerUnit,
                    taxType = i.TaxType ?? "",
                    taxRate = i.TaxRate ?? "",

                    taxAmount = i.TaxAmount,
                    netAmount = netAmount,
                    totalTaxValue = totalValue,

                    cgst = i.Cgst_Tax_Amt,
                    sgst = i.Sgst_Tax_Amt,
                    igst = i.Igst_Tax_Amt,

                    digst = i.InvIgstAmt,
                    dcgst = i.InvcgstAmt,
                    dsgst = i.InvsgstAmt,

                    dNetAmt = invNetAmount,
                    dTotalTax = i.InvTotalTaxValue,
                    dTotalItemValue = invTotalItemVal,

                    taxableAmount = taxableAmount,
                    tdsRate = tdsRate,
                    tdsAmount = Math.Round(tdsAmount, 2),
                    netPayable = netPayable
                };
            }).ToList();

            return Ok(new
            {
                success = true,
                headerId = header.grnId,
                productCount = productList.Count,
                data = new { header, items, poDetails }
            });
        }

        // ✔ SAVE GRN API (UPDATED SAME AS MVC CODE)
        [HttpPost("SaveGRN")]
        public async Task<IActionResult> SaveGRN([FromBody] BillAndDebitNoteVM model)
        {
            if (model == null || model.AccountGRN == null)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Invalid request"
                });
            }

            using var transaction = await _msmeContext.Database.BeginTransactionAsync();

            try
            {
                // =========================
                // GET VENDOR ID — ToListAsync first (EF Core NULL safety)
                // Same as MVC join logic
                // =========================

                var grnRaw = await _swamiContext.MMM_GRNTbl
                    .Where(g => g.GRN_NO == model.AccountGRN.GRNNumber)
                    .ToListAsync();

                var grnRecord = grnRaw.FirstOrDefault();

                int vendorId = 0;

                if (grnRecord != null)
                {
                    var vendorRaw = await _swamiContext.Potential_Vendor
                        .Where(pv => pv.Vendor_Code == grnRecord.GRNVendorCode)
                        .ToListAsync();

                    vendorId = vendorRaw.FirstOrDefault()?.Id ?? 0;
                }

                // =========================
                // GET QC DATE — same as MVC (.Date only)
                // =========================

                DateOnly? qcDateOnly = null;

                if (grnRecord?.QC_Clearance_Date != null)
                {
                    qcDateOnly = DateOnly.FromDateTime(
                        grnRecord.QC_Clearance_Date.Value
                    );
                }

                // =========================
                // SAVE ACCOUNT GRN — same fields as MVC
                // =========================

                var grn = new AccountGRN
                {
                    VendorId = vendorId,
                    GRNNumber = model.AccountGRN.GRNNumber,
                    InvoiceNumber = model.AccountGRN.InvoiceNumber,
                    Description = model.AccountGRN.Description,
                    CreatedBy = 1,
                    CreatedDate = DateTime.Now.Date,
                    IsActive = true,
                    CheckGRN = model.AccountGRN.CheckGRN,
                    QcApprovedDate = qcDateOnly,
                    TotalNetAmount = model.AccountGRN.TotalNetAmount,
                    CGSTAmount = model.AccountGRN.CGSTAmount,
                    SGSTAmount = model.AccountGRN.SGSTAmount,
                    IGSTAmount = model.AccountGRN.IGSTAmount,
                    TotalAmount = model.AccountGRN.TotalAmount,
                    TDSAmount = model.AccountGRN.TDSAmount,
                    NetPayable = model.AccountGRN.NetPayable
                };

                _msmeContext.AccountGRN.Add(grn);

                // =========================
                // SAVE DEBIT NOTE — ✅ null check on whole object AND property
                // This is the fix for NullReferenceException
                // =========================

                if (model.AccountDebitNote != null &&
                    model.AccountDebitNote.DebitNoteNo != null)
                {
                    var debitNote = new AccountDebitNote
                    {
                        DebitNoteNo = model.AccountDebitNote.DebitNoteNo,
                        VendorId = vendorId,
                        InvoiceNo = model.AccountGRN.InvoiceNumber,
                        CreatedBy = 1,
                        DebitNoteDate = model.AccountDebitNote.DebitNoteDate,
                        CGSTAmount = model.AccountDebitNote.CGSTAmount,
                        SGSTAmount = model.AccountDebitNote.SGSTAmount,
                        IGSTAmount = model.AccountDebitNote.IGSTAmount,
                        TotalNetAmount = model.AccountDebitNote.TotalNetAmount,
                        TotalAmount = model.AccountDebitNote.TotalAmount,
                        IsActive = true,
                        CreatedDate = DateTime.Now.Date
                    };

                    _msmeContext.AccountDebitNote.Add(debitNote);
                }

                // =========================
                // SAVE ONCE — ✅ removed duplicate SaveChanges()
                // =========================

                await _msmeContext.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new
                {
                    success = true,
                    message = "Record saved successfully!",
                    grnId = grn.AccountGRNId
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();

                return StatusCode(500, new
                {
                    success = false,
                    message = ex.InnerException?.Message ?? ex.Message
                });
            }
        }
        [HttpGet("ApproveDebitNote")]
        public async Task<IActionResult> ApproveDebitNote()
        {
            try
            {
                // ✅ ToListAsync first — avoids NULL string crash in EF Core
                var rawData = await (
                    from acc in _msmeContext.AccountDebitNote
                    where acc.ApprovedDebitNote != true
                    join grn in _swamiContext.MMM_GRNTbl
                        on acc.DebitNoteNo equals grn.DebitNoteNo
                    select new
                    {
                        AccountDebitNoteId = acc.AccountDebitNoteId,
                        GRNNumber = grn.GRN_NO,
                        GRNDate = grn.GRN_Date,
                        InvoiceNo = grn.Invoice_NO,
                        InvoiceDate = grn.Invoice_Date,
                        TotalNetAmount = acc.TotalNetAmount,
                        PONumber = grn.PO_No,
                        PODate = grn.GRN_Date,
                        CGSTAmount = acc.CGSTAmount,
                        SGSTAmount = acc.SGSTAmount,
                        IGSTAmount = acc.IGSTAmount,
                        TotalAmount = acc.TotalAmount,
                        VendorId = acc.VendorId,
                        SellerName = grn.Supplier_Name,
                        DebitNoteNo = acc.DebitNoteNo,
                        DebitNoteDate = grn.InvIssueDate,
                    }
                )
                .OrderByDescending(x => x.AccountDebitNoteId)
                .ToListAsync();

                // ✅ In-memory projection — same as MVC
                var data = rawData.Select(x =>
                {
                    decimal totalTaxValue =
                        (x.IGSTAmount ?? 0) > 0
                        ? (x.IGSTAmount ?? 0)
                        : (x.CGSTAmount ?? 0) + (x.SGSTAmount ?? 0);

                    return new
                    {
                        accountDebitNoteId = x.AccountDebitNoteId,
                        grnNumber = x.GRNNumber ?? "",
                        grnDate = x.GRNDate,
                        invoiceNo = x.InvoiceNo ?? "",
                        invoiceDate = x.InvoiceDate,
                        poNumber = x.PONumber ?? "",
                        poDate = x.PODate,
                        totalTaxValue = totalTaxValue,
                        vendorId = x.VendorId,
                        sellerName = x.SellerName ?? "",
                        totalNetAmount = x.TotalNetAmount,
                        totalAmount = x.TotalAmount,
                        debitNoteDate = x.DebitNoteDate,
                        debitNoteNo = x.DebitNoteNo ?? "",
                    };
                }).ToList();

                return Ok(new
                {
                    success = true,
                    count = data.Count,
                    data = data
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.InnerException?.Message ?? ex.Message
                });
            }
        }
        [HttpPost("ApproveDebitNote")]
        public async Task<IActionResult> ApproveDebitNote(string DebitNoteNo, decimal? totalAmount)
        {
            try
            {
                if (string.IsNullOrEmpty(DebitNoteNo))
                    return BadRequest(new { success = false, message = "DebitNoteNo is required" });

                // ===============================
                // UPDATE DEBIT NOTE RECORD
                // ===============================

                var record = await _msmeContext.AccountDebitNote
                    .FirstOrDefaultAsync(x => x.DebitNoteNo == DebitNoteNo);

                if (record == null)
                    return NotFound(new { success = false, message = "Debit Note not found." });

                record.ApprovedDebitNote = true;
                record.UpdatedDate = DateTime.Now.Date;

                await _msmeContext.SaveChangesAsync();

                // ===============================
                // GET GRN FROM swamiContext
                // ===============================

                var grnRaw = await _swamiContext.MMM_GRNTbl
                    .Where(x => x.DebitNoteNo == record.DebitNoteNo)
                    .ToListAsync();

                var getGrn = grnRaw.FirstOrDefault();

                if (getGrn == null)
                    return NotFound(new { success = false, message = "GRN not found" });

                // ===============================
                // GET ALL ITEMS OF THAT GRN
                // ===============================

                var getItems = await _swamiContext.MMM_GRNProductTbl
                    .Where(x => x.G_Id == getGrn.Id)
                    .ToListAsync();

                if (!getItems.Any())
                    return BadRequest(new { success = false, message = "No items found for this GRN" });

                // ===============================
                // GET DISTINCT ITEM CODES
                // ===============================

                var itemCodes = getItems
                    .Select(x => x.Item_Code)
                    .Where(x => !string.IsNullOrEmpty(x))
                    .Distinct()
                    .ToList();

                // ===============================
                // MAP ITEM CODE → LEDGER IDS
                // ===============================

                var masterLedgers = await _swamiContext.MASTER_ItemTbl
                    .Where(x => itemCodes.Contains(x.Item_Code))
                    .Select(x => x.LedgerName ?? "")
                    .Distinct()
                    .ToListAsync();

                List<int> ledgerIds = new List<int>();

                foreach (var ledgerString in masterLedgers)
                {
                    if (string.IsNullOrWhiteSpace(ledgerString)) continue;

                    var ids = ledgerString
                        .Split('|')
                        .Select(x => x.Trim())
                        .Where(x => !string.IsNullOrEmpty(x))
                        .Select(int.Parse);

                    ledgerIds.AddRange(ids);
                }

                ledgerIds = ledgerIds.Distinct().ToList();

                // ===============================
                // GET VENDOR LEDGER IDS — exclude id 5 (same as MVC)
                // ===============================

                var masterVendorLedgerRaw = await _swamiContext.Potential_Vendor
                    .Where(x => x.Vendor_Code == getGrn.GRNVendorCode)
                    .ToListAsync();

                var masterVendorLedger = masterVendorLedgerRaw
                    .Select(x => x.LedgerName ?? "")
                    .ToList();

                List<int> vendorLedgerIds = new List<int>();

                foreach (var ledgerString in masterVendorLedger)
                {
                    if (string.IsNullOrWhiteSpace(ledgerString)) continue;

                    var ids = ledgerString
                        .Split('|')
                        .Select(x => x.Trim())
                        .Where(x => !string.IsNullOrEmpty(x))
                        .Select(x => int.Parse(x))
                        .Where(id => id != 5);          // ✅ same as MVC — exclude 5

                    vendorLedgerIds.AddRange(ids);
                }

                vendorLedgerIds = vendorLedgerIds.Distinct().ToList();

                // ===============================
                // GET LEDGER MAPPINGS
                // ===============================

                var ledgerMappings = await _msmeContext.AccountLedger
                    .Where(x => ledgerIds.Contains(x.AccountLedgerId))
                    .ToListAsync();

                var vendorLedgerMappings = await _msmeContext.AccountLedger
                    .Where(x => vendorLedgerIds.Contains(x.AccountLedgerId))
                    .ToListAsync();

                // ===============================
                // CONVERT DateOnly? → DateTime? ONCE
                // ===============================

                DateTime? invoiceDateTime = getGrn.Invoice_Date.HasValue
                    ? getGrn.Invoice_Date.Value.ToDateTime(TimeOnly.MinValue)
                    : (DateTime?)null;

                DateTime? qcDateTime = getGrn.QC_Clearance_Date.HasValue
                    ? getGrn.QC_Clearance_Date
                    : (DateTime?)null;

                // ===============================
                // CREATE ACCOUNTING ENTRIES — use CreditDebitNoteColumn (same as MVC)
                // ===============================

                foreach (var map in ledgerMappings.Concat(vendorLedgerMappings))
                {
                    if (string.IsNullOrEmpty(map.CreditDebitNoteColumn))
                        continue;

                    decimal amount = 0;

                    // 1️⃣ Try Product Table
                    foreach (var item in getItems)
                    {
                        var property = item.GetType().GetProperty(map.CreditDebitNoteColumn);
                        if (property != null)
                        {
                            var value = property.GetValue(item);
                            if (value != null)
                                amount += Convert.ToDecimal(value);
                        }
                    }

                    // 2️⃣ Try GRN Header
                    if (amount == 0)
                    {
                        var grnProp = getGrn.GetType().GetProperty(map.CreditDebitNoteColumn);
                        if (grnProp != null)
                        {
                            var value = grnProp.GetValue(getGrn);
                            if (value != null)
                                amount = Convert.ToDecimal(value);
                        }
                    }

                    // 3️⃣ Try AccountDebitNote record
                    if (amount == 0)
                    {
                        var accProp = record.GetType().GetProperty(map.CreditDebitNoteColumn);
                        if (accProp != null)
                        {
                            var value = accProp.GetValue(record);
                            if (value != null)
                                amount = Convert.ToDecimal(value);
                        }
                    }

                    if (amount <= 0) continue;

                    decimal credit = map.CreditDebitNoteCrDr == "Credit" ? amount : 0;
                    decimal debit = map.CreditDebitNoteCrDr == "Debit" ? amount : 0;

                    AddLedgerDebitNoteEntry(
                        map.AccountLedgerId,
                        getGrn.Invoice_NO,
                        invoiceDateTime,       // ✅ DateTime?
                        credit,
                        debit,
                        getGrn.GRNVendorCode,
                        qcDateTime             // ✅ DateTime?
                    );
                }

                await _msmeContext.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Debit Note Approved and Accounting Entry Created"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.InnerException?.Message ?? ex.Message
                });
            }
        }

        // ===============================
        // HELPER — AddLedgerDebitNoteEntry (same logic as MVC)
        // ===============================

        private void AddLedgerDebitNoteEntry(
            int ledgerId,
            string Invoice_NO,
            DateTime? InvoiceDate,
            decimal credit,
            decimal debit,
            string Vendorcode,
            DateTime? qcDate)
        {
            decimal subOpeningBalance = 0;
            decimal subClosingBalance = 0;
            int subLedgerId = 0;

            // ===============================
            // SUBLEDGER BALANCE — with primary group logic
            // ===============================

            if (Vendorcode != null)
            {
                var result = (from subl in _msmeContext.AccountSubLedger
                              join l in _msmeContext.AccountLedger
                                  on subl.AccountLedgerid equals l.AccountLedgerId
                              join p in _msmeContext.AccountPrimaryGroup
                                  on l.PrimaryGroupId equals p.PrimaryGroupId
                              where subl.AccountLedgerid == ledgerId
                                    && subl.AssetsCode == Vendorcode
                              select new
                              {
                                  subl.AccountLedgerSubid,
                                  p.AccountPrimaryGroupName
                              }).FirstOrDefault();

                if (result != null)
                {
                    subLedgerId = result.AccountLedgerSubid;
                    string primaryGroupName = result.AccountPrimaryGroupName;

                    if (primaryGroupName.Contains("Liabilities"))
                    {
                        subOpeningBalance = GetLastClosingBalanceSub(result.AccountLedgerSubid);
                        subClosingBalance = subOpeningBalance;

                        if (credit > 0) subClosingBalance += credit;
                        if (debit > 0) subClosingBalance -= debit;
                    }
                    else if (primaryGroupName.Contains("Assets") ||
                             primaryGroupName.Contains("Expenses"))
                    {
                        subOpeningBalance = GetLastClosingBalanceSub(result.AccountLedgerSubid);
                        subClosingBalance = subOpeningBalance;

                        if (credit > 0) subClosingBalance -= credit;
                        if (debit > 0) subClosingBalance += debit;
                    }
                }
            }

            // ===============================
            // LEDGER BALANCE — with primary group logic
            // ===============================

            var groupId = (from l in _msmeContext.AccountLedger
                           join g in _msmeContext.AccountPrimaryGroup
                               on l.PrimaryGroupId equals g.PrimaryGroupId
                           where l.AccountLedgerId == ledgerId
                           select new { g.AccountPrimaryGroupName })
                           .FirstOrDefault();

            decimal openingBalance = 0;
            decimal closingBalance = 0;

            if (groupId != null)
            {
                if (groupId.AccountPrimaryGroupName.Contains("Liabilities"))
                {
                    openingBalance = GetLastClosingBalance(ledgerId);
                    closingBalance = openingBalance;

                    if (credit > 0) closingBalance += credit;
                    if (debit > 0) closingBalance -= debit;
                }
                else if (groupId.AccountPrimaryGroupName.Contains("Assets") ||
                         groupId.AccountPrimaryGroupName.Contains("Expenses"))
                {
                    openingBalance = GetLastClosingBalance(ledgerId);
                    closingBalance = openingBalance;

                    if (credit > 0) closingBalance -= credit;
                    if (debit > 0) closingBalance += debit;
                }
            }

            // ===============================
            // INSERT LEDGER ENTRY
            // ===============================

            var transaction = new AccountLedgerCrDR
            {
                LedegrId = ledgerId,
                InvoiceNO = Invoice_NO,
                Date = qcDate,
                OpeningBalance = openingBalance,
                Credit = credit,
                Debit = debit,
                ClosingBalance = closingBalance,
                SubLedgerId = subLedgerId,
                SubOpeningBal = subOpeningBalance,
                SubClosingBal = subClosingBalance,
                InvoiceDate = InvoiceDate,
                Type = "DEBIT NOTE"      // ✅ same as MVC
            };

            _msmeContext.AccountLedgerCrDR.Add(transaction);

            // ===============================
            // UPDATE LEDGER CLOSING BALANCE
            // ===============================

            var ledger = _msmeContext.AccountLedger
                .FirstOrDefault(l => l.AccountLedgerId == ledgerId);

            if (ledger != null)
                ledger.ClosingBal = closingBalance;

            // ===============================
            // UPDATE SUBLEDGER CLOSING BALANCE
            // ===============================

            var subledgervendor = _msmeContext.AccountSubLedger
                .FirstOrDefault(i => i.AssetsCode == Vendorcode &&
                                     i.AccountLedgerid == ledgerId);

            if (subledgervendor != null)
                subledgervendor.ClosingBal = subClosingBalance;
        }
        [HttpGet("GetgrnSellers")]
        public IActionResult GetgrnSellers()
        {
            var sellers = _msmeContext.AccountGRN
                .Where(g => g.IsActive == true && g.Description != null)
                .Select(g => new
                {
                    id = g.VendorId,
                    name = g.Description ?? ""
                })
                .Distinct()
                .ToList();

            return Ok(new { success = true, data = sellers });
        }
     
        [HttpGet("GetGRNsBySeller")]
        public async Task<IActionResult> GetGRNsBySeller()
        {
            try
            {
                // ✅ STEP 1: Get Account GRNs (Context 1)
                var accountGrns = await _msmeContext.AccountGRN
                    .Where(x => x.ApprovedGRN != true)
                    .Select(x => new
                    {
                        x.GRNNumber,
                        x.TotalAmount,
                        x.VendorId,
                        x.AccountGRNId
                    })
                    .ToListAsync();

                var grnNumbers = accountGrns.Select(x => x.GRNNumber).ToList();

                // ✅ STEP 2: Get GRN + Items (Context 2)
                var grnData = await (
                    from g in _swamiContext.MMM_GRNTbl
                    join p in _swamiContext.MMM_GRNProductTbl
                        on g.Id equals p.G_Id
                    where grnNumbers.Contains(g.GRN_NO)
                    select new
                    {
                        g.GRN_NO,
                        g.GRN_Date,
                        g.Invoice_NO,
                        g.Invoice_Date,
                        g.PO_No,
                        p.Purchase_Date,
                        g.Supplier_Name,
                        p.Item_Name,
                        p.Item_Descrpition,
                        p.TaxAmount,
                        p.Total_Value
                    }
                ).ToListAsync();

                // ✅ STEP 3: JOIN IN MEMORY (IMPORTANT)
                var result = (
                    from acc in accountGrns
                    join g in grnData
                        on acc.GRNNumber equals g.GRN_NO
                    select new
                    {
                        grnNumber = g.GRN_NO,
                        grnDate = g.GRN_Date,

                        invoiceNo = g.Invoice_NO,
                        invoiceDate = g.Invoice_Date,

                        poNumber = g.PO_No,

                        poDate = DateTime.TryParse(g.Purchase_Date, out DateTime parsedDate)
                            ? parsedDate
                            : (DateTime?)null,

                        itemName = g.Item_Name,
                        grade = g.Item_Descrpition,

                        totalTaxValue = decimal.TryParse(g.TaxAmount, out decimal tax)
                            ? tax
                            : 0,

                        totalAmount = decimal.TryParse(g.Total_Value, out decimal amt)
                            ? amt
                            : 0,

                        grandTotal =
                            (decimal.TryParse(g.Total_Value, out decimal a) ? a : 0)
                          + (decimal.TryParse(g.TaxAmount, out decimal t) ? t : 0),

                        vendorId = acc.VendorId,
                        sellerName = g.Supplier_Name
                    }
                )
                .OrderByDescending(x => x.grnNumber)
                .ToList();

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [HttpPost("ApproveGrns")]
        public async Task<IActionResult> ApproveGrns(string grnNumber, decimal? totalAmount)
        {
            try
            {
                if (string.IsNullOrEmpty(grnNumber))
                    return BadRequest(new { success = false, message = "Invalid GRN number" });

                // ===============================
                // GET VENDOR CODE FROM GRN — same as MVC
                // ===============================

                var grnRaw = await _swamiContext.MMM_GRNTbl
                    .Where(x => x.GRN_NO == grnNumber)
                    .ToListAsync();

                var getGrn = grnRaw.FirstOrDefault();

                if (getGrn == null)
                    return NotFound(new { success = false, message = "GRN not found in master" });

                string getVendorCode = getGrn.GRNVendorCode ?? "";

                // ===============================
                // CHECK VENDOR SUBLEDGER — same as MVC
                // ===============================

                bool checkVendorCode = await _msmeContext.AccountSubLedger
                    .AnyAsync(x => x.AssetsCode == getVendorCode);

                if (!checkVendorCode)
                    return BadRequest(new
                    {
                        success = false,
                        message = "Please create subledger for the Seller."
                    });

                // ===============================
                // GET VENDOR DETAILS — same as MVC
                // ===============================

                var vendorRaw = await _swamiContext.Potential_Vendor
                    .Where(x => x.Vendor_Code == getVendorCode)
                    .ToListAsync();

                var vendorDetails1 = vendorRaw.FirstOrDefault();

                // ===============================
                // CHECK SECTION SUBLEDGER
                // ONLY WHEN PAN NUMBER IS NULL — same as MVC
                // ===============================

                if (vendorDetails1 != null &&
                    string.IsNullOrWhiteSpace(vendorDetails1.PAN_No))
                {
                    string sectionName = vendorDetails1.TDSSection ?? "";

                    bool checkSectionLedger = await _msmeContext.AccountSubLedger
                        .AnyAsync(x => x.AccountLedgerSubName == sectionName);

                    if (!checkSectionLedger)
                        return BadRequest(new
                        {
                            success = false,
                            message = "Please create Section SubLedger for : " + sectionName
                        });
                }

                // ===============================
                // UPDATE ACCOUNT GRN — same as MVC
                // ===============================

                var record = await _msmeContext.AccountGRN
                    .FirstOrDefaultAsync(x => x.GRNNumber == grnNumber);

                if (record == null)
                    return NotFound(new { success = false, message = "GRN not found." });

                record.ApprovedGRN = true;
                record.NetPayable = totalAmount;   // ✅ NetPayable not TotalAmount
                record.ApprovedDate = DateOnly.FromDateTime(DateTime.Now);

                await _msmeContext.SaveChangesAsync();

                // ===============================
                // GET ALL ITEMS OF THAT GRN — same as MVC
                // ===============================

                var getItems = await _swamiContext.MMM_GRNProductTbl
                    .Where(x => x.G_Id == getGrn.Id)
                    .ToListAsync();

                if (!getItems.Any())
                    return BadRequest(new { success = false, message = "No items found for this GRN" });

                // ===============================
                // GET DISTINCT ITEM CODES — same as MVC
                // ===============================

                var itemCodes = getItems
                    .Select(x => x.Item_Code)
                    .Where(x => !string.IsNullOrEmpty(x))
                    .Distinct()
                    .ToList();

                // ===============================
                // MAP ITEM CODE → LEDGER IDS — same as MVC
                // ===============================

                var masterLedgers = await _swamiContext.MASTER_ItemTbl
                    .Where(x => itemCodes.Contains(x.Item_Code))
                    .Select(x => x.LedgerName ?? "")
                    .Distinct()
                    .ToListAsync();

                List<int> ledgerIds = new List<int>();

                foreach (var ledgerString in masterLedgers)
                {
                    if (string.IsNullOrWhiteSpace(ledgerString)) continue;

                    var ids = ledgerString
                        .Split('|')
                        .Select(x => x.Trim())
                        .Where(x => !string.IsNullOrEmpty(x))
                        .Select(int.Parse);

                    ledgerIds.AddRange(ids);
                }

                ledgerIds = ledgerIds.Distinct().ToList();

                // ===============================
                // GET VENDOR LEDGER IDS — same as MVC
                // ===============================

                var masterVendorLedgerRaw = await _swamiContext.Potential_Vendor
                    .Where(x => x.Vendor_Code == getGrn.GRNVendorCode)
                    .ToListAsync();

                var masterVendorLedger = masterVendorLedgerRaw
                    .Select(x => x.LedgerName ?? "")
                    .ToList();

                List<int> vendorLedgerIds = new List<int>();

                foreach (var ledgerString in masterVendorLedger)
                {
                    if (string.IsNullOrWhiteSpace(ledgerString)) continue;

                    var ids = ledgerString
                        .Split('|')
                        .Select(x => x.Trim())
                        .Where(x => !string.IsNullOrEmpty(x))
                        .Select(int.Parse);

                    vendorLedgerIds.AddRange(ids);
                }

                vendorLedgerIds = vendorLedgerIds
                    .Distinct()
                    .Reverse()
                    .ToList();

                // ===============================
                // GET LEDGER MAPPINGS — same as MVC
                // ===============================

                var ledgerMappings = await _msmeContext.AccountLedger
                    .Where(x => ledgerIds.Contains(x.AccountLedgerId))
                    .ToListAsync();

                var vendorLedgerMappings = await _msmeContext.AccountLedger
                    .Where(x => vendorLedgerIds.Contains(x.AccountLedgerId))
                    .ToListAsync();

                // ===============================
                // BALANCE CACHES — same as MVC
                // ===============================

                var ledgerBalanceCache = new Dictionary<int, (decimal opening, decimal closing)>();
                var subLedgerBalanceCache = new Dictionary<int, (decimal opening, decimal closing)>();

                // ===============================
                // CREATE ACCOUNTING ENTRIES — same as MVC
                // ===============================
                // ===============================
                // ✅ CONVERT DateOnly? to DateTime? ONCE — before the foreach loop
                // ===============================

                DateTime? invoiceDateTime = getGrn.Invoice_Date.HasValue
                    ? getGrn.Invoice_Date.Value.ToDateTime(TimeOnly.MinValue)
                    : (DateTime?)null;

                DateTime? qcDateTime = getGrn.QC_Clearance_Date.HasValue
                    ? getGrn.QC_Clearance_Date
                    : (DateTime?)null;

                // ===============================
                // CREATE ACCOUNTING ENTRIES
                // ===============================

                foreach (var map in ledgerMappings.Concat(vendorLedgerMappings))
                {
                    if (string.IsNullOrEmpty(map.GRNInvColumnName))
                        continue;

                    decimal amount = 0;

                    // 1️⃣ Try Product Table
                    foreach (var item in getItems)
                    {
                        var property = item.GetType().GetProperty(map.GRNInvColumnName);
                        if (property != null)
                        {
                            var value = property.GetValue(item);
                            if (value != null)
                                amount += Convert.ToDecimal(value);
                        }
                    }

                    // 2️⃣ Try GRN Header
                    if (amount == 0)
                    {
                        var grnProp = getGrn.GetType().GetProperty(map.GRNInvColumnName);
                        if (grnProp != null)
                        {
                            var value = grnProp.GetValue(getGrn);
                            if (value != null)
                                amount = Convert.ToDecimal(value);
                        }
                    }

                    // 3️⃣ Try AccountGRN record
                    if (amount == 0)
                    {
                        var accProp = record.GetType().GetProperty(map.GRNInvColumnName);
                        if (accProp != null)
                        {
                            var value = accProp.GetValue(record);
                            if (value != null)
                                amount = Convert.ToDecimal(value);
                        }
                    }

                    if (amount <= 0) continue;

                    decimal credit = map.CrDr == "Credit" ? amount : 0;
                    decimal debit = map.CrDr == "Debit" ? amount : 0;

                    int? subLedgerId = null;
                    string entryType = null;

                    // ===============================
                    // TDS ENTRY
                    // ===============================

                    if (map.GRNInvColumnName == "TDSAmount")
                    {
                        var vendorTdsRaw = await _swamiContext.Potential_Vendor
                            .Where(x => x.Vendor_Code == getGrn.GRNVendorCode)
                            .ToListAsync();

                        var vendorDetails = vendorTdsRaw.FirstOrDefault();

                        string sectionName = "";

                        if (vendorDetails != null)
                        {
                            if (string.IsNullOrWhiteSpace(vendorDetails.PAN_No))
                            {
                                sectionName = vendorDetails.TDSSection ?? "";
                            }
                            else
                            {
                                var catRaw = await _swamiContext.Master_VendorCategory
                                    .Where(x => x.VendorCategoryId == vendorDetails.VendorCategoryId)
                                    .ToListAsync();

                                sectionName = catRaw.FirstOrDefault()?.Section ?? "";
                            }
                        }

                        var vendorSubLedgerId = await _msmeContext.AccountSubLedger
                            .Where(x => x.AssetsCode == getGrn.GRNVendorCode)
                            .Select(x => x.AccountLedgerSubid)
                            .FirstOrDefaultAsync();

                        var sectionSubLedgerIds = await _msmeContext.AccountSubLedger
                            .Where(x => x.AccountLedgerid == map.AccountLedgerId &&
                                        x.AccountLedgerSubName == sectionName)
                            .Select(x => x.AccountLedgerSubid)
                            .ToListAsync();

                        if (vendorSubLedgerId != 0)
                        {
                            AddLedgerEntry(
                                map.AccountLedgerId,
                                getGrn.Invoice_NO,
                                invoiceDateTime,       // ✅ DateTime?
                                credit, debit,
                                getGrn.GRNVendorCode,
                                qcDateTime,            // ✅ DateTime?
                                vendorSubLedgerId,
                                "TDS",
                                ledgerBalanceCache,
                                subLedgerBalanceCache
                            );
                        }

                        foreach (var subId in sectionSubLedgerIds)
                        {
                            AddLedgerEntry(
                                map.AccountLedgerId,
                                getGrn.Invoice_NO,
                                invoiceDateTime,       // ✅ DateTime?
                                credit, debit,
                                getGrn.GRNVendorCode,
                                qcDateTime,            // ✅ DateTime?
                                subId,
                                "TDS SECTION",
                                ledgerBalanceCache,
                                subLedgerBalanceCache
                            );
                        }

                        continue;
                    }

                    // ===============================
                    // NORMAL ENTRY
                    // ===============================

                    AddLedgerEntry(
                        map.AccountLedgerId,
                        getGrn.Invoice_NO,
                        invoiceDateTime,           // ✅ DateTime?
                        credit, debit,
                        getGrn.GRNVendorCode,
                        qcDateTime,                // ✅ DateTime?
                        subLedgerId,
                        entryType,
                        ledgerBalanceCache,
                        subLedgerBalanceCache
                    );
                }

                await _msmeContext.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "GRN Approved and Accounting Entry Created"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.InnerException?.Message ?? ex.Message
                });
            }
        }

        // ===============================
        // HELPER — GetLastClosingBalance
        // ===============================

        private decimal GetLastClosingBalance(int ledgerId)
        {
            var lastRecord = _msmeContext.AccountLedgerCrDR
                .Where(x => x.LedegrId == ledgerId)
                .OrderByDescending(x => x.LedgerCrDrId)
                .FirstOrDefault();

            if (lastRecord == null)
            {
                var ledger = _msmeContext.AccountLedger
                    .FirstOrDefault(l => l.AccountLedgerId == ledgerId);

                if (ledger != null)
                    return ledger.OpeningBal ?? 0;
            }

            return lastRecord != null ? (lastRecord.ClosingBalance ?? 0) : 0;
        }

        // ===============================
        // HELPER — GetLastClosingBalanceSub
        // ===============================

        private decimal GetLastClosingBalanceSub(int subledgerId)
        {
            var lastRecord = _msmeContext.AccountLedgerCrDR
                .Where(x => x.SubLedgerId == subledgerId)
                .OrderByDescending(x => x.LedgerCrDrId)
                .FirstOrDefault();

            if (lastRecord == null)
            {
                var ledger = _msmeContext.AccountSubLedger
                    .FirstOrDefault(l => l.AccountLedgerSubid == subledgerId);

                if (ledger != null)
                    return ledger.OpeningBal ?? 0;
            }

            return lastRecord != null ? (lastRecord.SubClosingBal ?? 0) : 0;
        }

        // ===============================
        // HELPER — AddLedgerEntry (full MVC version with cache + primary group)
        // ===============================

        private void AddLedgerEntry(
            int ledgerId,
            string Invoice_NO,
            DateTime? InvoiceDate,
            decimal credit,
            decimal debit,
            string Vendorcode,
            DateTime? qcDate,
            int? subLedgerId,
            string type,
            Dictionary<int, (decimal opening, decimal closing)> ledgerBalanceCache,
            Dictionary<int, (decimal opening, decimal closing)> subLedgerBalanceCache)
        {
            decimal subOpeningBalance = 0;
            decimal subClosingBalance = 0;

            // ===============================
            // SUBLEDGER BALANCE — with primary group logic
            // ===============================

            if (!subLedgerId.HasValue)
            {
                var result = (from subl in _msmeContext.AccountSubLedger
                              join l in _msmeContext.AccountLedger on subl.AccountLedgerid equals l.AccountLedgerId
                              join p in _msmeContext.AccountPrimaryGroup on l.PrimaryGroupId equals p.PrimaryGroupId
                              where subl.AccountLedgerid == ledgerId
                                    && subl.AssetsCode == Vendorcode
                              select new
                              {
                                  subl.AccountLedgerSubid,
                                  p.AccountPrimaryGroupName
                              }).FirstOrDefault();

                if (result != null)
                {
                    subLedgerId = result.AccountLedgerSubid;

                    if (subLedgerBalanceCache.ContainsKey(subLedgerId.Value))
                    {
                        subOpeningBalance = subLedgerBalanceCache[subLedgerId.Value].opening;
                        subClosingBalance = subLedgerBalanceCache[subLedgerId.Value].closing;
                    }
                    else
                    {
                        subOpeningBalance = GetLastClosingBalanceSub(result.AccountLedgerSubid);
                        subClosingBalance = subOpeningBalance;

                        if (result.AccountPrimaryGroupName.Contains("Liabilities"))
                        {
                            if (credit > 0) subClosingBalance += credit;
                            if (debit > 0) subClosingBalance -= debit;
                        }
                        else if (result.AccountPrimaryGroupName.Contains("Assets") ||
                                 result.AccountPrimaryGroupName.Contains("Expenses"))
                        {
                            if (credit > 0) subClosingBalance -= credit;
                            if (debit > 0) subClosingBalance += debit;
                        }

                        subLedgerBalanceCache[subLedgerId.Value] = (subOpeningBalance, subClosingBalance);
                    }
                }
            }
            else
            {
                var result1 = (from subl in _msmeContext.AccountSubLedger
                               join l in _msmeContext.AccountLedger on subl.AccountLedgerid equals l.AccountLedgerId
                               join p in _msmeContext.AccountPrimaryGroup on l.PrimaryGroupId equals p.PrimaryGroupId
                               where subl.AccountLedgerSubid == subLedgerId
                               select new
                               {
                                   subl.AccountLedgerSubid,
                                   p.AccountPrimaryGroupName
                               }).FirstOrDefault();

                if (result1 != null)
                {
                    subLedgerId = result1.AccountLedgerSubid;

                    if (subLedgerBalanceCache.ContainsKey(subLedgerId.Value))
                    {
                        subOpeningBalance = subLedgerBalanceCache[subLedgerId.Value].opening;
                        subClosingBalance = subLedgerBalanceCache[subLedgerId.Value].closing;
                    }
                    else
                    {
                        subOpeningBalance = GetLastClosingBalanceSub(result1.AccountLedgerSubid);
                        subClosingBalance = subOpeningBalance;

                        if (result1.AccountPrimaryGroupName.Contains("Liabilities"))
                        {
                            if (credit > 0) subClosingBalance += credit;
                            if (debit > 0) subClosingBalance -= debit;
                        }
                        else if (result1.AccountPrimaryGroupName.Contains("Assets") ||
                                 result1.AccountPrimaryGroupName.Contains("Expenses"))
                        {
                            if (credit > 0) subClosingBalance -= credit;
                            if (debit > 0) subClosingBalance += debit;
                        }

                        subLedgerBalanceCache[subLedgerId.Value] = (subOpeningBalance, subClosingBalance);
                    }
                }
            }

            // ===============================
            // LEDGER BALANCE — with primary group logic
            // ===============================

            var groupId = (from l in _msmeContext.AccountLedger
                           join g in _msmeContext.AccountPrimaryGroup
                               on l.PrimaryGroupId equals g.PrimaryGroupId
                           where l.AccountLedgerId == ledgerId
                           select new { g.AccountPrimaryGroupName }).FirstOrDefault();

            decimal openingBalance = 0;
            decimal closingBalance = 0;

            if (ledgerBalanceCache.ContainsKey(ledgerId))
            {
                openingBalance = ledgerBalanceCache[ledgerId].opening;
                closingBalance = ledgerBalanceCache[ledgerId].closing;
            }
            else
            {
                openingBalance = GetLastClosingBalance(ledgerId);
                closingBalance = openingBalance;

                if (groupId?.AccountPrimaryGroupName.Contains("Liabilities") == true)
                {
                    if (credit > 0) closingBalance += credit;
                    if (debit > 0) closingBalance -= debit;
                }
                else if (groupId?.AccountPrimaryGroupName.Contains("Assets") == true ||
                         groupId?.AccountPrimaryGroupName.Contains("Expenses") == true)
                {
                    if (credit > 0) closingBalance -= credit;
                    if (debit > 0) closingBalance += debit;
                }

                ledgerBalanceCache[ledgerId] = (openingBalance, closingBalance);
            }

            // ===============================
            // INSERT LEDGER ENTRY
            // ===============================

            var transaction = new AccountLedgerCrDR
            {
                LedegrId = ledgerId,
                InvoiceNO = Invoice_NO,
                Date = qcDate,
                OpeningBalance = openingBalance,
                Credit = credit,
                Debit = debit,
                ClosingBalance = closingBalance,
                SubLedgerId = subLedgerId,
                SubOpeningBal = subOpeningBalance,
                SubClosingBal = subClosingBalance,
                InvoiceDate = InvoiceDate,
                Type = string.IsNullOrEmpty(type) ? "PURCHASE" : type
            };

            _msmeContext.AccountLedgerCrDR.Add(transaction);
            _msmeContext.SaveChanges();

            // ===============================
            // UPDATE LEDGER CLOSING BALANCE
            // ===============================

            var ledger = _msmeContext.AccountLedger
                .FirstOrDefault(l => l.AccountLedgerId == ledgerId);

            if (ledger != null)
                ledger.ClosingBal = closingBalance;

            // ===============================
            // UPDATE SUBLEDGER CLOSING BALANCE
            // ===============================

            var subledgervendor = _msmeContext.AccountSubLedger
                .FirstOrDefault(i => i.AssetsCode == Vendorcode &&
                                     i.AccountLedgerid == ledgerId);

            if (subledgervendor != null)
                subledgervendor.ClosingBal = subClosingBalance;
        }
        //[HttpGet("Vendorcategories")]
        //public async Task<IActionResult> GetCategories()
        //{
        //    try
        //    {
        //        var categories = await _swamiContext.Master_VendorCategory
        //            .Where(x => x.IsActive == true)
        //            .Select(x => new
        //            {
        //                id = x.VendorCategoryId,
        //                name = x.VendorCategory
        //            })
        //            .ToListAsync();

        //        return Ok(new
        //        {
        //            success = true,
        //            data = categories
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Error fetching vendor categories");

        //        return StatusCode(500, new
        //        {
        //            success = false,
        //            message = "Error fetching categories"
        //        });
        //    }
        //}
        [HttpGet("salesbuyers")]
        public async Task<IActionResult> GetSalesBuyers()
        {
            try
            {
                var buyers = await _swamiContext.MASTER_SalesBuyerTbl
                    .Select(x => new
                    {
                        id = x.Id,
                        company_Name = x.Company_Name,
                        vendorCode = x.Vendor_Code,
                        address = x.Address,
                        city = x.City,
                        contact_Person = x.Contact_Person,
                        contact_Number = x.Contact_Number,
                        gst_Number = x.GST_Number,
                        email = x.Email,


                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = buyers
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching buyers");

                return StatusCode(500, new
                {
                    success = false,
                    message = "Error fetching buyers"
                });
            }
        }

     
        [HttpPost("SaveNonGRN")]
        public async Task<IActionResult> SaveNonGRN([FromBody] NonGRNSaveRequest model)
        {
            try
            {
                if (model == null) return BadRequest("Invalid data");

                int vendorId = model.Vendor.AccountVendorId;
                long employeeId = model.Invoice.EmployeeId ?? 0;
                string tempVendorCode = "";

                // Step 1: Create Vendor if not exists
                if (vendorId == 0 && employeeId == 0)
                {
                    string today = DateTime.Now.ToString("ddMMyyyy");
                    string prefix = "T/" + today + "/";
                    var lastCode = _msmeContext.AccountVendor
                                     .Where(x => x.VendorCode.StartsWith(prefix))
                                     .OrderByDescending(x => x.VendorCode)
                                     .Select(x => x.VendorCode)
                                     .FirstOrDefault();

                    int nextNumber = 1;
                    if (!string.IsNullOrEmpty(lastCode))
                        nextNumber = Convert.ToInt32(lastCode.Split('/').Last()) + 1;

                    tempVendorCode = prefix + nextNumber.ToString("D4");

                    var newVendor = new AccountVendor
                    {
                        VendorName = model.Vendor.VendorName,
                        VendorCode = tempVendorCode,
                        Address = model.Vendor.Address,
                        City = model.Vendor.City,
                        GSTNo = model.Vendor.GSTNo,
                        EmailID = model.Vendor.EmailID,
                        ContactPerson = model.Vendor.ContactPerson,
                        ContactNo = model.Vendor.ContactNo,
                        BanckName = model.Vendor.BanckName,
                        BranchName = model.Vendor.BranchName,
                        AccountNo = model.Vendor.AccountNo,
                        IFSCCode = model.Vendor.IFSCCode,
                        CreatedBy = 1,
                        CreatedDate = DateTime.Now,
                        IsActive = true,
                    };

                    _msmeContext.AccountVendor.Add(newVendor);
                    await _msmeContext.SaveChangesAsync();
                    vendorId = newVendor.AccountVendorId;
                }

                // Step 2: Insert Invoice
                var invoice = new AccountNonGRNInvoice
                {
                    InvoiceNo = model.Invoice.InvoiceNo,
                    InvoiceDate = model.Invoice.InvoiceDate,
                    NonGrnInvoice = model.Invoice.NonGrnInvoice,
                    PayDueDate = model.Invoice.PayDueDate,
                    VendorId = vendorId,
                    EmployeeId = model.Invoice.EmployeeId == 0 ? null : model.Invoice.EmployeeId,
                    VendorCode = string.IsNullOrEmpty(model.Vendor.VendorCode) ? tempVendorCode : model.Vendor.VendorCode,
                    TotalAmount = model.Details.Sum(i => i.TotalValue),
                    TotalTaxAmount = model.Details.Sum(i => i.TaxAmount),
                    SGSTAmount = model.Details.Sum(i => i.SGST),
                    CGSTAmount = model.Details.Sum(i => i.CGST),
                    IGSTAmount = model.Details.Sum(i => i.IGST),
                    CreatedBy = 1,
                    CreatedDate = DateTime.Now,
                    IsActive = true,
                };

                _msmeContext.AccountNonGRNInvoice.Add(invoice);
                await _msmeContext.SaveChangesAsync();

                long invoiceId = invoice.NonGrnInvoiceId;

                // Step 3: Insert Item Details
                foreach (var item in model.Details)
                {
                    var detail = new AccountNonGRNInvoiceDetails
                    {
                        NonGrnId = invoiceId,
                        Description = item.Itemname,
                        Qty = item.Qty,
                        BasicAmount = item.BasicAmount,
                        TaxType = item.TaxType,
                        TaxAmount = item.TaxAmount,
                        TotalValue = item.TotalValue,
                        LedgerId = item.LedgerId,
                        IGST = item.IGST,
                        CGST = item.CGST,
                        SGST = item.SGST,
                        TaxRate = item.TaxRate
                    };
                    _msmeContext.AccountNonGRNInvoiceDetails.Add(detail);
                }

                await _msmeContext.SaveChangesAsync();
                return Ok(new { success = true, invoiceId = invoiceId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error while saving Non-GRN Invoice",
                    error = ex.Message,
                    innerError = ex.InnerException?.Message
                });
            }
        }
        [HttpGet("GetApproveSellerNonGrnSo")]
        public IActionResult GetApproveSellerNonGrnSo(string type)
        {
            try
            {
                // Get all VendorIds used in invoices
                var vendorIds = _msmeContext.AccountNonGRNInvoice
                    .Where(x => x.VendorId != null && x.VendorId != 0)
                    .Select(x => x.VendorId)
                    .Distinct()
                    .ToList();

                if (type == "NonGRN")
                {
                    // 1️⃣ Regular Vendors
                    var regularVendors = _swamiContext.Potential_Vendor
                        .Where(x => vendorIds.Contains(x.Id))
                        .Select(x => new
                        {
                            VendorId = x.Id,
                            VendorName = x.Company_Name ?? ""
                        })
                        .ToList();

                    // 2️⃣ Temporary Vendors
                    var tempVendors = _msmeContext.AccountVendor
                        .Where(x => vendorIds.Contains(x.AccountVendorId))
                        .Select(x => new
                        {
                            VendorId = x.AccountVendorId,
                            VendorName = x.VendorName ?? ""
                        })
                        .ToList();

                    // Merge both lists
                    var vendors = regularVendors
                        .Concat(tempVendors)
                        .GroupBy(x => x.VendorId)
                        .Select(g => g.First())
                        .ToList();

                    return Ok(new { data = vendors });
                }

                else if (type == "NonSO")
                {
                    // Buyers
                    var buyers = _swamiContext.MASTER_SalesBuyerTbl
                        .Where(x => vendorIds.Contains(x.Id))
                        .Select(x => new
                        {
                            VendorId = x.Id,
                            VendorName = x.Company_Name ?? ""
                        })
                        .ToList();

                    return Ok(new { data = buyers });
                }

                return BadRequest(new { success = false, message = "Invalid Type" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
        [HttpGet("GetGrnInvoiceDetails")]
        public IActionResult GetGrnInvoiceDetails(string checkval)
        {
            try
            {
                var grnDetails = (
                    from inv in _msmeContext.AccountNonGRNInvoice
                    join item in _msmeContext.AccountNonGRNInvoiceDetails
                        on inv.NonGrnInvoiceId equals item.NonGrnId
                    join led in _msmeContext.AccountLedger
                        on item.LedgerId equals led.AccountLedgerId into ledgerJoin
                    from led in ledgerJoin.DefaultIfEmpty()

                        // ✅ FILTER HERE
                    where inv.NonGrnInvoice == checkval
                          && (inv.ApproveNonGRNInvoice == null || inv.ApproveNonGRNInvoice == false)
                          && inv.IsActive == true

                    select new
                    {
                        invoiceNo = inv.InvoiceNo,
                        invoiceDate = inv.InvoiceDate,

                        description = item.Description,
                        qty = item.Qty,

                        basicAmount = item.BasicAmount,
                        totalValue = item.TotalValue,

                        ledgerName = led.AccountLedgerName,

                        totalTaxValue = item.TaxAmount,
                        netAmount = item.TotalValue,

                        cgst = item.CGST,
                        sgst = item.SGST,
                        igst = item.IGST,

                        nonGrnInvoiceId = inv.NonGrnInvoiceId,
                        approveNonGRNInvoice = inv.ApproveNonGRNInvoice
                    }
                ).ToList();

                if (!grnDetails.Any())
                {
                    return Ok(new
                    {
                        success = false,
                        message = "No Data Found"
                    });
                }

                return Ok(new
                {
                    success = true,
                    grnDetails
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
       
        [HttpPost("ApproveGrnInvoice")]
        public IActionResult ApproveGrnInvoice([FromBody] List<ApproveNonGrnVM> model)
        {
            try
            {
                foreach (var item in model)
                {
                    var invoice = _msmeContext.AccountNonGRNInvoice
                        .FirstOrDefault(x => x.NonGrnInvoiceId == item.NonGrnInvoiceId);

                    if (invoice != null)
                    {
                        invoice.ApproveNonGRNInvoice = item.ApproveNonGRNInvoice;
                        invoice.CheckNonGRNInvoice = "Approved";
                    }
                }

                _msmeContext.SaveChanges();

                return Ok(new
                {
                    success = true,
                    message = "GRN approved successfully"
                });
            }
            catch (Exception ex)
            {
                return Ok(new
                {
                    success = false,
                    message = "Error while updating GRN",
                    error = ex.Message
                });
            }
        }
        public class ApproveNonGrnVM
        {
            public int NonGrnInvoiceId { get; set; }
            public bool ApproveNonGRNInvoice { get; set; }
        }
        

        //   [HttpGet("GetPaymentAllocNonGrn")]
        //   public IActionResult GetPaymentAllocNonGrn()
        //   {
        //       try
        //       {
        //           var latestPayments = _msmeContext.AccountPaymentAllocation
        //               .GroupBy(x => x.GRNNo)
        //               .Select(g => g.OrderByDescending(x => x.PaymentAllocateId).FirstOrDefault())
        //               .ToList();

        //           var invoices = (from a in _msmeContext.AccountNonGRNInvoice
        //                           join d in _msmeContext.AccountNonGRNInvoiceDetails
        //                               on a.NonGrnInvoiceId equals d.NonGrnId
        //                           where a.ApproveNonGRNInvoice == true
        //                                 && (a.NonGrnInvoice.Contains("NonGRN") || a.NonGrnInvoice.Contains("NonSO"))
        //                           orderby a.NonGrnInvoiceId ascending

        //                           select new
        //                           {
        //                               a.NonGrnInvoiceId,
        //                               a.InvoiceNo,
        //                               a.InvoiceDate,
        //                               a.PayDueDate,
        //                               a.TotalAmount,
        //                               a.VendorCode
        //                           })
        //                           .Distinct()
        //                           .ToList();

        //           var potentialVendors = _swamiContext.Potential_Vendor
        //               .Select(x => new
        //               {
        //                   x.Vendor_Code,
        //                   x.Company_Name
        //               }).ToList();

        //           var accountVendors = _msmeContext.AccountVendor
        //               .Select(x => new
        //               {
        //                   x.VendorCode,
        //                   x.VendorName
        //               }).ToList();

        //           var result = invoices.Select(a =>
        //           {
        //               var payment = latestPayments.FirstOrDefault(p => p.GRNNo == a.InvoiceNo);

        //               var supplierName =
        //potentialVendors
        //    .Where(x => x.Vendor_Code == a.VendorCode.ToString())
        //    .Select(x => x.Company_Name ?? "")   // ✅ FIX
        //    .FirstOrDefault()
        //??
        //accountVendors
        //    .Where(x => x.VendorCode == a.VendorCode.ToString())
        //    .Select(x => x.VendorName ?? "")     // ✅ FIX
        //    .FirstOrDefault();

        //               return new PaymentAllocationVM   // ✅ SAME TYPE
        //               {
        //                   Supplier_Name = supplierName,
        //                   Due_Date = a.PayDueDate,
        //                   Invoice_NO = a.InvoiceNo,
        //                   Invoice_Date = a.InvoiceDate,
        //                   Total_Amount = a.TotalAmount,
        //                   VendorCode = a.VendorCode.ToString(),

        //                   BalanceAmount =
        //                       (payment != null && payment.BalanceAmount != null && payment.BalanceAmount > 0)
        //                       ? payment.BalanceAmount
        //                       : a.TotalAmount
        //               };

        //           }).Where(x => x.BalanceAmount != 0).ToList();
        //           var transportData = (from t in _msmeContext.AccountTransportationGRN
        //                                where t.ApproveTransportation == true
        //                                select new PaymentAllocationVM
        //                                {
        //                                    Supplier_Name =
        //                                        (from d in _msmeContext.AccountTransportationGRNDetails
        //                                         join m in _swamiContext.MMM_GRNTbl
        //                                         on d.GRNId equals m.Id
        //                                         where d.TransporterGRNId == t.TransporterGRNId
        //                                         select m.Transporter ?? ""   // ✅ FIX HERE
        //                                        ).FirstOrDefault(),

        //                                    Due_Date = t.Payment_Due_Date,

        //                                    Invoice_NO = t.InvoiceNo ?? "",

        //                                    Invoice_Date = t.InvoiceDate,

        //                                    Total_Amount = t.TotalAmount ?? 0,

        //                                    VendorCode = t.VendorId != null ? t.VendorId.ToString() : "",

        //                                    BalanceAmount = t.TotalAmount ?? 0
        //                                }).ToList();

        //           // ✅ MERGE BOTH
        //           var finalData = result.Concat(transportData).ToList();

        //           return Ok(new
        //           {
        //               success = true,
        //               data = finalData   // ✅ IMPORTANT
        //           });
        //       }
        //       catch (Exception ex)
        //       {
        //           return StatusCode(500, new
        //           {
        //               success = false,
        //               message = "Error loading payment allocation data",
        //               error = ex.Message
        //           });
        //       }
        //   }


        [HttpGet("GetTransporter")]
        public async Task<IActionResult> GetTransporter()
        {
            try
            {
                var transporters = await _swamiContext.MMM_GRNTbl
                    .Where(x => !string.IsNullOrEmpty(x.Transporter) && x.QC_Clearance_Date != null)
                    .Select(x => x.Transporter)
                    .Distinct()
                    .OrderBy(x => x)
                    .ToListAsync();

                // React expects the data inside an object { data: [...] } based on your frontend code
                return Ok(new { data = transporters });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }

        }
        [HttpGet("GetTransporterDetails")]
        public async Task<IActionResult> GetTransporterDetails()
        {
            try
            {
                // STEP 1: Get main + details (same context ✅)
                var baseData = await (
                    from t in _msmeContext.AccountTransportationGRN
                    join d in _msmeContext.AccountTransportationGRNDetails
                        on t.TransporterGRNId equals d.TransporterGRNId
                    where t.CheckTransportation == true
                    select new
                    {
                        t.TransporterGRNId,
                        t.InvoiceNo,
                        t.InvoiceDate,
                        t.Qty,
                        t.Price,
                        t.NetAmount,
                        t.TaxAmount,
                        t.TotalAmount,
                        t.ApproveTransportation,
                        d.GRNId
                    }
                ).ToListAsync();

                // STEP 2: Get GRN transporter data (other context ✅)
                var grnIds = baseData.Select(x => x.GRNId).Distinct().ToList();

                var grnData = await _swamiContext.MMM_GRNTbl
                    .Where(x => grnIds.Contains(x.Id))
                    .Select(x => new
                    {
                        x.Id,
                        x.Transporter
                    })
                    .ToListAsync();

                // STEP 3: Merge (JOIN IN MEMORY ✅)
                var result = baseData.Select(x => new
                {
                    transporterGRNId = x.TransporterGRNId,
                    invoiceNo = x.InvoiceNo,
                    invoiceDate = x.InvoiceDate,
                    qty = x.Qty,
                    price = x.Price,
                    netAmount = x.NetAmount,
                    taxAmount = x.TaxAmount,
                    totalAmount = x.TotalAmount,
                    approveTransportation = x.ApproveTransportation,

                    transporterName = grnData
                        .FirstOrDefault(g => g.Id == x.GRNId)?.Transporter
                })
                .Distinct()
                .ToList();

                return Ok(new { data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPost("SaveTransportrationGRN")]
        public IActionResult SaveTransporterGRN([FromBody] AccountTransporterGRNViewModel model)
        {
            try
            {
                int userId = 1; // 👉 Replace with your auth logic
                 DateTime now = DateTime.Now;

                if (model.Details == null || !model.Details.Any())
                {
                    return BadRequest("Please select at least one GRN!");
                }

                var firstGrnId = model.Details.First().GRNId;
                var vendorData = (from g in _swamiContext.MMM_GRNTbl
                                  join v in _swamiContext.Potential_Vendor
                                  on g.Supplier_Name equals v.Company_Name
                                  where g.Id == firstGrnId
                                  select new
                                  {
                                      VendorId = v.Id,
                                      VendorCode = v.Vendor_Code
                                  }).FirstOrDefault();

                if (vendorData == null || vendorData.VendorId == 0)
                {
                    return BadRequest ("Vendor not found for selected GRN!");
                
                }

                int vendorId = vendorData.VendorId;
                string vendorCode = vendorData.VendorCode;

                // ✅ Prepare header
                var header = new AccountTransportationGRN
                {
                    VendorId = vendorId,
                    VendorCode = vendorCode,

                    InvoiceNo = model.TransporterInvoiceNo,
                    InvoiceDate = model.InvoiceDate,
                    Date = model.Date,
                    Qty = model.Qty,
                    Price = model.Price,
                    NetAmount = model.NetAmount,
                    TaxTypeId = model.TaxTypeId,
                    TaxAmount = model.TaxAmount,
                    IGSTAmount = model.IGSTAmount,
                    SGSTAmount = model.SGSTAmount,
                    CGSTAmount = model.CGSTAmount,
                    TotalAmount = model.TotalAmount,
                    Payment_Due_Date = model.Payment_Due_Date,
                    LedgerId = model.LedgerIds != null ? string.Join(",", model.LedgerIds) : null,
                    CheckTransportation = model.CheckTransportation,
                    CreatedBy = userId,
                    CreatedDate = now
                };

                _msmeContext.AccountTransportationGRN.Add(header);
                _msmeContext.SaveChanges();

                long newHeaderId = header.TransporterGRNId;

                foreach (var item in model.Details)
                {
                    var detail = new AccountTransportationGRNDetails
                    {
                        TransporterGRNId = newHeaderId,
                        GRNId = item.GRNId,
                        IsLRPass = item.IsLRPass
                    };

                    _msmeContext.AccountTransportationGRNDetails.Add(detail);
                }

                _msmeContext.SaveChanges();

                return Ok(new
                {
                    success = true,   // ✅ ADD THIS
                    message = "Saved Successfully!",
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error: " + ex.Message);
            }
        }
        [HttpGet("GetApproveTransporter")]
        public IActionResult GetApproveTransporter()
        {
            try
            {
                var grnData = (from grn in _msmeContext.AccountTransportationGRN
                               join d in _msmeContext.AccountTransportationGRNDetails
                                   on grn.TransporterGRNId equals d.TransporterGRNId
                               where grn.CheckTransportation == true
                                     && !_msmeContext.AccountTransportationGRN
                                           .Any(x => x.TransporterGRNId == grn.TransporterGRNId
                                                  && x.ApproveTransportation == true)
                               select new
                               {
                                   grn.TransporterGRNId,
                                   d.GRNId,
                                   grn.ApproveTransportation
                               }).ToList();

                var grnIds = grnData.Select(x => x.GRNId).Distinct().ToList();

                var transporterData = _swamiContext.MMM_GRNTbl
                                        .Where(x => grnIds.Contains(x.Id))
                                        .Select(x => new
                                        {
                                            x.Id,
                                            x.Transporter
                                        })
                                        .ToList();

                var result = (from g in grnData
                              join m in transporterData
                                  on g.GRNId equals m.Id
                              select new
                              {
                                  g.TransporterGRNId,
                                  TransporterName = m.Transporter,
                                  g.ApproveTransportation
                              })
                              .GroupBy(x => x.TransporterGRNId)
                              .Select(g => g.FirstOrDefault())
                              .ToList();

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
        [HttpGet("GetApproveTransporterDetails")]
        public IActionResult GetApproveTransporterDetails(int id)
        {
            // Step 1: Get GRN + Details from MSME DB
            var grnData = (from grn in _msmeContext.AccountTransportationGRN
                           join d in _msmeContext.AccountTransportationGRNDetails
                               on grn.TransporterGRNId equals d.TransporterGRNId
                           where grn.CheckTransportation == true
                                 && grn.TransporterGRNId == id
                           select new
                           {
                               grn,
                               d
                           }).ToList();   // ✅ Execute first DB

            // Step 2: Get MMM_GRN from Swami DB
            var grnIds = grnData.Select(x => x.d.GRNId).Distinct().ToList();

            var mmmData = _swamiContext.MMM_GRNTbl
                            .Where(x => grnIds.Contains(x.Id))
                            .ToList();   // ✅ Execute second DB

            // Step 3: Join in memory
            var data = (from gd in grnData
                        join m in mmmData
                            on gd.d.GRNId equals m.Id
                        group new { gd.grn, gd.d, m } by new
                        {
                            gd.grn.TransporterGRNId,
                            gd.grn.VendorId,
                            gd.grn.InvoiceNo,
                            gd.grn.InvoiceDate,
                            gd.grn.Qty,
                            gd.grn.Price,
                            gd.grn.NetAmount,
                            gd.grn.TaxAmount,
                            gd.grn.TotalAmount,
                            m.Transporter
                        } into g
                        select new
                        {
                            TransporterGRNId = g.Key.TransporterGRNId,
                            TransporterName = g.Key.Transporter,
                            VendorId = g.Key.VendorId,
                            InvoiceNo = g.Key.InvoiceNo,
                            InvoiceDate = g.Key.InvoiceDate,
                            Qty = g.Key.Qty,
                            Price = g.Key.Price,
                            NetAmount = g.Key.NetAmount,
                            TaxAmount = g.Key.TaxAmount,
                            TotalAmount = g.Key.TotalAmount,
                            IGSTAmount = g.Sum(x => x.grn.IGSTAmount),
                            SGSTAmount = g.Sum(x => x.grn.SGSTAmount),
                            CGSTAmount = g.Sum(x => x.grn.CGSTAmount),
                            ApproveTransportation = g.Max(x => x.grn.ApproveTransportation)
                        }).ToList();

            return Ok(new { success = true, data = data });
        }

        [HttpPost("UpdateApproveStatusBulk")]
        public IActionResult UpdateApproveStatusBulk([FromBody] List<ApproveTransporterViewModel> updates)
        {
            try
            {
                if (updates == null || !updates.Any())
                    return BadRequest(new { success = false, message = "No records received." });

                int processedCount = 0;

                foreach (var item in updates)
                {
                    if (!item.approve)
                        continue;

                    // ================= GET MASTER =================
                    var grn = _msmeContext.AccountTransportationGRN
                        .FirstOrDefault(x => x.TransporterGRNId == item.transporterGRNId);

                    if (grn == null)
                        continue;

                    // ✅ Approve flag
                    grn.ApproveTransportation = true;

                    // ================= GET DETAILS =================
                    var details = _msmeContext.AccountTransportationGRNDetails
                        .Where(x => x.TransporterGRNId == grn.TransporterGRNId)
                        .ToList();

                    if (!details.Any())
                        continue;

                    // ================= GET LEDGER IDS =================
                    List<int> ledgerIds = new List<int>();

                    if (!string.IsNullOrWhiteSpace(grn.LedgerId))
                    {
                        ledgerIds = grn.LedgerId
                            .Split(new[] { '|', ',' }, StringSplitOptions.RemoveEmptyEntries)
                            .Select(x => int.Parse(x.Trim()))
                            .Distinct()
                            .ToList();
                    }

                    if (!ledgerIds.Any())
                        continue;

                    // ================= LEDGER MAPPING =================
                    var ledgerMappings = _msmeContext.AccountLedger
                        .Where(x => ledgerIds.Contains(x.AccountLedgerId))
                        .ToList();

                    // ================= GET GRN ID =================
                    var grnId = _msmeContext.AccountTransportationGRNDetails
                        .Where(x => x.TransporterGRNId == grn.TransporterGRNId)
                        .Select(i => i.GRNId)
                        .FirstOrDefault();

                    // ================= GET TRANSPORTER =================
                    var transporter = _swamiContext.MMM_GRNTbl
                        .Where(x => x.Id == grnId)
                        .Select(x => x.Transporter)
                        .FirstOrDefault();

                    // ================= GET VENDOR CODE =================
                    var vendorCode = _swamiContext.Potential_Vendor
                        .Where(i => i.Company_Name == transporter)
                        .Select(i => i.Vendor_Code)
                        .FirstOrDefault();

                    // ================= CREATE LEDGER ENTRIES =================
                    foreach (var map in ledgerMappings)
                    {
                        if (string.IsNullOrEmpty(map.TransportColumnName))
                            continue;

                        decimal amount = 0;

                        foreach (var detail in details)
                        {
                            var prop = detail.GetType().GetProperty(map.TransportColumnName);
                            if (prop == null) continue;

                            var value = prop.GetValue(detail);
                            if (value != null)
                                amount += Convert.ToDecimal(value);
                        }

                        if (amount <= 0)
                            continue;

                        decimal credit = map.CrDr == "Credit" ? amount : 0;
                        decimal debit = map.CrDr == "Debit" ? amount : 0;

                        AddLedgerEntryTransport(
                            map.AccountLedgerId,
                            grn.InvoiceNo,
                            credit,
                            debit,
                            vendorCode
                        );
                    }

                    processedCount++;
                }

                _msmeContext.SaveChanges();

                if (processedCount == 0)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "No GRNs were approved."
                    });
                }

                return Ok(new
                {
                    success = true,
                    message = $"{processedCount} GRN(s) Approved and Accounting Entry Created."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
        private void AddLedgerEntryTransport(
       int ledgerId,
       string invoiceNo,
       decimal credit,
       decimal debit,
       string vendorCode)
        {
            int subLedgerId = _msmeContext.AccountSubLedger
                .Where(i => i.AccountLedgerid == ledgerId && i.AssetsCode == vendorCode)
                .Select(i => i.AccountLedgerSubid)
                .FirstOrDefault();

            decimal openingBalance = GetLastClosingBalance(ledgerId);

            // ✅ Correct balance logic
            decimal closingBalance = openingBalance + credit - debit;

            decimal subOpeningBalance = 0;
            decimal subClosingBalance = 0;

            if (subLedgerId != 0)
            {
                subOpeningBalance = _msmeContext.AccountLedgerCrDR
                    .Where(x => x.LedegrId == ledgerId && x.SubLedgerId == subLedgerId)
                    .OrderByDescending(x => x.LedgerCrDrId)
                    .Select(x => x.SubClosingBal ?? 0)
                    .FirstOrDefault();

                subClosingBalance = subOpeningBalance + credit + debit;
            }

            var transaction = new AccountLedgerCrDR
            {
                LedegrId = ledgerId,
                InvoiceNO = invoiceNo,
                Date = DateTime.Now,
                OpeningBalance = openingBalance,
                Credit = credit,
                Debit = debit,
                ClosingBalance = closingBalance,
                SubLedgerId = subLedgerId,
                SubOpeningBal = subOpeningBalance,
                SubClosingBal = subClosingBalance,
                Type = "TRANSPORT"
            };

            _msmeContext.AccountLedgerCrDR.Add(transaction);

            // ✅ Update Ledger
            var ledger = _msmeContext.AccountLedger
                .FirstOrDefault(l => l.AccountLedgerId == ledgerId);

            if (ledger != null)
                ledger.ClosingBal = closingBalance;

            // ✅ Update SubLedger
            var subLedgerVendor = _msmeContext.AccountSubLedger
                .FirstOrDefault(i => i.AssetsCode == vendorCode && i.AccountLedgerid == ledgerId);

            if (subLedgerVendor != null)
                subLedgerVendor.ClosingBal += (credit - debit);
        }
    }
        
    }



