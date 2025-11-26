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
        [HttpGet("GetPONumbersByGRN")]
        public async Task<IActionResult> GetPONumbersByGRN([FromQuery] string grnNumber)
        {
            if (string.IsNullOrEmpty(grnNumber))
                return BadRequest(new { success = false, message = "GRN number is required" });

            var poNumbers = await _context.MMM_GRNTbl
                .Where(g => g.GRN_NO == grnNumber)
                .Select(g => new
                {
                    poNumber = g.PO_No
                })
                .Distinct()
                .ToListAsync();

            return Ok(new { success = true, data = poNumbers });
        }

        // ✔ GET FULL GRN DETAILS
        [HttpGet("GetGRNDetails")]
        public async Task<IActionResult> GetGRNDetails([FromQuery] int grnId)
        {
            if (grnId <= 0)
                return BadRequest(new { success = false, message = "Valid GRN ID is required" });

            var header = await _context.MMM_GRNTbl
                .Where(g => g.Id == grnId)
                .Select(g => new
                {
                    g.Id,
                    grnNumber = g.GRN_NO,
                    poNumber = g.PO_No,
                    g.Supplier_Name,
                    g.Supplier_Address,
                    g.GRN_Date,
                    g.Invoice_NO,
                    g.Invoice_Date,
                    g.Vehicle_No,
                    g.Transporter
                })
                .FirstOrDefaultAsync();

            if (header == null)
                return NotFound(new { success = false, message = "GRN not found" });

            var items = await _context.MMM_GRNProductTbl
                .Where(i => i.G_Id == grnId)
                .Select(i => new
                {
                    i.G_Id,
                    itemName = i.Item_Name,
                    receivedQty = i.Received_Qty,
                    acceptedQty = i.Accepted_Qty,
                    rejectedQty = i.Rejected_Qty,
                    rate = i.Rate,
                    taxType = i.TaxType,
                    taxRate = i.TaxRate,
                    taxAmount = i.TaxAmount,
                    netAmount = i.NetAmount
                })
                .ToListAsync();

            return Ok(new
            {
                success = true,
                data = new
                {
                    header,
                    items
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

                var vendor = _context.Potential_Vendor.FirstOrDefault(v => v.Id == request.VendorId);
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
                    InvoiceDate = request.InvoiceDate,
                    Status = request.Status,
                    VehicleNo = request.VehicleNo,
                    TotalAmount = request.TotalAmount,
                    TotalTaxAmount = request.TotalTaxAmount,
                    GrandAmount = request.GrandAmount,
                    Description = request.Description,
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
                            Description = i.Description
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

    }
}
