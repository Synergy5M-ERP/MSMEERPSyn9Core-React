using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models;
using SwamiSamarthSyn8.Models.Accounts;

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
            if (string.IsNullOrEmpty(sellerName))
                return BadRequest(new { success = false, message = "Seller name is required" });

            var invoices = await _swamiContext.MMM_GRNTbl
                .Where(g => g.Supplier_Name == sellerName
                            && g.QC_Clearance_Date != null
                            && g.Invoice_Date != null
                            && g.QC_Clearance_Date >= g.Invoice_Date) // 🔥 CONDITION
                .OrderBy(g => g.Invoice_Date)   // better sorting
                .Select(g => new
                {
                    g.Id,
                    invoiceNumber = g.Invoice_NO,
                    invoiceDate = g.Invoice_Date,
                    qcDate = g.QC_Clearance_Date
                })
                .ToListAsync();

            return Ok(new
            {
                success = true,
                data = invoices
            });
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


        // ✔ GET FULL GRN DETAILS (Including PO No & PO Date)
        [HttpGet("GetGRNDetails")]
        public async Task<IActionResult> GetGRNDetails([FromQuery] string invoice)
        {
            if (string.IsNullOrEmpty(invoice))
                return BadRequest(new { success = false, message = "Invoice number is required" });

            // ================= HEADER =================
            var header = await _swamiContext.MMM_GRNTbl
                .Where(g => g.Invoice_NO == invoice)
                .Select(g => new
                {
                    grnId = g.Id,
                    grnNumber = g.GRN_NO,
                    poNumber = g.PO_No,
                    supplierName = g.Supplier_Name,
                    supplierAddress = g.Supplier_Address,
                    grnDate = g.GRN_Date,
                    invoiceNumber = g.Invoice_NO,
                    invoiceDate = g.Invoice_Date,
                    vehicleNo = g.Vehicle_No,
                    transporterName = g.Transporter,
                    paymentDue = g.Payment_Due_On
                })
                .FirstOrDefaultAsync();

            if (header == null)
                return NotFound(new { success = false, message = "Invoice not found" });

            // ================= PO DETAILS =================
            var poDetails = await _swamiContext.MMM_GRNProductTbl
                .Where(p => p.PO_No == header.poNumber)
                .Select(p => new
                {
                    p.PO_No,
                    purchaseDate = p.Purchase_Date
                })
                .FirstOrDefaultAsync();

            // ================= ITEMS =================
            var items = await _swamiContext.MMM_GRNProductTbl
                .Where(i => i.G_Id == header.grnId)
                .Select(i => new
                {
                    i.G_Id,
                    itemName = i.Item_Name,
                    grade = i.Item_Descrpition,
                    itemCode = i.Item_Code,
                    receivedQty = i.Received_Qty,
                    acceptedQty = i.Accepted_Qty,
                    rejectedQty = i.Rejected_Qty,
                    rate = i.RatePerUnit,
                    taxType = i.TaxType,
                    taxRate = i.TaxRate,
                    taxAmount = i.TaxAmount,
                    netAmount = i.NetAmount,
                    totalTaxValue = i.Total_Value,
                    cgst = i.CGSTtaxrate,
                    sgst = i.SGSTtaxrate,
                    igst = i.IGSTtaxrate
                })
                .ToListAsync();

            // ================= RESPONSE =================
            return Ok(new
            {
                success = true,
                data = new
                {
                    header,
                    items,
                    poDetails
                }
            });
        }

        [HttpPost("SaveGRN")]
        public async Task<IActionResult> SaveGRN([FromBody] GRNSaveRequest request)
        {
            if (request == null || request.VendorId <= 0)
                return BadRequest(new { success = false, message = "Invalid vendor" });

            using var transaction = await _msmeContext.Database.BeginTransactionAsync();

            try
            {
                var grn = new AccountGRN
                {
                    VendorId = request.VendorId,
                    GRNNumber = request.GrnNumber,
                    InvoiceNumber = request.InvoiceNumber,
                    Description = request.Description,

                    Total_Amount = request.TotalAmount,
                    SGSTAmount = request.SGSTAmount,
                    CGSTAmount = request.CGSTAmount,
                    IGSTAmount = request.IGSTAmount,

                    CheckGRN = true,
                    ApprovedGRN = false,

                    CreatedBy = 1,
                    CreatedDate = DateTime.Now,
                    UpdatedBy = 1,
                    UpdatedDate = DateTime.Now,

                    IsActive = true
                };

                _msmeContext.AccountGRN.Add(grn);
                await _msmeContext.SaveChangesAsync();

                await transaction.CommitAsync();

                return Ok(new
                {
                    success = true,
                    message = "GRN saved successfully",
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
        //[HttpGet("GetGRNsBySeller")]
        //public async Task<IActionResult> GetGRNsBySeller(int sellerId)
        //{
        //    if (sellerId <= 0)
        //        return BadRequest(new { success = false, message = "Invalid sellerId" });

        //    var sellerGrns = await _msmeContext.AccountGRN
        //        .Where(x => x.VendorId == sellerId && x.IsActive == true)
        //        .ToListAsync();

        //    if (!sellerGrns.Any())
        //        return Ok(new { success = true, data = new List<object>() });

        //    var grnNos = sellerGrns.Select(s => s.GRNNumber).ToList();

        //    var rawData = await (
        //        from g in _swamiContext.MMM_GRNTbl
        //        join i in _swamiContext.MMM_GRNProductTbl
        //            on g.Id equals i.G_Id
        //        where grnNos.Contains(g.GRN_NO)
        //        select new
        //        {
        //            g.Id,
        //            g.GRN_NO,
        //            g.GRN_Date,
        //            g.Invoice_NO,
        //            g.Invoice_Date,
        //            g.PO_No,
        //            i.Purchase_Date,
        //            g.Supplier_Name,
        //            i.Item_Name,
        //            i.Item_Code,
        //            i.TaxAmount,
        //            i.Total_Value,
        //            i.CGSTtaxrate,
        //            i.SGSTtaxrate,
        //            i.IGSTtaxrate,
        //            i.Item_Descrpition,
        //            i.Received_Qty,
        //            i.Accepted_Qty,
        //            i.Rejected_Qty,
        //            i.NetAmount
        //        }).ToListAsync();

        //    var groupedData = rawData
        //        .GroupBy(x => x.GRN_NO)
        //        .Select(grp =>
        //        {
        //            var first = grp.First();

        //            return new
        //            {
        //                header = new
        //                {
        //                    grnNumber = first.GRN_NO,

        //                    // ✅ Format GRN Date
        //                    grnDate = first.GRN_Date.HasValue
        //                        ? first.GRN_Date.Value.ToString("dd-MM-yyyy")
        //                        : "",

        //                    invoiceNumber = first.Invoice_NO,

        //                    // ✅ Format Invoice Date
        //                    invoiceDate = first.Invoice_Date.HasValue
        //                        ? first.Invoice_Date.Value.ToString("dd-MM-yyyy")
        //                        : "",

        //                    poNumber = first.PO_No,

        //                    // ✅ Format Purchase Date (string parse)
        //                    poDate = DateTime.TryParse(first.Purchase_Date, out DateTime pDate)
        //                        ? pDate.ToString("dd-MM-yyyy")
        //                        : "",

        //                    transporterName = first.Supplier_Name
        //                },

        //                items = grp.Select(item => new
        //                {
        //                    itemName = item.Item_Name,
        //                    grade = item.Item_Descrpition,   // ✅ ADD THIS
        //                    item_Code = item.Item_Code,
        //                    receivedQty = item.Received_Qty,
        //                    approvedQty = item.Accepted_Qty,
        //                    damagedQty = item.Rejected_Qty,
        //                    totalTaxValue = item.TaxAmount,
        //                    totalItemValue = item.Total_Value,
        //                    netamount = item.NetAmount,
        //                    cgst = item.CGSTtaxrate,
        //                    sgst = item.SGSTtaxrate,
        //                    igst = item.IGSTtaxrate
        //                }).ToList()
        //            };
        //        })
        //        .ToList();

        //    return Ok(new { success = true, data = groupedData });
        //}
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
                        x.Total_Amount,
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
        [HttpPost("SaveMultipleGRN")]
        public IActionResult SaveMultipleGRN([FromBody] List<ApproveGRNDto> approvals)
        {
            try
            {
                if (approvals == null || !approvals.Any())
                    return BadRequest(new { success = false, message = "No GRNs received" });

                foreach (var grnDto in approvals)
                {
                    var dbGRN = _msmeContext.AccountGRN
                        .FirstOrDefault(x => x.GRNNumber == grnDto.GRNNumber);

                    if (dbGRN != null)
                    {
                        dbGRN.ApprovedGRN = true;
                        dbGRN.Total_Amount = grnDto.TotalAmount;
                        dbGRN.IsActive = true;
                        dbGRN.UpdatedDate = DateTime.Now;
                    }
                }

                _msmeContext.SaveChanges();

                return Ok(new
                {
                    success = true,
                    message = "Multiple GRNs approved successfully"
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

        ////[HttpGet("GRNApprovedDetails")]
        ////public async Task<IActionResult> GRNApprovedDetails(int page = 1, int pageSize = 10)
        ////{
        ////    try
        ////    {
        ////        var query = _msmeContext.AccountGRN
        ////            .Where(a => a.IsActive == true && a.ApprovedGRN == true)
        ////            .OrderByDescending(a => a.AccountGRNId);

        ////        var totalCount = await query.CountAsync();

        ////        var data = await query
        ////            .Skip((page - 1) * pageSize)
        ////            .Take(pageSize)
        ////            .Select(a => new
        ////            {
        ////                a.AccountGRNId,
        ////                a.GRNNumber,
        ////                a.InvoiceNumber,
        ////                a.Total_Amount,
        ////                a.SGSTAmount,
        ////                a.CGSTAmount,
        ////                a.IGSTAmount,
        ////                GRNDate = a.CreatedDate
        ////            })
        ////            .ToListAsync();

        ////        return Ok(new
        ////        {
        ////            success = true,
        ////            data,
        ////            totalCount,
        ////            currentPage = page,
        ////            pageSize
        ////        });
        ////    }
        ////    catch (Exception ex)
        ////    {
        ////        return StatusCode(500, new
        ////        {
        ////            success = false,
        ////            message = ex.Message
        ////        });
        ////    }
        ////}
            ////// ================= APPROVE GRN API =================
            //      [HttpGet("GRNApprovedDetails")]
            //      public async Task<IActionResult> GRNApprovedDetails(int page = 1, int pageSize = 10)
            //      {
            //          try
            //          {
            //              // ✅ STEP 1: Get latest payment (MSME CONTEXT)
            //              var latestPayments = await _msmeContext.AccountPaymentAllocation
            //                  .GroupBy(x => x.GRNNo)
            //                  .Select(g => g
            //                      .OrderByDescending(x => x.PaymentAllocateId)
            //                      .FirstOrDefault())
            //                  .ToListAsync();

            //              // ✅ STEP 2: Get GRNs (MSME CONTEXT)
            //              var grns = await _msmeContext.AccountGRN
            //                  .Where(a => a.IsActive == true && a.ApprovedGRN == true)
            //                  .OrderByDescending(a => a.AccountGRNId)
            //                  .ToListAsync();

            //              var grnNumbers = grns.Select(x => x.GRNNumber).ToList();

            //              // ✅ STEP 3: Get SWAMI DATA
            //              var swamiGrns = await _swamiContext.MMM_GRNTbl
            //                  .Where(x => grnNumbers.Contains(x.GRN_NO))
            //                  .ToListAsync();

            //              var grnIds = swamiGrns.Select(x => x.Id).ToList();

            //              var grnProducts = await _swamiContext.MMM_GRNProductTbl
            //                  .Where(x => grnIds.Contains(x.G_Id))
            //                  .ToListAsync();

            //              // ✅ STEP 4: Vendor Codes
            //              var vendorCodes = await _swamiContext.Potential_Vendor
            //                  .ToListAsync();

            //              var result = (
            //    from a in grns

            //    join g in swamiGrns
            //        on a.GRNNumber equals g.GRN_NO into gj
            //    from g in gj.DefaultIfEmpty()

            //    join i in grnProducts
            //        on (g != null ? g.Id : 0) equals i.G_Id into ij
            //    from i in ij.DefaultIfEmpty()

            //    join p in latestPayments
            //        on a.GRNNumber equals p.GRNNo.ToString() into pj   // ✅ FIXED
            //    from p in pj.DefaultIfEmpty()

            //    where p == null || p.BalanceAmount != 0

            //    orderby a.AccountGRNId descending

            //    select new
            //    {
            //        a.AccountGRNId,
            //        a.GRNNumber,

            //        GRNDate = g?.GRN_Date,
            //        Supplier_Name = g?.Supplier_Name,
            //        Due_Date = g?.Payment_Due_On,

            //        PONumber = g?.PO_No,
            //        InvoiceNumber = g?.Invoice_NO,
            //        InvoiceDate = g?.Invoice_Date,

            //        PurchaseDate = i?.Purchase_Date,

            //        Total_Amount = a.Total_Amount,

            //        VendorCode = vendorCodes
            //            .Where(x => x.Company_Name == g?.Supplier_Name)
            //            .Select(x => x.Vendor_Code.ToString())   // ✅ FIXED
            //            .FirstOrDefault(),

            //        BalanceAmount = (p != null && p.BalanceAmount > 0)
            //            ? (decimal?)p.BalanceAmount
            //            : null
            //    }
            //).ToList();

            //              // ✅ PAGINATION AFTER FILTER
            //              var totalCount = result.Count;

            //              var pagedData = result
            //                  .Skip((page - 1) * pageSize)
            //                  .Take(pageSize)
            //                  .ToList();

            //              return Ok(new
            //              {
            //                  success = true,
            //                  data = pagedData,
            //                  totalCount,
            //                  currentPage = page,
            //                  pageSize
            //              });
            //          }
            //          catch (Exception ex)
            //          {
            //              return StatusCode(500, new
            //              {
            //                  success = false,
            //                  message = ex.Message
            //              });
            //          }
            //      }
            [HttpPost("ApproveGrns")]
        public async Task<IActionResult> ApproveGrns(string grnNumber, decimal? totalAmount)
        {
            try
            {
                if (string.IsNullOrEmpty(grnNumber))
                    return BadRequest(new { success = false, message = "Invalid GRN number" });

                // ---------------- UPDATE GRN ----------------
                var record = await _msmeContext.AccountGRN
                    .FirstOrDefaultAsync(x => x.GRNNumber == grnNumber);

                if (record == null)
                    return NotFound(new { success = false, message = "GRN not found" });

                record.ApprovedGRN = true;
                record.Total_Amount = totalAmount;
                record.ApprovedDate = DateOnly.FromDateTime(DateTime.Now);

                await _msmeContext.SaveChangesAsync();

                // ---------------- GET GRN MASTER ----------------
                string grnNo = grnNumber;

                // ================= GET MASTER =================
                var getGrn = _swamiContext.MMM_GRNTbl
                    .FirstOrDefault(x => x.GRN_NO == grnNo);

                if (getGrn == null)
                    return NotFound(new { success = false, message = "GRN not found" });


                var getItems = _swamiContext.MMM_GRNProductTbl
                   .Where(x => x.G_Id == getGrn.Id)
                   .ToList();

                var getVendorName = getGrn.Supplier_Name;

                var getvendorcode = _swamiContext.Potential_Vendor
                    .Where(x => x.Company_Name == getVendorName)
                    .Select(x => new
                    {
                        x.Vendor_Code
                    })
                    .FirstOrDefault();
                string vendorCode = getvendorcode?.Vendor_Code;

                if (string.IsNullOrEmpty(vendorCode))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Vendor code not found"
                    });
                }
                if (!getItems.Any())
                    return NotFound(new { success = false, message = "GRN items not found" });

                // ================= GET ITEM NAMES =================
                var itemNames = getItems
                    .Select(x => x.Item_Name)
                    .Distinct()
                    .ToList();

                // ---------------- GET LEDGER IDS ----------------
                var masterLedgers = await _swamiContext.MASTER_ItemTbl
                    .Where(x => itemNames.Contains(x.Item_Name))
                    .Select(x => x.LedgerName ?? "")
                    .ToListAsync();

                List<int> ledgerIds = new List<int>();

                foreach (var ledgerString in masterLedgers)
                {
                    if (string.IsNullOrWhiteSpace(ledgerString)) continue;

                    var ids = ledgerString
                        .Split('|')
                        .Select(x => x.Trim())
                        .Where(x => !string.IsNullOrEmpty(x))
    .Select(x =>
    {
        if (int.TryParse(x, out int id))
            return id;
        return 0;
    })
    .Where(x => x != 0);
                    ledgerIds.AddRange(ids);
                }

                ledgerIds = ledgerIds.Distinct().ToList();

                // ---------------- GET LEDGER MAPPING ----------------
                var ledgerMappings = await _msmeContext.AccountLedger
                    .Where(x => ledgerIds.Contains(x.AccountLedgerId))
                    .ToListAsync();

                // ---------------- CREATE LEDGER ENTRIES ----------------
                foreach (var map in ledgerMappings)
                {
                    if (string.IsNullOrEmpty(map.GRNInvColumnName))
                        continue;

                    decimal amount = 0;

                    foreach (var item in getItems)
                    {
                        var property = item.GetType().GetProperty(map.GRNInvColumnName);
                        if (property == null) continue;

                        var value = property.GetValue(item);

                        if (value != null && decimal.TryParse(value.ToString(), out decimal val))
                            amount += val;
                    }

                    if (amount <= 0) continue;

                    decimal credit = 0;
                    decimal debit = 0;

                    if (map.CrDr == "Credit")
                        credit = amount;
                    else if (map.CrDr == "Debit")

                        debit = amount;
                    // ✅ FIX DATE CONVERSION
                    DateTime? invoiceDate = getGrn.Invoice_Date.HasValue
                        ? getGrn.Invoice_Date.Value.ToDateTime(TimeOnly.MinValue)
                        : null;

                    DateTime? qcDate = getGrn.QC_Clearance_Date.HasValue
                        ? getGrn.QC_Clearance_Date.Value.ToDateTime(TimeOnly.MinValue)
                        : null;
                    AddLedgerEntry(map.AccountLedgerId, getGrn.Invoice_NO, invoiceDate, credit, debit, getvendorcode.Vendor_Code, qcDate);

                }

                await _msmeContext.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message
                });
            }

            return Ok(new
            {
                success = true,
                message = "GRN Approved and Accounting Entry Created"
            });
        }
        private decimal GetLastClosingBalance(int ledgerId)
        {
            var lastRecord = _msmeContext.AccountLedgerCrDR
                .Where(x => x.LedegrId == ledgerId)
                .OrderByDescending(x => x.LedgerCrDrId)
                .FirstOrDefault();

            return lastRecord != null ? (lastRecord.ClosingBalance ?? 0) : 0;
        }


        private void AddLedgerEntry(
            int ledgerId,
            string Invoice_NO,
            DateTime? InvoiceDate,
            decimal credit,
            decimal debit,
            string Vendorcode,
            DateTime? qcDate)
        {
            var subledgerid = _msmeContext.AccountSubLedger
                .Where(i => i.AccountLedgerid == ledgerId && i.AssetsCode == Vendorcode)
                .Select(i => i.AccountLedgerSubid)
                .FirstOrDefault();

            decimal openingBalance = GetLastClosingBalance(ledgerId);

            decimal closingBalance = openingBalance;

            if (credit > 0)
                closingBalance += credit;

            if (debit > 0)
                closingBalance += debit;

            decimal subOpeningBalance = 0;
            decimal subClosingBalance = 0;

            if (subledgerid != 0)
            {
                subOpeningBalance = _msmeContext.AccountLedgerCrDR
                    .Where(x => x.LedegrId == ledgerId && x.SubLedgerId == subledgerid)
                    .OrderByDescending(x => x.LedgerCrDrId)
                    .Select(x => x.SubClosingBal ?? 0)
                    .FirstOrDefault();

                subClosingBalance = subOpeningBalance + credit + debit;
            }

            var transaction = new AccountLedgerCrDR
            {
                LedegrId = ledgerId,
                InvoiceNO = Invoice_NO,
                Date = qcDate,
                OpeningBalance = openingBalance,
                Credit = credit,
                Debit = debit,
                ClosingBalance = closingBalance,
                SubLedgerId = subledgerid,
                SubOpeningBal = subOpeningBalance,
                SubClosingBal = subClosingBalance,
                InvoiceDate = InvoiceDate
            };

            _msmeContext.AccountLedgerCrDR.Add(transaction);

            var ledger = _msmeContext.AccountLedger
                .FirstOrDefault(l => l.AccountLedgerId == ledgerId);

            if (ledger != null)
                ledger.ClosingBal = closingBalance;

            var subledgervendor = _msmeContext.AccountSubLedger
                .FirstOrDefault(i => i.AssetsCode == Vendorcode && i.AccountLedgerid == ledgerId);

            if (subledgervendor != null)
            {
                subledgervendor.ClosingBal += credit;
            }
        }

        [HttpGet("Vendorcategories")]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var categories = await _swamiContext.Master_VendorCategory
                    .Where(x => x.IsActive == true)
                    .Select(x => new
                    {
                        id = x.VendorCategoryId,
                        name = x.VendorCategory
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = categories
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching vendor categories");

                return StatusCode(500, new
                {
                    success = false,
                    message = "Error fetching categories"
                });
            }
        }
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

                    var grn = _msmeContext.AccountTransportationGRN
                                      .FirstOrDefault(x => x.TransporterGRNId == item.transporterGRNId);

                    if (grn == null)
                        continue;

                    // ✅ Approve
                    grn.ApproveTransportation = true;

                    var details = _msmeContext.AccountTransportationGRN
                                          .Where(x => x.TransporterGRNId == grn.TransporterGRNId)
                                          .ToList();

                    if (!details.Any())
                        continue;

                    // ================= Ledger IDs =================
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

                    var ledgerMappings = _msmeContext.AccountLedger
                                                .Where(x => ledgerIds.Contains(x.AccountLedgerId))
                                                .ToList();

                    var grnId = _msmeContext.AccountTransportationGRNDetails
                        .Where(x => x.TransporterGRNId == grn.TransporterGRNId)
                        .Select(i => i.GRNId)
                        .FirstOrDefault();

                    var transporter = (from grn1 in _swamiContext.MMM_GRNTbl
                                       where grn1.Id == grnId
                                       select grn1.Transporter).FirstOrDefault();

                    var vendorCode = _swamiContext.Potential_Vendor
                        .Where(i => i.Company_Name == transporter)
                        .Select(i => i.Vendor_Code)
                        .FirstOrDefault();

                    // ================= Ledger Entry =================
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
                            (int)grn.TransporterGRNId,
                            credit,
                            debit,
                            vendorCode
                        );
                    }

                    processedCount++;
                }

                _msmeContext.SaveChanges();

                return Ok(new
                {
                    success = true,
                    message = $"{processedCount} GRN(s) Approved and Accounting Entry Created."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
        private void AddLedgerEntryTransport(int ledgerId, int invoiceId, decimal credit, decimal debit, string vendorCode)
        {
            int subLedgerId = _msmeContext.AccountSubLedger
                .Where(i => i.AccountLedgerid == ledgerId && i.AssetsCode == vendorCode)
                .Select(i => i.AccountLedgerSubid)
                .FirstOrDefault();

            decimal openingBalance = GetLastClosingBalance(ledgerId);
            decimal closingBalance = openingBalance + credit - debit;

            var transaction = new AccountLedgerCrDR
            {
                LedegrId = ledgerId,
                InvoiceId = invoiceId,
                Date = DateTime.Now,
                OpeningBalance = openingBalance,
                Credit = credit,
                Debit = debit,
                ClosingBalance = closingBalance,
                SubLedgerId = subLedgerId,
            };

            _msmeContext.AccountLedgerCrDR.Add(transaction);

            var ledger = _msmeContext.AccountLedger.FirstOrDefault(l => l.AccountLedgerId == ledgerId);
            if (ledger != null)
                ledger.ClosingBal = closingBalance;

            var subLedgerVendor = _msmeContext.AccountSubLedger
                .FirstOrDefault(i => i.AssetsCode == vendorCode && i.AccountLedgerid == ledgerId);

            if (subLedgerVendor != null)
                subLedgerVendor.ClosingBal += (credit - debit);
        }
    }
        
    }



