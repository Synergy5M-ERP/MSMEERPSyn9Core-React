using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models.Accounts;

namespace SwamiSamarthSyn8.Controllers.Accounts
{
    [Route("api/")]
    [ApiController]
    public class AccountVoucherController : ControllerBase
    {
        private readonly SwamiSamarthDbContext _context;
        public AccountVoucherController(SwamiSamarthDbContext context)
        {
            _context = context;
        }

        [HttpGet("GetVoucherDetails")]
        public async Task<IActionResult> GetVoucherDetails([FromQuery] int vendorId,[FromQuery] int voucherTypeId,[FromQuery] int referenceId,[FromQuery] bool? isActive)
        {
            try
            {
                string? referenceNo = null;

                // 🔹 Resolve Reference Number based on Voucher Type
                if (voucherTypeId == 1) // Payment → GRN
                {
                    referenceNo = await _context.MMM_GRNTbl
                        .Where(x => x.Id == referenceId)
                        .Select(x => x.GRN_NO)
                        .FirstOrDefaultAsync();
                }
                else if (voucherTypeId == 2) // Receipt → Invoice
                {
                    referenceNo = await _context.SDM_Inv_VendTbls
                        .Where(x => x.supplied_id == referenceId)
                        .Select(x => x.invoice_number)
                        .FirstOrDefaultAsync();
                }

                if (string.IsNullOrEmpty(referenceNo))
                {
                    return Ok(new
                    {
                        success = false,
                        message = "Invalid reference number"
                    });
                }

                // Base query
                var query = _context.AccountVoucher
                    .Where(v =>
                        v.VendorId == vendorId &&
                        v.AccountVoucherTypeId == voucherTypeId &&
                        v.ReferenceNo == referenceId
                    );

                if (isActive.HasValue)
                {
                    query = query.Where(v => v.IsActive == isActive.Value);
                }

                // Fetch voucher
                var voucher = await query.FirstOrDefaultAsync();

                if (voucher == null)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "No voucher data found"
                    });
                }

                // Voucher Header
                var header = new
                {
                    voucherId = voucher.AccountVoucherId,
                    voucherNo = voucher.VoucherNo,
                    vendorId = voucher.VendorId,

                    vendorName = _context.Potential_Vendor
                        .Where(x => x.Id == voucher.VendorId)
                        .Select(x => x.Company_Name)
                        .FirstOrDefault(),

                    voucherType = _context.AccountVoucherType
                        .Where(x => x.AccountVoucherTypeId == voucher.AccountVoucherTypeId)
                        .Select(x => x.VoucherType)
                        .FirstOrDefault(),

                    voucherDate = voucher.VoucherDate,
                    referenceNo = referenceNo,
                    totalAmount = voucher.TotalAmount,
                    paymentDueDate = voucher.PaymentDueDate,

                    paymentMode = _context.AccountPaymentMode
                        .Where(x => x.PaymentModeId == voucher.PaymentModeId)
                        .Select(x => x.PaymentMode)
                        .FirstOrDefault(),

                    status = _context.AccountStatus
                        .Where(x => x.AccountStatusId == voucher.AccountStatusId)
                        .Select(x => x.Status)
                        .FirstOrDefault()
                };

