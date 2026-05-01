using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models.Accounts;

namespace SwamiSamarthSyn8.Controllers.Accounts
{
    [Route("api/[controller]")]
    public class PaymentAllocationController : Controller
    {
        private readonly SwamiSamarthDbContext _swamiContext;   // 🔹 MMM DB
        private readonly MsmeERPDbContext _msmeContext;         // 🔹 Accounts DB
        private readonly ILogger<GRNController> _logger;

        public PaymentAllocationController(
            SwamiSamarthDbContext swamiContext,
            MsmeERPDbContext msmeContext,
            ILogger<GRNController> logger)
        {
            _swamiContext = swamiContext;
            _msmeContext = msmeContext;
            _logger = logger;
        }
        [HttpGet("GetNonGrnBank")]
        public IActionResult GetNonGrnBank([FromQuery] string supplier)
        {
            if (string.IsNullOrEmpty(supplier))
            {
                return BadRequest(new { message = "Supplier name is required" });
            }

            var bankList = new List<object>();

            // Check Potential Vendor
            var potentialVendor = _swamiContext.Potential_Vendor
                                  .FirstOrDefault(v => v.Company_Name == supplier);

            if (potentialVendor != null)
            {
                // Main bank
                if (!string.IsNullOrEmpty(potentialVendor.Bank_Name))
                {
                    bankList.Add(new
                    {
                        BankName = potentialVendor.Bank_Name,
                        Id = potentialVendor.Id
                    });
                }

                // Other banks
                var otherBanks = _msmeContext.AccountBankDetails
                                  .Where(b => b.VendorId == potentialVendor.Id)
                                  .Select(b => new
                                  {
                                      BankName = b.BankName,
                                      Id = b.AccountBankDetailId
                                  })
                                  .ToList();

                bankList.AddRange(otherBanks);
            }
            else
            {
                // Check Account Vendor
                var accountVendor = _msmeContext.AccountVendor
                                    .FirstOrDefault(v => v.VendorName == supplier);

                if (accountVendor != null)
                {
                    if (!string.IsNullOrEmpty(accountVendor.BanckName))
                    {
                        bankList.Add(new
                        {
                            BankName = accountVendor.BanckName,
                            Id = accountVendor.AccountVendorId
                        });
                    }

                    var otherBanks = _msmeContext.AccountBankDetails
                                      .Where(b => b.VendorId == accountVendor.AccountVendorId)
                                      .Select(b => new
                                      {
                                          BankName = b.BankName,
                                          Id = b.AccountBankDetailId
                                      })
                                      .ToList();

                    bankList.AddRange(otherBanks);
                }
            }

            return Ok(new { data = bankList });
        }
        [HttpGet("GetLedger")]
        public IActionResult GetLedger()
        {
            var ledger = _msmeContext.AccountLedger
                .Select(l => new
                {
                    l.AccountLedgerId,
                    l.AccountLedgerName
                })
                .ToList();

            return Ok(new { success = true, data = ledger });
        }
        [HttpGet("GetSubLedger")]
        public IActionResult GetSubLedger()
        {
            var ledger = _msmeContext.AccountSubLedger
                  .Where(x => x.IsActive && x.IsBank == true)  // ✅ FIX
                .Select(l => new
                {
                    l.AccountLedgerSubid,
                    l.AccountLedgerSubName
                })
                .ToList();

            return Ok(new { success = true, data = ledger });
        }
        [HttpGet("GetLedgerBalance")]
        public IActionResult GetLedgerBalance(int ledger)
        {
            var balance = _msmeContext.AccountSubLedger
                .Where(l => l.AccountLedgerSubid == ledger)
                .Select(l => l.ClosingBal)
                .FirstOrDefault();

            return Ok(new { success = true, balance = balance });
        }
        [HttpPost("SavePaymentAllocation")]
        public async Task<IActionResult> SavePaymentAllocation(
[FromBody] PaymentAllocationRequest request)
        {
            if (request?.Payments == null || !request.Payments.Any())
                return BadRequest("No payment data received");

            using var transaction = await _msmeContext.Database.BeginTransactionAsync();

            try
            {
                foreach (var payment in request.Payments)
                {
                    var grn = await _msmeContext.AccountGRN
                        .FirstOrDefaultAsync(x =>
                            x.AccountGRNId == payment.AccountGRNId &&
                            x.IsActive);

                    if (grn == null)
                        return BadRequest("GRN not found");

                    var allocation = new AccountPaymentAllocation
                    {
                        GRNNo = grn.GRNNumber,
                        GRNDate = grn.CreatedDate,
                        PurchaseNo = grn.InvoiceNumber,
                        PaymentDueDate = null,
                        VendorId = grn.VendorId,

                        CGST = payment.CGST,
                        SGST = payment.SGST,
                        IGST = payment.IGST,

                        TotalTaxAmount = payment.CGST + payment.SGST + payment.IGST,
                        TotalAmount = payment.TotalAmount,

                        PaidAmount = payment.PaidAmount,
                        BalanceAmount = payment.BalanceAmount,

                        RTGSNo = payment.RTGSNo ?? "",
                        RTGSAmount = payment.PaidAmount,
                        RTGSDate = payment.RTGSDate ?? request.Date,

                        Description = $"Payment against GRN {grn.GRNNumber}",
                        IsActive = true
                    };

                    _msmeContext.AccountPaymentAllocation.Add(allocation);

                    // Update GRN
                    grn.UpdatedDate = DateTime.Now;

                    if (payment.BalanceAmount == 0)
                        grn.CheckGRN = true;
                }

                await _msmeContext.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("GetApprovedGrnPaymentAllocation")]
        public async Task<IActionResult> GetApprovedGrn(int page = 1, int pageSize = 10)
        {
            try
            {
                // ✅ 1. Get GRNs from MSME DB
                var grns = await _msmeContext.AccountGRN
                    .Where(a => a.ApprovedGRN == true)
                    .OrderByDescending(a => a.AccountGRNId)
                    .ToListAsync();

                var grnNumbers = grns.Select(x => x.GRNNumber).ToList();

                // ✅ 2. Get GRN Master from SWAMI DB
                var masters = await _swamiContext.MMM_GRNTbl
                    .Where(g => grnNumbers.Contains(g.GRN_NO))
                    .ToListAsync();

                // ✅ 3. Get Latest Payment per GRN
                var latestPayments = await _msmeContext.AccountPaymentAllocation
                    .GroupBy(x => x.GRNNo)
                    .Select(g => g
                        .OrderByDescending(x => x.PaymentAllocateId)
                        .FirstOrDefault())
                    .ToListAsync();

                // ✅ 4. Join in memory
                var result = (from a in grns
                              join g in masters
                                  on a.GRNNumber equals g.GRN_NO

                              join p in latestPayments
                                  on a.GRNNumber equals p?.GRNNo into pay

                              from p in pay.DefaultIfEmpty()

                                  // ❌ Hide fully paid
                              where (p == null || p.BalanceAmount != 0)

                              select new
                              {
                                  a.AccountGRNId,
                                  a.GRNNumber,
                                  GRNDate = g.GRN_Date,
                                  VendorName = g.Supplier_Name,
                                  PONumber = g.PO_No,
                                  InvoiceNumber = g.Invoice_NO,
                                  InvoiceDate = g.Invoice_Date,
                                  TotalAmount = a.Total_Amount,

                                  PaidAmount = p?.PaidAmount ?? 0,

                                  BalanceAmount = (p != null && p.BalanceAmount > 0)
                                      ? p.BalanceAmount
                                      : a.Total_Amount
                              })
                              .OrderByDescending(x => x.AccountGRNId)
                              .ToList();

                // ✅ 5. Pagination
                var totalCount = result.Count;

                var data = result
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                // ✅ 6. Return response
                return Ok(new
                {
                    success = true,
                    data,
                    totalCount,
                    currentPage = page,
                    pageSize
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

       [HttpGet("GetPaymentAllocNonGrnTrans")]
        public IActionResult GetPaymentAllocNonGrnTrans()
        {
            try
            {
                // ✅ STEP 1: Latest Payments
                var latestPayments = _msmeContext.AccountPaymentAllocation
                    .GroupBy(x => x.InvoiceNo)
                    .Select(g => g.OrderByDescending(x => x.PaymentAllocateId).FirstOrDefault())
                    .ToList();

                // ✅ STEP 2: Non-GRN Invoices
                var invoices = _msmeContext.AccountNonGRNInvoice
                    .Where(a =>
                        (a.ApproveNonGRNInvoice ?? false) == true &&
                        a.NonGrnInvoice != null &&
                        a.NonGrnInvoice.ToLower().Contains("nongrn"))
                    .ToList();

                // ✅ STEP 3: Vendors
                var potentialVendors = _swamiContext.Potential_Vendor.ToList();
                var accountVendors = _msmeContext.AccountVendor.ToList();

                // ✅ STEP 4: Non-GRN Data
                var nonGrnData = invoices.Select(a =>
                {
                    var payment = latestPayments
                        .FirstOrDefault(p => p.InvoiceNo == a.InvoiceNo);

                    // 🔥 FIX: Convert to string properly
                    string vendorCode = a.VendorCode?.ToString() ?? "";

                    var supplier =
                        potentialVendors
                            .Where(x => (x.Vendor_Code ?? "") == vendorCode)
                            .Select(x => x.Company_Name)
                            .FirstOrDefault()
                        ??
                        accountVendors
                            .Where(x => (x.VendorCode ?? "") == vendorCode)
                            .Select(x => x.VendorName)
                            .FirstOrDefault()
                        ?? "";

                    decimal? balance =
                        (payment != null && payment.BalanceAmount > 0)
                            ? payment.BalanceAmount
                            : a.TotalAmount;

                    return new PaymentAllocationVM
                    {
                        Supplier_Name = supplier,
                        Due_Date = a.PayDueDate,
                        Invoice_NO = a.InvoiceNo,
                        Invoice_Date = a.InvoiceDate,
                        Total_Amount = a.TotalAmount,
                        VendorCode = vendorCode,
                        BalanceAmount = balance
                    };
                })
                .Where(x => x.BalanceAmount != 0)
                .ToList();

                // =========================================================
                // ✅ STEP 5: TRANSPORT DATA
                // =========================================================

                var transportGrns = _msmeContext.AccountTransportationGRN
                    .Where(t => t.ApproveTransportation == true)
                    .ToList();

                var transportDetails = _msmeContext.AccountTransportationGRNDetails.ToList();
                var grnMasters = _swamiContext.MMM_GRNTbl.ToList();

                var transportData = transportGrns.Select(t =>
                {
                    var supplier = (from d in transportDetails
                                    join m in grnMasters
                                        on d.GRNId equals m.Id
                                    where d.TransporterGRNId == t.TransporterGRNId
                                    select m.Transporter)
                                    .FirstOrDefault();

                    return new PaymentAllocationVM
                    {
                        Supplier_Name = supplier ?? "",
                        Due_Date = t.Payment_Due_Date,
                        Invoice_NO = t.InvoiceNo,
                        Invoice_Date = t.InvoiceDate,
                        Total_Amount = t.TotalAmount,
                        VendorCode = t.VendorCode?.ToString(),

                        BalanceAmount = t.TotalAmount
                    };
                }).ToList();

                // =========================================================
                // ✅ STEP 6: MERGE
                // =========================================================

                var finalData = nonGrnData.Concat(transportData).ToList();

                return Ok(new
                {
                    success = true,
                    data = finalData,
                    totalCount = finalData.Count
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
    }
}
