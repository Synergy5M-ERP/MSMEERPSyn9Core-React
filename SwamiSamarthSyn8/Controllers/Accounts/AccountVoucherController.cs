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

        [HttpGet("AccountVouchers")]
        public async Task<IActionResult> GetAllVouchers([FromQuery] bool? isActive)
        {
            var vouchers = _context.AccountVoucher.AsQueryable();

            if (isActive.HasValue)
            {
                vouchers = vouchers.Where(x => x.IsActive == isActive.Value);
            }

            var data = vouchers
                .Select(v => new
                {
                    voucherId = v.AccountVoucherId,
                    voucherNo = v.VoucherNo,
                    vendorId = v.VendorId,
                    voucherTypeId = v.AccountVoucherTypeId,
                    voucherDate = v.VoucherDate,
                    referenceNo = v.ReferenceNo,
                    totalAmount = v.TotalAmount,
                    paymentDueDate = v.PaymentDueDate,
                    paymentModeId = v.PaymentModeId,
                    accountStatusId = v.AccountStatusId,
                    description = v.Description
                })
                .ToList();
            return Ok(new { data });
            //return Ok(data);
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

                //if (vendors == null || vendors.Count == 0)
                //    //return NotFound(new { success = false, message = "No vendors found" });

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
            //return Ok(data);
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
                    VoucherNo = model.VoucherNo,
                    VendorId = model.VendorId,
                    AccountVoucherTypeId = model.AccountVoucherTypeId,
                    VoucherDate = model.VoucherDate,                   // DateOnly from JSON
                    ReferenceNo = model.ReferenceNo,
                    TotalAmount = model.TotalAmount,
                    PaymentDueDate = model.PaymentDueDate,             // DateOnly from JSON
                    PaymentModeId = model.PaymentModeId,
                    AccountStatusId = model.AccountStatusId,
                    Description = model.Description,
                    CreatedBy = model.CreatedBy,
                    UpdatedBy = model.UpdatedBy,
                   // CreatedDate = DateOnly.FromDateTime(DateTime.Now),
                    //UpdatedDate = DateOnly.FromDateTime(DateTime.Now),
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