                // Ledger Records
                var ledger = await _context.AccountVoucherDetails
                    .Where(l => l.AccountVoucherId == voucher.AccountVoucherId)
                    .Select(l => new
                    {
                        ledgerName = _context.AccountLedger
                            .Where(x => x.AccountLedgerId == l.AccountLedgerId)
                            .Select(x => x.AccountLedgerName)
                            .FirstOrDefault(),

                        creditAmount = l.CreditAmount,
                        debitAmount = l.DebitAmount,
                        description = l.Description
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        header,
                        ledger
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error fetching voucher details",
                    error = ex.Message
                });
            }
        }

        //Check Voucher Number is Exists or not
        [HttpGet("GetNextVoucherNumber")]
        public async Task<IActionResult> GetNextVoucherNumber(string prefix, int? vendorId = null)
        {
            var query = _context.AccountVoucher
                .Where(x => x.VoucherNo.StartsWith(prefix + "-"));

            // Apply vendor filter only for Vendor Voucher
            if (vendorId.HasValue)
            {
                query = query.Where(x => x.VendorId == vendorId.Value);
            }

            var voucherNumbers = await query
                .Select(x => x.VoucherNo)
                .ToListAsync();

            int maxNumber = 0;

            foreach (var voucher in voucherNumbers)
            {
                var parts = voucher.Split('-');
                if (parts.Length > 1 && int.TryParse(parts[^1], out int num))
                {
                    if (num > maxNumber)
                        maxNumber = num;
                }
            }

            int nextNumber = maxNumber + 1;

            return Ok(new
            {
                success = true,
                voucherNo = $"{prefix}-{nextNumber.ToString("D3")}"
            });
        }

        // Get All vendors lists
        [HttpGet("Vendors")]
        public async Task<IActionResult> GetVendors()
        {
            try
            {
                var vendors = await _context.Potential_Vendor
                    .Select(v => new
                    {
                        vendorId = v.Id,
                        companyName = v.Company_Name
                    })
                    .ToListAsync();

                return Ok(new { success = true, data = vendors });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("Ledger")]
        public IActionResult GetAllAccountLedgers([FromQuery] bool? isActive)
        {
            var query = _context.AccountLedger.AsQueryable();

            if (isActive.HasValue)
            {
                query = query.Where(x => x.IsActive == isActive.Value);
            }

            var data = query
                .Select(x => new
                {
                    accountLedgerId = x.AccountLedgerId,
                    accountLedgerName = x.AccountLedgerName
                })
                .ToList();
            return Ok(new { data });
        }

        // ✅ GET all voucher type
        [HttpGet("VoucherType")]
        public IActionResult GetAllAccountVoucherTypes([FromQuery] bool? isActive)
        {
            var query = _context.AccountVoucherType.AsQueryable();

            if (isActive.HasValue)
            {
                query = query.Where(x => x.IsActive == isActive.Value);
            }

            var data = query
                .Select(x => new
                {
                    accountVoucherTypeId = x.AccountVoucherTypeId,
                    voucherType = x.VoucherType
                })
                .ToList();

            return Ok(data);
        }

        [HttpGet("PurchaseOrders")]
        public async Task<IActionResult> GetPurchaseOrders()
        {
            var data = await _context.MMM_GRNTbl
                .Select(x => new {
                    id = x.Id,
                    purchaseOrderNo = x.GRN_NO
                })
                .ToListAsync();

            return Ok(new { success = true, data });
        }

        [HttpGet("GetPurchaseAmountById")]
        public async Task<IActionResult> GetPurchaseAmountById(int referenceId)
        {
            // Step 1: Fetch the Purchase Order
            var po = await _context.MMM_GRNTbl
                .FirstOrDefaultAsync(x => x.Id == referenceId);

            if (po == null)
                return NotFound(new { success = false, message = "Reference not found" });

            // Step 2: Fetch string values first
            var values = await _context.MMM_GRNProductTbl
                .Where(x => x.G_Id == po.Id)
                .Select(x => x.Total_Value)   // string field from DB
                .ToListAsync();

            // Step 3: Convert string → decimal safely
            decimal totalAmount = values
                .Select(v => decimal.TryParse(v, out var dec) ? dec : 0)
                .Sum();

            return Ok(new
            {
                success = true,
                totalAmount = totalAmount   // returns decimal
            });
        }

        [HttpGet("SalesInvoices")]
        public async Task<IActionResult> GetSaleInvoices()
        {
            var data = await _context.SDM_SOVendItemTbls
                .Select(x => new {
                    id = x.Id,
                    invoiceNo = x.SalesOrderNumber
                })
                .ToListAsync();

            return Ok(new { success = true, data });
        }

        [HttpGet("GetSaleAmountById")]
        public async Task<IActionResult> GetSaleAmountById(int referenceId)
        {
            // Step 1: Fetch the sale Order
            var so = await _context.SDM_SOVendItemTbls
                .FirstOrDefaultAsync(x => x.SalesItemId == referenceId);

            if (so == null)
                return NotFound(new { success = false, message = "Reference not found" });

            // Step 2: Fetch string values first
            var values = await _context.SDM_SOItemTbls
                .Where(x => x.SalesItemId == so.SalesItemId)
                .Select(x => x.Total_Item_Cost)   // string field from DB
                .ToListAsync();

            // Step 3: Convert string → decimal safely
            decimal totalAmount = values
                .Select(v => decimal.TryParse(v, out var dec) ? dec : 0)
                .Sum();

            return Ok(new
            {
                success = true,
                totalAmount = totalAmount   // returns decimal
            });
        }

        [HttpGet("PaymentMode")]
        public IActionResult GetAllPaymentMods([FromQuery] bool? isActive)
        {
            var query = _context.AccountPaymentMode.AsQueryable();

            if (isActive.HasValue)
            {
                query = query.Where(x => x.IsActive == isActive.Value);
            }

            var data = query
                .Select(x => new
                {
                    paymentModeId = x.PaymentModeId,
                    paymentMode = x.PaymentMode
                })
                .ToList();
            return Ok(new { data });
            //return Ok(data);
        }

        [HttpGet("Status")]
        public IActionResult GetAllStatus([FromQuery] bool? isActive)
        {
            var query = _context.AccountStatus.AsQueryable();

            if (isActive.HasValue)
            {
                query = query.Where(x => x.IsActive == isActive.Value);
            }

            var data = query
                .Select(x => new
                {
                    accountStatusId = x.AccountStatusId,
                    status = x.Status
                })
                .ToList();
            return Ok(new { data });
            //return Ok(data);
        }

        [HttpPost("AccountVoucher")]
        public async Task<IActionResult> AddVoucher([FromBody] AccountVoucher model)
        {
            if (model == null)
                return BadRequest(new { success = false, message = "Invalid data" });

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Step 1: Create main voucher
                var voucher = new AccountVoucher
                {
                    VoucherCategory = model.VoucherCategory,
                    VoucherNo = model.VoucherNo,
                    VendorId = model.VendorId,
                    OtherVendor =model.OtherVendor,
                    AccountVoucherTypeId = model.AccountVoucherTypeId,
                    VoucherDate = model.VoucherDate,                   // DateOnly from JSON
                    ReferenceNo = model.ReferenceNo,
                    OtherReferenceNo = model.OtherReferenceNo,
                    TotalAmount = model.TotalAmount,
                    PaymentDueDate = model.PaymentDueDate,             // DateOnly from JSON
                    PaymentModeId = model.PaymentModeId,
                    AccountStatusId = model.AccountStatusId,
                    Description = model.Description,
                    CreatedBy = model.CreatedBy,
                    UpdatedBy = model.UpdatedBy,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    IsActive = true
                };

                _context.AccountVoucher.Add(voucher);
                await _context.SaveChangesAsync();

                int voucherId = voucher.AccountVoucherId; // Get inserted ID

                // Step 2: Insert ledger entries
                if (model.LedgerEntries != null && model.LedgerEntries.Count > 0)
                {
                    foreach (var item in model.LedgerEntries)
                    {
                        var detail = new AccountVoucherDetails
                        {
                            AccountVoucherId = voucherId,
                            AccountLedgerId = item.AccountLedgerId,
                            CreditAmount = item.CreditAmount,
                            DebitAmount = item.DebitAmount,
                            Description = item.Description
                        };

                        _context.AccountVoucherDetails.Add(detail);
                    }

                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();

                return Ok(new
                {
                    success = true,
                    message = "Voucher saved successfully",
                    voucherId = voucherId
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { success = false,
                    message = ex.InnerException?.Message,   // REAL ERROR
                    stack = ex.ToString()
                });
            }
        }

  

    }
}