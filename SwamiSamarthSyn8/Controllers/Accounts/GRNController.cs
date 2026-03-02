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
            var sellers = await _swamiContext.MMM_GRNTbl
                .Select(x => x.Supplier_Name)
                .Distinct()
                .OrderBy(x => x)
                .ToListAsync();

            return Ok(new { success = true, data = sellers });
        }

        // ✔ GET GRN NUMBERS BY SELLER
        [HttpGet("GetGRNNumbersBySeller")]
        public async Task<IActionResult> GetGRNNumbersBySeller([FromQuery] string sellerName)
        {
            if (string.IsNullOrEmpty(sellerName))
                return BadRequest(new { success = false, message = "Seller name is required" });

            var grnNumbers = await _swamiContext.MMM_GRNTbl
                .Where(g => g.Supplier_Name == sellerName)
                .Select(g => new
                {
                    g.Id,
                    grnNumber = g.GRN_NO
                })
                .OrderBy(g => g.grnNumber)
                .ToListAsync();

            return Ok(new { success = true, data = grnNumbers });
        }

        // ✔ GET PO NUMBERS BY GRN NUMBER
        //[HttpGet("GetPONumbersByGRN")]
        //public async Task<IActionResult> GetPONumbersByGRN([FromQuery] string grnNumber)
        //{
        //    if (string.IsNullOrEmpty(grnNumber))
        //        return BadRequest(new { success = false, message = "GRN number is required" });

        //    var poNumbers = await _context.MMM_GRNTbl
        //        .Where(g => g.GRN_NO == grnNumber)
        //        .Select(g => new
        //        {
        //            poNumber = g.PO_No
        //        })
        //        .Distinct()
        //        .ToListAsync();

        //    return Ok(new { success = true, data = poNumbers });
        //}
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
        public async Task<IActionResult> GetGRNDetails([FromQuery] int grnId)
        {
            if (grnId <= 0)
                return BadRequest(new { success = false, message = "Valid GRN ID is required" });

            // Fetch GRN Header
            var header = await _swamiContext.MMM_GRNTbl
                .Where(g => g.Id == grnId)
                .Select(g => new
                {
                    g.Id,
                    grnNumber = g.GRN_NO,
                    poNumber = g.PO_No,
                    g.Supplier_Name,
                    g.Supplier_Address,
                    grnDate = g.GRN_Date,
                    invoiceNumber = g.Invoice_NO,
                    invoiceDate = g.Invoice_Date,
                    vehicleNo = g.Vehicle_No,
                    transporterName = g.Transporter,
                    paymentDue = g.Payment_Due_On

                })
                .FirstOrDefaultAsync();

            if (header == null)
                return NotFound(new { success = false, message = "GRN not found" });

            // Fetch PO Details
            var poDetails = await _swamiContext.MMM_EnquiryVendorItemTbl
                .Where(p => p.PONO == header.poNumber)
                .Select(p => new
                {
                    p.PONO,
                    poDate = p.PODate
                })
                .FirstOrDefaultAsync();

            return Ok(new
            {
                success = true,
                data = new
                {
                    header,
                    poDetails,
                    items = await _swamiContext.MMM_GRNProductTbl
                        .Where(i => i.G_Id == grnId)
                        .Select(i => new
                        {
                            i.G_Id,
                            itemName = i.Item_Name,
                            grade = i.Item_Descrpition,
                            itemCode = i.Item_Code,
                            receivedQty = i.Received_Qty,
                            acceptedQty = i.Accepted_Qty,
                            rejectedQty = i.Rejected_Qty,
                            rate = i.Rate,
                            taxType = i.TaxType,
                            taxRate = i.TaxRate,
                            taxAmount = i.TaxAmount,
                            netAmount = i.NetAmount,
                            totalTaxValue = i.InvTotalTaxValue,
                            cgst = i.Cgst_Tax_Amt,
                            igst = i.Igst_Tax_Amt,
                            sgst = i.Sgst_Tax_Amt,
                        })
                        .ToListAsync()
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
        [HttpGet("GetGRNsBySeller")]
        public async Task<IActionResult> GetGRNsBySeller(int sellerId)
        {
            if (sellerId <= 0)
                return BadRequest(new { success = false, message = "Invalid sellerId" });

            var sellerGrns = await _msmeContext.AccountGRN
                .Where(x => x.VendorId == sellerId && x.IsActive == true)
                .ToListAsync();

            if (!sellerGrns.Any())
                return Ok(new { success = true, data = new List<object>() });

            var grnNos = sellerGrns.Select(s => s.GRNNumber).ToList();

            var rawData = await (
                from g in _swamiContext.MMM_GRNTbl
                join i in _swamiContext.MMM_GRNProductTbl
                    on g.Id equals i.G_Id
                where grnNos.Contains(g.GRN_NO)
                select new
                {
                    g.Id,
                    g.GRN_NO,
                    g.GRN_Date,
                    g.Invoice_NO,
                    g.Invoice_Date,
                    g.PO_No,
                    i.Purchase_Date,
                    g.Supplier_Name,
                    i.Item_Name,
                    i.Item_Code,
                    i.TaxAmount,
                    i.Total_Value,
                    i.CGSTtaxrate,
                    i.SGSTtaxrate,
                    i.IGSTtaxrate,
                    i.Item_Descrpition,
                    i.Received_Qty,
                    i.Accepted_Qty,
                    i.Rejected_Qty,
                    i.NetAmount
                }).ToListAsync();

            var groupedData = rawData
                .GroupBy(x => x.GRN_NO)
                .Select(grp =>
                {
                    var first = grp.First();

                    return new
                    {
                        header = new
                        {
                            grnNumber = first.GRN_NO,

                            // ✅ Format GRN Date
                            grnDate = first.GRN_Date.HasValue
                                ? first.GRN_Date.Value.ToString("dd-MM-yyyy")
                                : "",

                            invoiceNumber = first.Invoice_NO,

                            // ✅ Format Invoice Date
                            invoiceDate = first.Invoice_Date.HasValue
                                ? first.Invoice_Date.Value.ToString("dd-MM-yyyy")
                                : "",

                            poNumber = first.PO_No,

                            // ✅ Format Purchase Date (string parse)
                            poDate = DateTime.TryParse(first.Purchase_Date, out DateTime pDate)
                                ? pDate.ToString("dd-MM-yyyy")
                                : "",

                            transporterName = first.Supplier_Name
                        },

                        items = grp.Select(item => new
                        {
                            itemName = item.Item_Name,
                            grade = item.Item_Descrpition,   // ✅ ADD THIS
                            item_Code = item.Item_Code,
                            receivedQty = item.Received_Qty,
                            approvedQty = item.Accepted_Qty,
                            damagedQty = item.Rejected_Qty,
                            totalTaxValue = item.TaxAmount,
                            totalItemValue = item.Total_Value,
                            netamount=item.NetAmount,
                            cgst = item.CGSTtaxrate,
                            sgst = item.SGSTtaxrate,
                            igst = item.IGSTtaxrate
                        }).ToList()
                    };
                })
                .ToList();

            return Ok(new { success = true, data = groupedData });
        }
        //[HttpGet("GetGRNsBySeller")]
        //public async Task<IActionResult> GetGRNsBySeller(int sellerId)
        //{
        //    var grns = await _msmeContext.AccountGRN
        //        .Where(g =>
        //            g.VendorId == sellerId &&
        //            g.IsActive &&
        //            g.CheckGRN == true   // ✅ Only Checked GRN
        //        )
        //        .OrderByDescending(g => g.GRNNumber)
        //        .ToListAsync();

        //    return Ok(new { success = true, data = grns });
        //}
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
        [HttpGet("GRNApprovedDetails")]
        public async Task<IActionResult> GRNApprovedDetails(int page = 1, int pageSize = 10)
        {
            try
            {
                // STEP 1: Get approved GRNs
                var approvedGRNs = await _msmeContext.AccountGRN
                    .Where(a => a.IsActive == true && a.ApprovedGRN == true)
                    .OrderByDescending(a => a.AccountGRNId)
                    .ToListAsync();

                var grnNumbers = approvedGRNs
                    .Select(a => a.GRNNumber)
                    .ToList();

                // STEP 2: Get GRN details from other DB
                var grnDetails = await _swamiContext.MMM_GRNTbl
                    .Where(g => grnNumbers.Contains(g.GRN_NO))
                    .ToListAsync();

                // STEP 3: Manual Join in Memory
                var result = (from a in approvedGRNs
                              join g in grnDetails
                              on a.GRNNumber equals g.GRN_NO
                              orderby a.AccountGRNId descending
                              select new
                              {
                                  a.AccountGRNId,
                                  a.GRNNumber,
                                  GRNDate = g.GRN_Date,
                                  VendorName = g.Supplier_Name,
                                  PONumber = g.PO_No,
                                  InvoiceNumber = g.Invoice_NO,
                                  a.Total_Amount,
                                  a.SGSTAmount,
                                  a.CGSTAmount,
                                  a.IGSTAmount
                              }).ToList();

                var totalCount = result.Count;

                var pagedData = result
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                return Ok(new
                {
                    success = true,
                    data = pagedData,
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
    }
}
