using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models;
using SwamiSamarthSyn8.Models.Accounts;
using static SwamiSamarthSyn8.Controllers.Accounts.GRNController;
using static SwamiSamarthSyn8.Models.Accounts.PaymentAllocationDtos;

namespace SwamiSamarthSyn8.Controllers.Accounts
{
    [Route("api/[controller]")]
    [ApiController]
    public class GRNController : ControllerBase
    {
        private readonly SwamiSamarthDbContext _context;
        private readonly ILogger<GRNController> _logger;
        public GRNController(SwamiSamarthDbContext context, ILogger<GRNController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // ✔ GET SELLER LIST
        [HttpGet("suppliers")]
        public async Task<IActionResult> GetSellers()
        {
            var sellers = await _context.MMM_GRNTbl
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

            var grnNumbers = await _context.MMM_GRNTbl
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
            var poNumbers = await _context.MMM_GRNTbl
                .Where(g => g.GRN_NO == grnNumber)
                .Select(g => g.PO_No)
                .Distinct()
                .ToListAsync();

            if (!poNumbers.Any())
                return Ok(new { success = true, data = new List<object>() });

            // Step 2: Get ONLY PO Date + PONO from MMM_EnquiryVendorItemTbl
            var poDetails = await _context.MMM_EnquiryVendorItemTbl
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
            var header = await _context.MMM_GRNTbl
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
            var poDetails = await _context.MMM_EnquiryVendorItemTbl
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
                    items = await _context.MMM_GRNProductTbl
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
            {
                _logger.LogWarning("Invalid vendor request received.");
                return BadRequest("Invalid vendor");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                _logger.LogInformation("Saving GRN for VendorId: {VendorId}", request.VendorId);

                var vendor = _context.MMM_GRNTbl.FirstOrDefault(v => v.Id == request.VendorId);
                if (vendor == null)
                {
                    _logger.LogWarning("Vendor not found: {VendorId}", request.VendorId);
                    return BadRequest(new { success = false, message = "Vendor not found: " + request.VendorId });
                }

                var grn = new AccountGRN
                {
                    VendorId = vendor.Id,
                    GRNNumber = request.GrnNumber,
                    GRNDate = request.GrnDate,
                    InvoiceNumber = request.InvoiceNumber,
                    PONumber = request.PoNumber,
                    PODate = request.poDate,
                    InvoiceDate = request.InvoiceDate,
                    Status = request.Status,
                    VehicleNo = request.VehicleNo,
                    TotalAmount = request.TotalAmount,
                    TotalTaxAmount = request.TotalTaxAmount,
                    GrandAmount = request.GrandAmount,
                    Description = request.Description,
                    TransporterName = request.TransporterName,
                    BillStatus = "Pending",     // or "Approve Pending"
                    CreatedBy = 0,
                    CreatedDate = DateTime.Now,
                    UpdatedBy = 0,
                    UpdatedDate = DateTime.Now,
                    IsActive = true

                };

                _context.AccountGRN.Add(grn);
                await _context.SaveChangesAsync();
                _logger.LogInformation("GRN saved with Id: {GRNId}", grn.AccountGRNId);

                if (request.Items != null)
                {
                    foreach (var i in request.Items)
                    {
                        var product = _context.MMM_GRNProductTbl
                            .FirstOrDefault(x => x.Item_Name.ToLower() == i.ItemName.ToLower());

                        if (product == null)
                        {
                            _logger.LogWarning("Item not found: {ItemName}", i.ItemName);
                            return BadRequest(new { success = false, message = "Item not found: " + i.ItemName });
                        }

                        var item = new AccountGRNDetails
                        {
                            AccountGRNId = grn.AccountGRNId,
                            ItemId = product.G_Product_Id,
                            ReceivedQty = i.ReceivedQty,
                            ApprovedQty = i.ApprovedQty,
                            DamagedQty = i.DamagedQty,
                            Unit = i.Unit,
                            TaxType = i.TaxType,
                            CGST = i.CGST,
                            SGST = i.SGST,
                            IGST = i.IGST,
                            Description = i.Description,

                            Item_Code = product.Item_Code,
                            Item_Grade = product.Item_Descrpition,
                            TotalAmount = i.TotalAmount,
                            TotalTaxAmount = i.TotalTaxAmount,
                            BillApprove = false,


                        };

                        _context.AccountGRNDetails.Add(item);
                        _logger.LogInformation("Added item {ItemName} to GRN {GRNId}", i.ItemName, grn.AccountGRNId);
                    }

                    await _context.SaveChangesAsync();
                    _logger.LogInformation("All GRN items saved for GRN {GRNId}", grn.AccountGRNId);
                }

                await transaction.CommitAsync();
                _logger.LogInformation("Transaction committed for GRN {GRNId}", grn.AccountGRNId);

                return Ok(new { success = true, message = "GRN saved", grnId = grn.AccountGRNId });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error saving GRN for VendorId: {VendorId}", request.VendorId);
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }


        [HttpGet("GetgrnSellers")]
        public IActionResult GetgrnSellers()
        {
            var sellers = _context.AccountGRN
                .Where(g => g.IsActive == true)
                .GroupBy(g => new { g.VendorId, g.Description })
                .Select(g => new
                {
                    id = g.Key.VendorId,
                    name = g.Key.Description   // <-- Seller Name from Description column
                })
                .ToList();

            return Ok(new { success = true, data = sellers });
        }

        [HttpGet("GetGRNsBySeller")]
        public async Task<IActionResult> GetGRNsBySeller(int sellerId)
        {
            try
            {
                var grns = await _context.AccountGRN
                    .Where(g =>
                        g.VendorId == sellerId &&
                        g.IsActive == true &&
                        g.BillStatus != null &&
                        g.BillStatus.Trim().ToLower() == "pending"
                    )
                    .OrderByDescending(g => g.GRNDate ?? DateTime.MinValue)
                    .Select(g => new
                    {
                        g.AccountGRNId,
                        g.VendorId,
                        g.GRNNumber,
                        g.GRNDate,
                        g.InvoiceNumber,
                        g.InvoiceDate,
                        g.PONumber,
                        g.PODate,
                        g.PaymentDueDate,
                        g.Status,
                        g.VehicleNo,
                        g.TransporterName,
                        g.TotalAmount,
                        g.TotalTaxAmount,
                        g.GrandAmount,
                        g.Description,
                        g.CreatedBy,
                        g.CreatedDate,
                        g.UpdatedBy,
                        g.UpdatedDate,
                        g.IsActive,
                        g.BillStatus
                    })
                    .ToListAsync();

                if (!grns.Any())
                    return Ok(new { success = true, data = new object[0], message = "No pending GRNs found" });

                var grnIds = grns.Select(g => g.AccountGRNId).ToList();

                var grnDetails = await _context.AccountGRNDetails
                    .Where(d =>
                        grnIds.Contains(d.AccountGRNId) &&
                        (d.BillApprove == false || d.BillApprove == null)
                    )
                    .Select(d => new
                    {
                        d.AccountGRNDetailsId,
                        d.AccountGRNId,
                        d.ItemId,
                        itemName = d.Description ?? "",
                        d.ReceivedQty,
                        d.ApprovedQty,
                        d.DamagedQty,
                        d.TotalAmount,
                        d.TotalTaxAmount,

                        Unit = d.Unit ?? "",
                        d.BillApprove
                    })
                    .ToListAsync();

                var result = grns
                    .Select(g => new
                    {
                        header = g,
                        items = grnDetails.Where(d => d.AccountGRNId == g.AccountGRNId).ToList()
                    })
                    .Where(x => x.items.Any())
                    .ToList();

                return Ok(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
        }

        [HttpPost("SaveMultipleGRN")]
        public IActionResult SaveMultipleGRN([FromBody] List<GRNApprovalDto> approvals)
        {
            try
            {
                foreach (var grn in approvals)
                {
                    var dbGRN = _context.AccountGRN.FirstOrDefault(x => x.AccountGRNId == grn.AccountGRNId);
                    if (dbGRN != null)
                    {
                        dbGRN.BillStatus = grn.BillStatus;
                        dbGRN.UpdatedDate = DateTime.Now;
                    }

                    foreach (var item in grn.Items)
                    {
                        var dbItem = _context.AccountGRNDetails.FirstOrDefault(x => x.AccountGRNDetailsId == item.AccountGRNDetailsId);
                        if (dbItem != null)
                        {
                            dbItem.BillApprove = item.BillApprove;
                        }
                    }
                }

                _context.SaveChanges();
                return Ok(new { success = true, message = "GRNs approved successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

     

       
        [HttpGet("GRNApprovedDetails")]
        public async Task<IActionResult> GRNApprovedDetails(int page = 1, int pageSize = 10)
        {
            try
            {
                if (page <= 0) page = 1;
                if (pageSize <= 0) pageSize = 10;

                // 1️⃣ Base GRN data
                var grnQuery =
                    from g in _context.AccountGRN
                    join d in _context.AccountGRNDetails
                        on g.AccountGRNId equals d.AccountGRNId
                    where g.IsActive
                          && g.BillStatus != null
                          && (g.BillStatus.ToLower() == "approved"
                              || g.BillStatus.ToLower() == "partially paid")
                          && d.BillApprove == true
                    group d by new
                    {
                        g.AccountGRNId,
                        g.GRNNumber,
                        g.GRNDate,
                        g.Description,
                        g.PONumber,
                        g.InvoiceNumber,
                        g.InvoiceDate
                    }
                    into grp
                    select new GRNApprovedDto
                    {
                        AccountGRNId = grp.Key.AccountGRNId,
                        GRNNumber = grp.Key.GRNNumber,
                        GRNDate = grp.Key.GRNDate,
                        VendorName = grp.Key.Description,
                        PONumber = grp.Key.PONumber,
                        InvoiceNumber = grp.Key.InvoiceNumber,
                        InvoiceDate = grp.Key.InvoiceDate,

                        CGST = grp.Sum(x => x.CGST ?? 0),
                        SGST = grp.Sum(x => x.SGST ?? 0),
                        IGST = grp.Sum(x => x.IGST ?? 0),

                        TotalAmount =
                            grp.Sum(x => x.TotalAmount ?? 0) +
                            grp.Sum(x => x.TotalTaxAmount ?? 0),

                        PaidAmount = 0,
                        BalanceAmount = 0
                    };

                var grnList = await grnQuery.ToListAsync();

                // 2️⃣ Payment aggregation
                var paymentData = await _context.AccountPaymentAllocation
                    .Where(x => x.IsActive)
                    .GroupBy(x => x.GRNNo)
                    .Select(g => new
                    {
                        GRNNo = g.Key,
                        PaidAmount = g.Sum(x => x.PaidAmount),
                        BalanceAmount = g.Sum(x => x.BalanceAmount)
                    })
                    .ToListAsync();

                // 3️⃣ Merge payment into GRN list
                foreach (var grn in grnList)
                {
                    var pay = paymentData.FirstOrDefault(p => p.GRNNo == grn.GRNNumber);
                    if (pay != null)
                    {
                        grn.PaidAmount = pay.PaidAmount;
                        grn.BalanceAmount = pay.BalanceAmount;
                    }
                    else
                    {
                        grn.BalanceAmount = grn.TotalAmount;
                    }
                }

                var totalCount = grnList.Count;

                var data = grnList
                    .OrderByDescending(x => x.GRNDate)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                return Ok(new
                {
                    success = true,
                    data,
                    totalCount
                });
            }
            catch (Exception ex)
            {
                // 🔥 SEE REAL ERROR IN CONSOLE
                return StatusCode(500, ex.Message);
            }
        }


       
        [HttpPost("SavePaymentAllocation")]
        public async Task<IActionResult> SavePaymentAllocation(
      [FromBody] PaymentAllocationRequest request)
        {
            if (request?.Payments == null || !request.Payments.Any())
                return BadRequest(new { success = false, message = "No payment data received" });

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                foreach (var payment in request.Payments)
                {
                    var grn = await _context.AccountGRN
                        .FirstOrDefaultAsync(x => x.AccountGRNId == payment.AccountGRNId && x.IsActive);

                    if (grn == null)
                        return BadRequest(new { success = false, message = "GRN not found" });

                    if (payment.PaidAmount <= 0)
                        return BadRequest(new { success = false, message = "Paid amount must be greater than 0" });

                    if (payment.PaidAmount > payment.TotalAmount)
                        return BadRequest(new
                        {
                            success = false,
                            message = "Paid amount cannot exceed total amount"
                        });

                    var allocation = new AccountPaymentAllocation
                    {
                        GRNNo = grn.GRNNumber,
                        GRNDate = grn.GRNDate,
                        PurchaseNo = grn.PONumber,
                        PaymentDueDate = grn.PaymentDueDate,
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
                        RTGSDate = request.Date,

                        Description = $"Payment against GRN {grn.GRNNumber}",
                        IsActive = true
                    };

                    _context.AccountPaymentAllocation.Add(allocation);

                    grn.BillStatus = payment.BalanceAmount == 0
                        ? "Paid"
                        : "Partially Paid";
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { success = true, message = "Payment allocation saved successfully" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }



    }
}
