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

        //[HttpGet("GetPaymentAllocNonGrn")]
        //public IActionResult GetPaymentAllocNonGrn()
        //{
        //    try
        //    {
        //        var latestPayments = _msmeContext.AccountPaymentAllocation
        //            .GroupBy(x => x.InvoiceNo)
        //            .Select(g => g.OrderByDescending(x => x.PaymentAllocateId).FirstOrDefault())
        //            .ToList();

        //        var invoices = (from a in _msmeContext.AccountNonGRNInvoice
        //                        join d in _msmeContext.AccountNonGRNInvoiceDetails
        //                            on a.NonGrnInvoiceId equals d.NonGrnId
        //                        where a.ApproveNonGRNInvoice == true
        //                              && (a.NonGrnInvoice.Contains("NonGRN") || a.NonGrnInvoice.Contains("NonSO"))
        //                        orderby a.NonGrnInvoiceId ascending

        //                        select new
        //                        {
        //                            a.NonGrnInvoiceId,
        //                            a.InvoiceNo,
        //                            a.InvoiceDate,
        //                            a.PayDueDate,
        //                            a.TotalAmount,
        //                            a.VendorCode
        //                        })
        //                        .Distinct()
        //                        .ToList();

        //        var potentialVendors = _swamiContext.Potential_Vendor
        //            .Select(x => new
        //            {
        //                x.Vendor_Code,
        //                x.Company_Name
        //            }).ToList();

        //        var accountVendors = _msmeContext.AccountVendor
        //            .Select(x => new
        //            {
        //                x.VendorCode,
        //                x.VendorName
        //            }).ToList();

        //        var result = invoices.Select(a =>
        //        {
        //            var payment = latestPayments.FirstOrDefault(p => p.GRNNo == a.InvoiceNo);

        //            var supplierName =
        //                potentialVendors
        //                    .Where(x => x.Vendor_Code == a.VendorCode)
        //                    .Select(x => x.Company_Name)
        //                    .FirstOrDefault()
        //                ??
        //                accountVendors
        //                    .Where(x => x.VendorCode == a.VendorCode)
        //                    .Select(x => x.VendorName)
        //                    .FirstOrDefault();

        //            return new
        //            {
        //                Supplier_Name = supplierName,
        //                Due_Date = a.PayDueDate,
        //                Invoice_NO = a.InvoiceNo,
        //                Invoice_Date = a.InvoiceDate,
        //                Total_Amount = a.TotalAmount,
        //                VendorCode = a.VendorCode,

        //                BalanceAmount =
        //                    (payment != null && payment.BalanceAmount != null && payment.BalanceAmount > 0)
        //                    ? payment.BalanceAmount
        //                    : a.TotalAmount
        //            };

        //        }).Where(x => x.BalanceAmount != 0).ToList();

        //        return Ok(new
        //        {
        //            success = true,
        //            data = result
        //        });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new
        //        {
        //            success = false,
        //            message = "Error loading payment allocation data",
        //            error = ex.Message
        //        });
        //    }
        //}

        [HttpGet("GetPaymentAllocNonGrnTrans")]
        public IActionResult GetPaymentAllocNonGrns()
        {
            try
            {
                // STEP 1
                var latestPayments = _msmeContext.AccountPaymentAllocation
                    .GroupBy(x => x.InvoiceNo)
                    .Select(g => g.OrderByDescending(x => x.PaymentAllocateId).FirstOrDefault())
                    .ToList();

                // STEP 2 (LEFT JOIN + SAFE FILTER)
                var invoices = (
                    from a in _msmeContext.AccountNonGRNInvoice

                    join d in _msmeContext.AccountNonGRNInvoiceDetails
                        on a.NonGrnInvoiceId equals d.NonGrnId into details
                    from d in details.DefaultIfEmpty()

                    where (a.ApproveNonGRNInvoice ?? false) == true
                          && a.NonGrnInvoice != null
                          && a.NonGrnInvoice.ToLower().Contains("nongrn")

                    select a
                ).ToList();

                // STEP 3
                var potentialVendors = _swamiContext.Potential_Vendor.ToList();
                var accountVendors = _msmeContext.AccountVendor.ToList();

                // STEP 4
                var data = invoices.Select(a =>
                {
                    var payment = latestPayments
                        .FirstOrDefault(p => p.InvoiceNo != null && p.InvoiceNo == a.InvoiceNo);

                    var supplier =
                        potentialVendors
                            .Where(x => x.Vendor_Code == (a.VendorCode ?? "").ToString())
                            .Select(x => x.Company_Name)
                            .FirstOrDefault()
                        ??
                        accountVendors
                            .Where(x => x.VendorCode == (a.VendorCode ?? "").ToString())
                            .Select(x => x.VendorName)
                            .FirstOrDefault()
                        ?? "";

                    return new PaymentAllocationVM
                    {
                        Supplier_Name = supplier,
                        Due_Date = a.PayDueDate,
                        Invoice_NO = a.InvoiceNo,
                        Invoice_Date = a.InvoiceDate,
                        Total_Amount = a.TotalAmount,
                        VendorCode = a.VendorCode,

                        BalanceAmount =
                            (payment != null && payment.BalanceAmount > 0)
                            ? payment.BalanceAmount
                            : a.TotalAmount
                    };
                })
                .Where(x => x.BalanceAmount == null || x.BalanceAmount != 0)
                .ToList();

                return Ok(new
                {
                    success = true,
                    data = data
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
