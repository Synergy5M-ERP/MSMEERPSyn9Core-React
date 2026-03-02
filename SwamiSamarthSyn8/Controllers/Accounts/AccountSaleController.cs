using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Differencing;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models.Accounts;

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
        [HttpGet("Getbuyers")]
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
                    .GroupBy(i => i.invoice_number)
                    .Select(g => new
                    {
                        invoiceNumber = g.Key,
                        buyerIdd = g.First().supplied_id
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
                // 1️⃣ Invoice Header
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

                // 2️⃣ AccountSaleId
                var accountSaleId = await _context.AccountSale
                    .Where(s => s.BuyerId == buyerId)
                    .Select(s => s.AccountSaleId)
                    .FirstOrDefaultAsync();

                // 3️⃣ Invoice Items + Checked Items (LEFT JOIN)
                var items = await (
                    from item in _context.SDM_InvItemTbls
                    where item.supplied_id_id == buyerId

                    join saleDetail in _context.AccountSaleDetail
                        .Where(x => x.AccountSaleId == accountSaleId)
                        on item.ItemCode equals saleDetail.ItemCode
                        into saleGroup

                    from sale in saleGroup.DefaultIfEmpty()

                    select new
                    {
                        itemName = item.ProductDiscription ?? "",
                        itemCode = item.ItemCode ?? "",
                        itemGrade = sale != null ? sale.Grade : item.Grade ?? "",

                        approvedQty = sale != null ? sale.ApprovedQty : item.Quantity ?? 0m,
                        rejectedQty = sale != null ? sale.DamagedQty : item.RejectedQty ?? 0m,

                        ratePerUnit = sale != null ? sale.PricePerUnit : item.RatePerUnit ?? 0m,

                        cgst = sale != null ? sale.CGST : 0m,
                        sgst = sale != null ? sale.SGST : 0m,
                        igst = sale != null ? sale.IGST : 0m,

                        taxAmount = sale != null ? sale.TotalTax : item.total_amount ?? 0m,
                        totalItemValue = sale != null ? sale.TotalAmount : item.Total_Item_Value ?? 0m,

                        isChecked = sale != null,
                        isApproved = sale != null && sale.ApprovedSale == true
                    }
                ).ToListAsync();

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
                var sale = new AccountSale
                {
                    BuyerId = model.BuyerId,
                    InvoiceNo = model.InvoiceNo ?? "",
                    InvoiceDate = model.InvoiceDate,
                    PONumber = model.PONumber ?? "",
                    PODate = model.PODate,
                    VehicleNo = model.VehicleNo ?? "",
                    PaymentDueDate = model.PaymentDueDate,
                    TranspoterName = model.TranspoterName ?? "",
                    CreatedBy = model.CreatedBy,
                    UpdatedBy = model.UpdatedBy,
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now,
                    IsActive = true
                };

                _context.AccountSale.Add(sale);
                await _context.SaveChangesAsync();
                int SaleId = sale.AccountSaleId;

                if (model.Items != null && model.Items.Count > 0)
                {
                    foreach (var item in model.Items)
                    {
                        // Validate ItemCode exists in DB
                        var GetItemId = await _context.MASTER_ItemTbl
                            .Where(i => i.Item_Code == item.ItemCode)
                            .Select(i => i.Id)
                            .FirstOrDefaultAsync();

                        if (GetItemId == 0)
                        {
                            await transaction.RollbackAsync();
                            return BadRequest(new { success = false, message = $"Item not found: {item.ItemCode}" });
                        }

                        var detail = new AccountSaleDetails
                        {
                            AccountSaleId = SaleId,
                            ItemId = GetItemId,
                            ItemCode = item.ItemCode,
                            Grade = item.Grade ?? "",
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

                return Ok(new { success = true, message = "Account Sale saved successfully", SaleId });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { success = false, message = ex.Message, stack = ex.ToString() });
            }
        }

        [HttpGet("CheckedSaleDetails")]
        public async Task<IActionResult> GetCheckInvoiceDetails(int buyerId)
        {
            try
            {
                // 1️⃣ Get Account Sale Header
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
                    })
                    .FirstOrDefaultAsync();

                if (checkSale == null)
                {
                    return Ok(new
                    {
                        success = true,
                        data = new { }
                    });
                }

                // 2️⃣ Get Item Details (PROPER JOIN)
                var items = await (
                    from d in _context.AccountSaleDetail
                    join m in _context.MASTER_ItemTbl
                        on d.ItemId equals m.Id
                    where d.AccountSaleId == checkSale.accountSaleId
                    select new
                    {
                        accountSaleDetailedId = d.AccountSaleDetailedId,
                        itemId = d.ItemId,
                        itemName = m.Item_Name,          // ✅ FIXED
                        itemCode = d.ItemCode,
                        itemGrade = d.Grade,
                        approvedQty = d.ApprovedQty,
                        rejectedQty = d.DamagedQty,
                        ratePerUnit = d.PricePerUnit,
                        cgst = d.CGST,
                        sgst = d.SGST,
                        igst = d.IGST,
                        totalTax = d.TotalTax,
                        totalAmount = d.TotalAmount,
                        grandAmount = d.GrandAmount,
                        approvedSale = d.ApprovedSale    // useful for UI
                    }
                ).ToListAsync();

                // 3️⃣ Final Response
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
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [HttpPost("ApprovedAccountSale")]
        public async Task<IActionResult> ApprovedSale([FromQuery] int accountSaleId, [FromBody] AccountSaleDetails request)
        {
            if (request?.ItemIds == null || !request.ItemIds.Any())
                return BadRequest("No item IDs provided");

            var itemIds = request.ItemIds.Select(id => Convert.ToInt32(id)).ToList();

            var items = await _context.AccountSaleDetail
                .Where(x => x.AccountSaleId == accountSaleId && itemIds.Contains(x.AccountSaleDetailedId))
                .ToListAsync();

            foreach (var item in items)
            {
                item.ApprovedSale = true;
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }
    }
}

