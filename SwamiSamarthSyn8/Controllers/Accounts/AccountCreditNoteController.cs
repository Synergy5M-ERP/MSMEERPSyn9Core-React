using Humanizer.Localisation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Helper;
using SwamiSamarthSyn8.Models.Accounts;

namespace SwamiSamarthSyn8.Controllers.Accounts
{
    [Route("api/")]
    [ApiController]
    public class AccountCreditNoteController : ControllerBase
    {
        private readonly SwamiSamarthDbContext _context;
        public AccountCreditNoteController(SwamiSamarthDbContext context)
        {
            _context = context;
        }

        private static string GetFinancialYear()
        {
            var now = DateTime.Now;
            if (now.Month >= 4)
                return $"{now.Year}-{(now.Year + 1).ToString().Substring(2)}";
            else
                return $"{now.Year - 1}-{now.Year.ToString().Substring(2)}";
        }

        [HttpGet("GetUnits")]
        public async Task<IActionResult> GetUnits()
        {
            try
            {
                var units = await _context.UOMTbls
                            .Select(g => new
                            {
                                unitId = g.Id,
                                unitName = g.Unit_Of_Measurement
                            })
                            .ToListAsync();

                return Ok(new { success = true, data = units });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetNextCreditNoteNo")]
        public async Task<IActionResult> GetNextCreditNoteNo()
        {
            try
            {
                var fy = GetFinancialYear();

                var lastCreditNote = await _context.AccountCreditNote
                    .Where(x => x.CreditNoteNo.StartsWith($"CN/{fy}/"))
                    .OrderByDescending(x => x.AccountCreditNoteId)
                    .Select(x => x.CreditNoteNo)
                    .FirstOrDefaultAsync();

                int nextNumber = 1;

                if (!string.IsNullOrEmpty(lastCreditNote))
                {
                    var parts = lastCreditNote.Split('/');
                    nextNumber = int.Parse(parts[^1]) + 1;
                }

                var nextCreditNoteNo = $"CN/{fy}/{nextNumber.ToString("D4")}";

                return Ok(new
                {
                    success = true,
                    nextCreditNoteNo
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

        [HttpGet("CategoryVendors")]
        public async Task<IActionResult> AllVendorsBuyers([FromQuery] string category)
        {
            try
            {
                if (string.IsNullOrEmpty(category))
                    return BadRequest(new { success = false, message = "Category is required" });

                var vendors = await _context.Potential_Vendor
                    .Where(v => v.Vendor_Categories == category)
                    .Select(v => new
                    {
                        vendorId = v.Id,
                        vendorName = v.Company_Name,
                        vendorCode = v.Vendor_Code
                    })
                    .OrderBy(v => v.vendorName)
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = vendors
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

        [HttpGet("GetSellerGRNNumbers")]
        public async Task<IActionResult> GetSellerGRNNumbers([FromQuery] string vendorName)
        {
            try
            {
                if (string.IsNullOrEmpty(vendorName))
                    return BadRequest(new { success = false, message = "Selller Name is required" });

                var grns = await _context.MMM_GRNTbl
                    .Where(v => v.Supplier_Name.Trim().ToUpper() == vendorName.Trim().ToUpper())
                    .Select(v => new
                    {
                        invoiceGrnId = v.Id,
                        grnNo = v.GRN_NO,
                        paymentDueDate = v.Payment_Due_On
                    })
                    .OrderBy(v => v.grnNo)
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = grns
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

        [HttpGet("GetBuyersInvoiceNumbers")]
        public async Task<IActionResult> GetBuyersInvoiceNumbers([FromQuery] string buyerName)
        {
            try
            {
                if (string.IsNullOrEmpty(buyerName))
                    return BadRequest(new { success = false, message = "Buyer Name is required" });

                var invoices = await _context.SDM_Inv_VendTbls
                    .Where(v => v.BuyerName.Trim().ToUpper() == buyerName.Trim().ToUpper())
                    .Select(v => new
                    {
                        invoiceGrnId = v.supplied_id,
                        invoiceNo = v.invoice_number,
                        paymentDueDate = v.due_date
                    })
                    .OrderBy(v => v.invoiceNo)
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

        [HttpGet("GetItemsByGRN")]
        public async Task<IActionResult> GetItemsByGRN([FromQuery] int grnId)
        {
            try
            {
                if (grnId <= 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Invalid GRN Id"
                    });
                }

                var items = await _context.MMM_GRNProductTbl
                    .Where(v => v.G_Id == grnId)
                    .Select(v => new
                    {
                        itemId = v.G_Product_Id,
                        itemCode = v.Item_Code,
                        itemName = v.Item_Name
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = items
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

        [HttpGet("GetItemsByInvoice")]
        public async Task<IActionResult> GetItemsByInvoice([FromQuery] int invoiceId)
        {
            try
            {
                if (invoiceId <= 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Invalid Invoice Id"
                    });
                }

                var items = await _context.SDM_InvItemTbls
                    .Where(v => v.supplied_id_id == invoiceId)
                    .Select(v => new
                    {
                        itemId = v.product_id,
                        itemName = v.ProductDiscription
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = items
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

        [HttpGet("GetGRNItemsDetails")]
        public async Task<IActionResult> GetGRNItemsDetails([FromQuery] int itemId)
        {
            try
            {
                if (itemId <= 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Invalid Item Id"
                    });
                }

                var items = await (
                    from grn in _context.MMM_GRNProductTbl
                    join uom in _context.UOMTbls
                    on grn.UOM equals uom.Unit_Of_Measurement
                    where grn.G_Product_Id == itemId
                    select new
                    {
                        itemQty = grn.Quntity,

                        // ✅ THIS FIXES THE DROPDOWN
                        unitId = uom.Id,
                        //itemUnit = uom.Unit_Of_Measurement,

                        itemPrice = grn.RatePerUnit,

                        igst = grn.IGSTtaxrate,
                        cgst = grn.CGSTtaxrate,
                        sgst = grn.SGSTtaxrate,

                        totalTaxAmt = grn.TaxAmount,
                        totalAmount = grn.Total_Value,
                        netAmount = grn.NetAmount,

                        taxType = "CGST_SGST" // adjust if needed
                    }).FirstOrDefaultAsync();

                return Ok(new
                {
                    success = true,
                    data = items
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

        [HttpGet("GetInvoiceItemsDetails")]
        public async Task<IActionResult> GetInvoiceItemsDetails([FromQuery] int itemId)
        {
            try
            {
                if (itemId <= 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Invalid Item Id"
                    });
                }

                var item = await (
                    from inv in _context.SDM_InvItemTbls
                    join uom in _context.UOMTbls
                        on inv.UOM equals uom.Unit_Of_Measurement
                    where inv.product_id == itemId
                    select new
                    {
                        itemQty = inv.SoQty,

                        // ✅ REQUIRED FOR DROPDOWN
                        unitId = uom.Id,
                       // itemUnit = uom.Unit_Of_Measurement,

                        itemPrice = inv.RatePerUnit,

                        totalTaxAmt = inv.total_amount,
                        netAmount = inv.net_amount,
                        totalAmount = inv.Total_Item_Value,

                        taxType = inv.Tax_Type,

                        cgst = TaxRateHelper.GetTaxRate(inv.Tax_Rate, "CGST"),
                        sgst = TaxRateHelper.GetTaxRate(inv.Tax_Rate, "SGST"),
                        igst = TaxRateHelper.GetTaxRate(inv.Tax_Rate, "IGST")
                    }
                ).FirstOrDefaultAsync();

                if (item == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message = "Item not found"
                    });
                }

                return Ok(new
                {
                    success = true,
                    data = item
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

        [HttpPost("SaveCreditNote")]
        public async Task<IActionResult> SaveCreditNote([FromBody] AccountCreditNote model)
        {
            /* ---------------- VALIDATION ---------------- */
            if (model == null)
                return BadRequest("Invalid payload");

            if (string.IsNullOrEmpty(model.Category))
                return BadRequest("Category is required");

            if (model.CreditNoteEntries == null || !model.CreditNoteEntries.Any())
                return BadRequest("At least one item is required");

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                /* ----------- SAVE CREDIT NOTE ----------- */
                var creditNote = new AccountCreditNote
                {
                    Category = model.Category,
                    VendorId = model.VendorId,
                    InvocieNoId = model.InvocieNoId,
                    CreditNoteNo = model.CreditNoteNo,
                    CreditNoteDate = model.CreditNoteDate,
                    PaymentDueDate = model.PaymentDueDate,
                    TotalAmount = model.TotalAmount,
                    TotalTaxAmount = model.TotalTaxAmount,
                    GrandAmount = model.GrandAmount,
                    CreatedBy = model.CreatedBy
                };

                _context.AccountCreditNote.Add(creditNote);
                await _context.SaveChangesAsync();

                int creditNoteId = creditNote.AccountCreditNoteId;

                /* ----------- SAVE ITEMS ----------- */
                if (model.CreditNoteEntries != null && model.CreditNoteEntries.Count > 0)
                {
                    foreach (var item in model.CreditNoteEntries)
                    {
                        var creditItem = new AccountCreditNoteDetails
                        {
                            AccountCreditNoteId = creditNote.AccountCreditNoteId,
                            ItemId = item.ItemId,
                            Qty = item.Qty,
                            UnitId = item.UnitId,
                            Price = item.Price,
                            TotalAmount = item.TotalAmount,
                            TaxTypeId = item.TaxTypeId,
                            CGST = item.CGST,
                            SGST = item.SGST,
                            IGST = item.IGST,
                            TotalTax = item.TotalTax,
                            NetAmount = item.NetAmount
                        };

                        _context.AccountCreditNoteDetails.Add(creditItem);
                    }
                    await _context.SaveChangesAsync();
                }
                
                await transaction.CommitAsync();

                return Ok(new{ success = true, message = "Credit Note saved successfully", creditNoteId });

            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to save Credit Note",
                    error = ex.Message,
                    innerError = ex.InnerException?.Message
                });
            }
        }


    }
}


