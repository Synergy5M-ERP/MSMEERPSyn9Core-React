using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models.Accounts;
using System.Linq;
using System.Reflection.PortableExecutable;

namespace SwamiSamarthSyn8.Controllers.Accounts
{
    [Route("api/")]
    [ApiController]
    public class AccountSaleController : ControllerBase
    {
        private readonly SwamiSamarthDbContext _context;
        public AccountSaleController(SwamiSamarthDbContext context)
        {
            _context = context;
        }

        public string buyerCode;
        public int buyerIdd;

        // Get All vendors lists
        [HttpGet("Buyers")]
        public async Task<IActionResult> GetBuyers()
        {
            try
            {
                var buyers = await _context.SDM_Inv_VendTbls
                            .GroupBy(v => new { v.BuyerName })
                            .Select(g => new
                            {
                                buyerId = g.First().supplied_id,
                                buyerName = g.Key.BuyerName,
                                buyerCode = g.First().Buyer_code
                            })
                            .OrderBy(v => v.buyerName)
                            .ToListAsync();

                return Ok(new { success = true, data = buyers });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetinvoiceNumbersBybuyer")]
        public async Task<IActionResult> GetInvoicesByBuyer(string buyerCode)
        {
            try
            {
                var invoices = await _context.SDM_Inv_VendTbls
                    .Where(i => i.Buyer_code == buyerCode &&
                                !string.IsNullOrEmpty(i.invoice_number))
                    .Select(i => new
                    {
                        invoiceNumber = i.invoice_number,
                        buyerIdd = i.supplied_id
                    })
                    .OrderBy(i => i.invoiceNumber)
                    .ToListAsync();

                return Ok(new { success = true, data = invoices });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetInvoiceItemDetails")]
        public async Task<IActionResult> GetInvoiceItemDetails(int buyerId)
        {
            try
            {
                var header = await _context.SDM_Inv_VendTbls
                    .Where(i => i.supplied_id == buyerId)
                    .Select(i => new
                    {
                        invoiceNumber = i.invoice_number,
                        invoiceDate = i.invoice_issue_date,
                        paymentDueDate = i.due_date,
                        poNumber = i.invoice_po_no,
                        poDate = i.invoice_po_date,
                        vehicleNo = i.vehicle_no,
                        transporterName = i.transporters_name
                    })
                    .FirstOrDefaultAsync();

                var rawInvoices = await _context.SDM_InvItemTbls
                    .Where(i => i.supplied_id_id == buyerId)
                    .Select(i => new
                    {
                        itemName = i.ProductDiscription ?? "",
                        itemCode = i.ItemCode ?? "",
                        itemGrade = i.Grade ?? "",
                        receivedQty = i.ReceivedQty ?? 0,
                        approvedQty = i.Quantity ?? 0,
                        rejectedQty = i.RejectedQty ?? 0,
                        ratePerUnit = i.RatePerUnit ?? 0,
                        taxRate = i.Tax_Rate ?? "",
                        taxAmount = i.total_amount ?? 0,
                        totalItemValue = i.Total_Item_Value ?? 0
                    })
                    .ToListAsync();

                var items = rawInvoices.Select(i =>
                {
                    decimal cgst = 0, sgst = 0, igst = 0;

                    if (!string.IsNullOrEmpty(i.taxRate))
                    {
                        foreach (var tax in i.taxRate.Split(';'))
                        {
                            if (tax.Contains("CGST"))
                                decimal.TryParse(tax.Replace("CGST", "").Replace("%", ""), out cgst);
                            else if (tax.Contains("SGST"))
                                decimal.TryParse(tax.Replace("SGST", "").Replace("%", ""), out sgst);
                            else if (tax.Contains("IGST"))
                                decimal.TryParse(tax.Replace("IGST", "").Replace("%", ""), out igst);
                        }
                    }

                    return new
                    {
                        i.itemName,
                        i.itemCode,
                        i.itemGrade,
                        i.receivedQty,
                        i.rejectedQty,
                        i.approvedQty,
                        i.ratePerUnit,
                        cgst,
                        sgst,
                        igst,
                        i.taxAmount,
                        i.totalItemValue
                    };
                });

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
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost("AccountSale")]
        public async Task<IActionResult> AddAccountSale([FromBody] AccountSale model)
        {
            if (model == null)
                return BadRequest(new { success = false, message = "Invalid data" });

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Step 1: Create main voucher
                var sale = new AccountSale
                {
                    BuyerId = model.BuyerId,
                    InvoiceNo = model.InvoiceNo,
                    InvoiceDate = model.InvoiceDate,
                    PONumber = model.PONumber,                   // DateOnly from JSON
                    PODate = model.PODate,
                    VehicleNo = model.VehicleNo,
                    PaymentDueDate = model.PaymentDueDate,             // DateOnly from JSON
                    TranspoterName = model.TranspoterName,
                    CreatedBy = model.CreatedBy,
                    UpdatedBy = model.UpdatedBy,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    IsActive = true
                };

                _context.AccountSale.Add(sale);
                await _context.SaveChangesAsync();

                int SaleId = sale.AccountSaleId; // Get inserted ID

                // Step 2: Insert ledger entries
                if (model.Items != null && model.Items.Count > 0)
                {
                    foreach (var item in model.Items)
                    {
                        var GetItemId = await _context.MASTER_ItemTbl
                            .Where(i => i.Item_Code == item.ItemCode)
                            .Select(item => item.Id)
                            .FirstOrDefaultAsync();

                        if (GetItemId == 0)
                        {
                            throw new Exception($"Item not found: {item.ItemCode}");
                        }

                        var detail = new AccountSaleDetails
                        {
                            AccountSaleId = SaleId,
                            ItemId = GetItemId,
                            ItemCode = item.ItemCode,
                            Grade = item.Grade,
                            ApprovedQty = item.ApprovedQty,
                            DamagedQty = item.DamagedQty,
                            PricePerUnit = item.PricePerUnit,
                            CGST = item.CGST,
                            SGST = item.SGST,
                            IGST = item.IGST,
                            TotalTax = item.TotalTax,
                            TotalAmount = item.TotalAmount,
                            GrandAmount = item.TotalTax + item.TotalAmount,
                            CheckSale = item.CheckSale,
                            ApprovedSale = item.ApprovedSale
                        };

                        _context.AccountSaleDetail.Add(detail);
                    }

                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();

                return Ok(new
                {
                    success = true,
                    message = "Account Sale saved successfully",
                    SaleId = SaleId
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.InnerException?.Message,   // REAL ERROR
                    stack = ex.ToString()
                });
            }
        }

        //------------------------------------Approved Sale--------------------------------------------------------

        [HttpGet("CheckedSaleDetails")]
        public async Task<IActionResult> GetCheckInvoiceDetails(int buyerId)
        {
            try
            {
                var checkSale = await _context.AccountSale
                    .Where(s => s.BuyerId == buyerId)
                    .Select(s => new
                    {
                        accountSaleId = s.AccountSaleId,
                        invoiceNo = s.InvoiceNo,
                        invoiceDate = s.InvoiceDate,
                        poNumber = s.PONumber,
                        poDate = s.PODate,
                        paymentDueDate = s.PaymentDueDate,
                        vehicleNo = s.VehicleNo,
                        transporterName = s.TranspoterName
                    }).FirstOrDefaultAsync();

                if (checkSale == null)
                    return Ok(new { success = true });

                var checkSaleItems = await _context.AccountSaleDetail
                    .Where(i => i.AccountSaleId == checkSale.accountSaleId)
                    .Select(i => new
                    {
                        itemId = i.ItemId,
                        itemName = _context.MASTER_ItemTbl
                              .Where(m => m.Id == i.ItemId)
                              .Select(m => m.Item_Name)
                              .FirstOrDefault(),

                        itemCode = i.ItemCode,
                        itemGrade = i.Grade,
                        approvedQty = i.ApprovedQty,
                        rejectedQty = i.DamagedQty,
                        ratePerUnit = i.PricePerUnit,
                        cgst = i.CGST,
                        sgst = i.SGST,
                        igst = i.IGST,
                        totalTax = i.TotalTax,
                        totalAmount = i.TotalAmount,
                        grandAmount = i.GrandAmount,
                    }).ToListAsync();

                var items = checkSaleItems.Select(i =>
                {
                    return new
                    {
                        i.itemName,
                        i.itemCode,
                        i.itemGrade,
                        i.rejectedQty,
                        i.approvedQty,
                        i.ratePerUnit,
                        i.cgst,
                        i.sgst,
                        i.igst,
                        i.totalTax,
                        i.totalAmount,
                        i.grandAmount
                    };
                });

                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        checkSale,
                        items
                    }
                });
            }

            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPost("ApprovedAccountSale")]
        public async Task<IActionResult> ApprovedSale([FromQuery] int accountSaleId, [FromBody] AccountSaleDetails request)
        {
            Console.WriteLine($"Received accountSaleId={accountSaleId}");
            Console.WriteLine($"ItemIds: {string.Join(",", request.ItemIds)}");

            if (request?.ItemIds == null || !request.ItemIds.Any())
                return BadRequest("No item IDs provided");

            var itemIds = request.ItemIds.Select(id => Convert.ToInt32(id)).ToList();

            var items = await _context.AccountSaleDetail
                .Where(x => x.AccountSaleId == accountSaleId && itemIds.Contains(x.AccountSaleDetailedId))
                .ToListAsync();

            Console.WriteLine($"Found {items.Count} matching items");

            foreach (var item in items)
            {
                Console.WriteLine($"Updating Item {item.AccountSaleDetailedId} ApprovedSale: {item.ApprovedSale} -> true");
                item.ApprovedSale = true;
            }

            await _context.SaveChangesAsync();
            Console.WriteLine("SaveChanges completed");

            return Ok(new { success = true });
        }




    }
}
