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

        //// ✔ GET FULL GRN DETAILS
        //[HttpGet("GetGRNDetails")]
        //public async Task<IActionResult> GetGRNDetails([FromQuery] int grnId)
        //{
        //    if (grnId <= 0)
        //        return BadRequest(new { success = false, message = "Valid GRN ID is required" });

        //    var header = await _context.MMM_GRNTbl
        //        .Where(g => g.Id == grnId)
        //        .Select(g => new
        //        {
        //            g.Id,
        //            grnNumber = g.GRN_NO,
        //            poNumber = g.PO_No,
        //            g.Supplier_Name,
        //            g.Supplier_Address,
        //            g.GRN_Date,
        //            g.Invoice_NO,
        //            g.Invoice_Date,
        //            g.Vehicle_No,
        //            g.Transporter
        //        })
        //        .FirstOrDefaultAsync();

        //    if (header == null)
        //        return NotFound(new { success = false, message = "GRN not found" });

        //    var items = await _context.MMM_GRNProductTbl
        //        .Where(i => i.G_Id == grnId)
        //        .Select(i => new
        //        {
        //            i.G_Id,
        //            itemName = i.Item_Name,
        //            receivedQty = i.Received_Qty,
        //            acceptedQty = i.Accepted_Qty,
        //            rejectedQty = i.Rejected_Qty,
        //            rate = i.Rate,
        //            taxType = i.TaxType,
        //            taxRate = i.TaxRate,
        //            taxAmount = i.TaxAmount,
        //            netAmount = i.NetAmount
        //        })
        //        .ToListAsync();

        //    return Ok(new
        //    {
        //        success = true,
        //        data = new
        //        {
        //            header,
        //            items
        //        }
        //    });

        //}
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
                            totalTaxValue=i.InvTotalTaxValue,
                            cgst =i.Cgst_Tax_Amt,
                            igst=i.Igst_Tax_Amt,
                            sgst=i.Sgst_Tax_Amt,
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
                // 1️⃣ Fetch GRNs for the seller safely
                var grns = await _context.AccountGRN
                    .Where(g => g.VendorId == sellerId)
                    .OrderByDescending(g => g.GRNDate ?? DateTime.MinValue)
                    .Select(g => new
                    {
                        g.AccountGRNId,
                        g.VendorId,
                        GRNNumber = g.GRNNumber ?? "",
                        GRNDate = g.GRNDate,
                        InvoiceNumber = g.InvoiceNumber ?? "",
                        InvoiceDate = g.InvoiceDate,
                        PONumber = g.PONumber ?? "",
                        PODate = g.PODate,
                        PaymentDueDate = g.PaymentDueDate,
                        Status = g.Status ?? "",
                        VehicleNo = g.VehicleNo ?? "",
                        TransporterName = g.TransporterName ?? "",
                        TotalAmount = g.TotalAmount ?? 0m,
                        TotalTaxAmount = g.TotalTaxAmount ?? 0m,
                        GrandAmount = g.GrandAmount ?? 0m,
                        Description = g.Description ?? "",
                        g.CreatedBy,
                        g.CreatedDate,
                        g.UpdatedBy,
                        g.UpdatedDate,
                        g.IsActive,
                        g.BillStatus
                    })
                    .Take(200000)
                    .ToListAsync();

                // 2️⃣ Get GRN Ids
                var grnIds = grns.Select(g => g.AccountGRNId).ToList();

                // 3️⃣ Fetch GRN Details safely
                var grnDetails = await _context.AccountGRNDetails
                    .Where(d => grnIds.Contains(d.AccountGRNId))
                    .Select(d => new
                    {
                        d.AccountGRNDetailsId,
                        d.AccountGRNId,
                        d.ItemId,
                        Item_Grade = d.Item_Grade ?? "",
                        Item_Code = d.Item_Code ?? "",
                        itemName = d.Description ?? "",            // frontend expects itemName
                        ReceivedQty = d.ReceivedQty ,
                        ApprovedQty = d.ApprovedQty,
                        DamagedQty = d.DamagedQty,
                        Unit = d.Unit ?? "",
                        TaxType = d.TaxType ?? "",
                        CGST = d.CGST ?? 0,
                        SGST = d.SGST ?? 0,
                        IGST = d.IGST ?? 0,
                        totalTaxValue = d.TotalTaxAmount ?? 0,   // frontend expects totalTaxValue
                        totalItemValue = d.TotalAmount ?? 0      // frontend expects totalItemValue
                    })
                    .ToListAsync();

                // 4️⃣ Map GRN headers + details
                var result = grns.Select(g => new
                {
                    header = new
                    {
                        g.AccountGRNId,
                        g.VendorId,
                        g.GRNNumber,
                        GRNDate = g.GRNDate?.ToString("yyyy-MM-dd") ?? "",
                        g.InvoiceNumber,
                        InvoiceDate = g.InvoiceDate?.ToString("yyyy-MM-dd") ?? "",
                        g.PONumber,
                        PODate = g.PODate?.ToString("yyyy-MM-dd") ?? "",
                        PaymentDueDate = g.PaymentDueDate?.ToString("yyyy-MM-dd") ?? "",
                        g.Status,
                        g.VehicleNo,
                        g.TransporterName,
                        g.TotalAmount,
                        g.TotalTaxAmount,
                        g.GrandAmount,
                        g.Description,
                        g.CreatedBy,
                        CreatedDate = g.CreatedDate.ToString("yyyy-MM-dd HH:mm:ss"),
                        g.UpdatedBy,
                        UpdatedDate = g.UpdatedDate?.ToString("yyyy-MM-dd HH:mm:ss") ?? "",
                        g.IsActive,
                        g.BillStatus
                    },
                    items = grnDetails
                        .Where(d => d.AccountGRNId == g.AccountGRNId)
                        .ToList()
                }).ToList();

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

        public class GRNApprovalDto
        {
            public int AccountGRNId { get; set; }
            public string BillStatus { get; set; }
            public List<GRNItemDto> Items { get; set; }
        }

        public class GRNItemDto
        {
            public int AccountGRNDetailsId { get; set; }
            public bool? BillApprove { get; set; }
        }

    }
}
