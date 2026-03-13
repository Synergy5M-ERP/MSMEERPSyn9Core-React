using Azure.Core;
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
        //[HttpGet("GetGRNNumbersBySeller")]
        //public async Task<IActionResult> GetGRNNumbersBySeller([FromQuery] string sellerName)
        //{
        //    if (string.IsNullOrEmpty(sellerName))
        //        return BadRequest(new { success = false, message = "Seller name is required" });

        //    var grnNumbers = await _swamiContext.MMM_GRNTbl
        //        .Where(g => g.Supplier_Name == sellerName)
        //        .Select(g => new
        //        {
        //            g.Id,
        //            grnNumber = g.GRN_NO
        //        })
        //        .OrderBy(g => g.grnNumber)
        //        .ToListAsync();

        //    return Ok(new { success = true, data = grnNumbers });
        //}
        [HttpGet("GetInvoicesBySeller")]
        public async Task<IActionResult> GetInvoicesBySeller([FromQuery] string sellerName)
        {
            if (string.IsNullOrEmpty(sellerName))
                return BadRequest(new { success = false, message = "Seller name is required" });

            var invoices = await _swamiContext.MMM_GRNTbl
                .Where(g => g.Supplier_Name == sellerName)
                .Select(g => new
                {
                    g.Id,
                    invoiceNumber = g.Invoice_NO
                })
                .OrderBy(g => g.invoiceNumber)
                .ToListAsync();

            return Ok(new { success = true, data = invoices });
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
        [HttpGet("Vendorcategories")]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var categories = await _swamiContext.Master_VendorCategory
                    .Where(x => x.IsActive == true)
                    .Select(x => new
                    {
                        id = x.VendorCategoryId,
                        name = x.VendorCategory
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = categories
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching vendor categories");

                return StatusCode(500, new
                {
                    success = false,
                    message = "Error fetching categories"
                });
            }
        }
        [HttpGet("salesbuyers")]
        public async Task<IActionResult> GetSalesBuyers()
        {
            try
            {
                var buyers = await _swamiContext.MASTER_SalesBuyerTbl
                    .Select(x => new
                    {
                        id = x.Id,
                        company_Name = x.Company_Name,
                        vendorCode = x.Vendor_Code,
                        address = x.Address,
                        city = x.City,
                        contact_Person = x.Contact_Person,
                        contact_Number = x.Contact_Number,
                        gst_Number = x.GST_Number,
                        email=x.Email,
                        
                        
                    })
                    .ToListAsync();

                return Ok(new
                {
                    success = true,
                    data = buyers
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching buyers");

                return StatusCode(500, new
                {
                    success = false,
                    message = "Error fetching buyers"
                });
            }
        }

        //[HttpPost("SaveNonGRN")]
        //public async Task<IActionResult> SaveNonGRN([FromBody] NonGRNSaveRequest model)
        //{
        //    try
        //    {
        //        if (model == null)
        //            return BadRequest("Invalid data");


        //        long vendorId = model.Vendor.AccountVendorId;
        //        long employeeId = model.Invoice.EmployeeId ?? 0;

        //        string tempVendorCode = "";

        //        /*------------------------------------
        //          STEP 1 : Create Vendor if not exists
        //        ------------------------------------*/

        //        if (vendorId == 0 && employeeId == 0)
        //        {

        //            string today = DateTime.Now.ToString("ddMMyyyy");
        //            string prefix = "T/" + today + "/";

        //            var lastCode = _msmeContext.AccountVendor
        //                .Where(x => x.VendorCode.StartsWith(prefix))
        //                .OrderByDescending(x => x.VendorCode)
        //                .Select(x => x.VendorCode)
        //                .FirstOrDefault();

        //            int nextNumber = 1;

        //            if (!string.IsNullOrEmpty(lastCode))
        //            {
        //                string lastDigits = lastCode.Split('/').Last();
        //                nextNumber = Convert.ToInt32(lastDigits) + 1;
        //            }

        //            tempVendorCode = prefix + nextNumber.ToString("D4");

        //            var newVendor = new AccountVendor
        //            {
        //                VendorName = model.Vendor.VendorName,
        //                VendorCode = tempVendorCode,
        //                Address = model.Vendor.Address,
        //                City = model.Vendor.City,
        //                GSTNo = model.Vendor.GSTNo,
        //                EmailID = model.Vendor.EmailID,
        //                ContactPerson = model.Vendor.ContactPerson,
        //                ContactNo = model.Vendor.ContactNo,
        //                BanckName = model.Vendor.BanckName,
        //                BranchName = model.Vendor.BranchName,
        //                AccountNo = model.Vendor.AccountNo,
        //                IFSCCode = model.Vendor.IFSCCode,
        //                CreatedBy = 1,
        //                CreatedDate = DateTime.Now,
        //                IsActive = true,



        //            };

        //            _msmeContext.AccountVendor.Add(newVendor);
        //            await _msmeContext.SaveChangesAsync();

        //            vendorId = newVendor.AccountVendorId;
        //        }

        //        STEP 2: Insert Invoice
        //        var invoice = new AccountNonGRNInvoice
        //        {
        //            InvoiceNo = model.Invoice.InvoiceNo,
        //            InvoiceDate = model.Invoice.InvoiceDate,
        //            NonGrnInvoice = model.Invoice.NonGrnInvoice,
        //            PayDueDate = model.Invoice.PayDueDate,
        //            VendorId = (int)vendorId,
        //             ✅ SAVE EMPLOYEE ID
        //            EmployeeId = model.Invoice.EmployeeId == 0
        //            ? null
        //            : model.Invoice.EmployeeId,
        //            VendorCode = string.IsNullOrEmpty(model.Vendor.VendorCode)
        //                            ? tempVendorCode
        //                            : model.Vendor.VendorCode,

        //            TotalAmount = model.Details.Sum(i => i.TotalValue),
        //            TotalTaxAmount = model.Details.Sum(i => i.TaxAmount),
        //            SGSTAmount = model.Details.Sum(i => i.SGST),
        //            CGSTAmount = model.Details.Sum(i => i.CGST),
        //            IGSTAmount = model.Details.Sum(i => i.IGST),
        //            CreatedBy = 1,
        //            CreatedDate = DateTime.Now,
        //            IsActive = true
        //        };

        //        _msmeContext.AccountNonGRNInvoice.Add(invoice);
        //        await _msmeContext.SaveChangesAsync();

        //        long invoiceId = invoice.NonGrnInvoiceId;

        //        STEP 3: Insert Item Details
        //        foreach (var item in model.Details)
        //        {
        //            var detail = new AccountNonGRNInvoiceDetails
        //            {
        //                NonGrnId = invoiceId,
        //                Description = item.Itemname,
        //                Itemname = item.Itemname,
        //                Qty = item.Qty,
        //                BasicAmount = item.BasicAmount,
        //                TaxType = item.TaxType,
        //                TaxAmount = item.TaxAmount,
        //                TotalValue = item.TotalValue,
        //                LedgerId = item.LedgerId,
        //                IGST = item.IGST,
        //                CGST = item.CGST,
        //                SGST = item.SGST,
        //                TaxRate = item.TaxRate
        //            };

        //            _msmeContext.AccountNonGRNInvoiceDetails.Add(detail);
        //        }

        //        await _msmeContext.SaveChangesAsync();

        //        return Ok(new { success = true, invoiceId = invoiceId });
        //    }
        //    catch (Exception ex)
        //    {
        //        return full error message
        //        return StatusCode(500, new
        //        {
        //            success = false,
        //            message = "Error while saving Non-GRN Invoice",
        //            error = ex.Message,
        //            innerError = ex.InnerException?.Message
        //        });
        //    }
        //}
        [HttpPost("SaveNonGRN")]
        public async Task<IActionResult> SaveNonGRN([FromBody] NonGRNSaveRequest model)
        {
            try
            {
                if (model == null) return BadRequest("Invalid data");

                int vendorId = model.Vendor.AccountVendorId;
                long employeeId = model.Invoice.EmployeeId ?? 0;
                string tempVendorCode = "";

                // Step 1: Create Vendor if not exists
                if (vendorId == 0 && employeeId == 0)
                {
                    string today = DateTime.Now.ToString("ddMMyyyy");
                    string prefix = "T/" + today + "/";
                    var lastCode = _msmeContext.AccountVendor
                                     .Where(x => x.VendorCode.StartsWith(prefix))
                                     .OrderByDescending(x => x.VendorCode)
                                     .Select(x => x.VendorCode)
                                     .FirstOrDefault();

                    int nextNumber = 1;
                    if (!string.IsNullOrEmpty(lastCode))
                        nextNumber = Convert.ToInt32(lastCode.Split('/').Last()) + 1;

                    tempVendorCode = prefix + nextNumber.ToString("D4");

                    var newVendor = new AccountVendor
                    {
                        VendorName = model.Vendor.VendorName,
                        VendorCode = tempVendorCode,
                        Address = model.Vendor.Address,
                        City = model.Vendor.City,
                        GSTNo = model.Vendor.GSTNo,
                        EmailID = model.Vendor.EmailID,
                        ContactPerson = model.Vendor.ContactPerson,
                        ContactNo = model.Vendor.ContactNo,
                        BanckName = model.Vendor.BanckName,
                        BranchName = model.Vendor.BranchName,
                        AccountNo = model.Vendor.AccountNo,
                        IFSCCode = model.Vendor.IFSCCode,
                        CreatedBy = 1,
                        CreatedDate = DateTime.Now,
                        IsActive = true,
                    };

                    _msmeContext.AccountVendor.Add(newVendor);
                    await _msmeContext.SaveChangesAsync();
                    vendorId = newVendor.AccountVendorId;
                }

                // Step 2: Insert Invoice
                var invoice = new AccountNonGRNInvoice
                {
                    InvoiceNo = model.Invoice.InvoiceNo,
                    InvoiceDate = model.Invoice.InvoiceDate,
                    NonGrnInvoice = model.Invoice.NonGrnInvoice,
                    PayDueDate = model.Invoice.PayDueDate,
                    VendorId = vendorId,
                    EmployeeId = model.Invoice.EmployeeId == 0 ? null : model.Invoice.EmployeeId,
                    VendorCode = string.IsNullOrEmpty(model.Vendor.VendorCode) ? tempVendorCode : model.Vendor.VendorCode,
                    TotalAmount = model.Details.Sum(i => i.TotalValue),
                    TotalTaxAmount = model.Details.Sum(i => i.TaxAmount),
                    SGSTAmount = model.Details.Sum(i => i.SGST),
                    CGSTAmount = model.Details.Sum(i => i.CGST),
                    IGSTAmount = model.Details.Sum(i => i.IGST),
                    CreatedBy = 1,
                    CreatedDate = DateTime.Now,
                    IsActive = true
                };

                _msmeContext.AccountNonGRNInvoice.Add(invoice);
                await _msmeContext.SaveChangesAsync();

                long invoiceId = invoice.NonGrnInvoiceId;

                // Step 3: Insert Item Details
                foreach (var item in model.Details)
                {
                    var detail = new AccountNonGRNInvoiceDetails
                    {
                        NonGrnId = invoiceId,
                        Description = item.Itemname,
                        Qty = item.Qty,
                        BasicAmount = item.BasicAmount,
                        TaxType = item.TaxType,
                        TaxAmount = item.TaxAmount,
                        TotalValue = item.TotalValue,
                        LedgerId = item.LedgerId,
                        IGST = item.IGST,
                        CGST = item.CGST,
                        SGST = item.SGST,
                        TaxRate = item.TaxRate
                    };
                    _msmeContext.AccountNonGRNInvoiceDetails.Add(detail);
                }

                await _msmeContext.SaveChangesAsync();
                return Ok(new { success = true, invoiceId = invoiceId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error while saving Non-GRN Invoice",
                    error = ex.Message,
                    innerError = ex.InnerException?.Message
                });
            }
        }
        [HttpGet("GetApproveSellerNonGrnSo")]
        public IActionResult GetApproveSellerNonGrnSo(string type)
        {
            try
            {
                // Get all VendorIds used in invoices
                var vendorIds = _msmeContext.AccountNonGRNInvoice
                    .Where(x => x.VendorId != null && x.VendorId != 0)
                    .Select(x => x.VendorId)
                    .Distinct()
                    .ToList();

                if (type == "NonGRN")
                {
                    // 1️⃣ Regular Vendors
                    var regularVendors = _swamiContext.Potential_Vendor
                        .Where(x => vendorIds.Contains(x.Id))
                        .Select(x => new
                        {
                            VendorId = x.Id,
                            VendorName = x.Company_Name ?? ""
                        })
                        .ToList();

                    // 2️⃣ Temporary Vendors
                    var tempVendors = _msmeContext.AccountVendor
                        .Where(x => vendorIds.Contains(x.AccountVendorId))
                        .Select(x => new
                        {
                            VendorId = x.AccountVendorId,
                            VendorName = x.VendorName ?? ""
                        })
                        .ToList();

                    // Merge both lists
                    var vendors = regularVendors
                        .Concat(tempVendors)
                        .GroupBy(x => x.VendorId)
                        .Select(g => g.First())
                        .ToList();

                    return Ok(new { data = vendors });
                }

                else if (type == "NonSO")
                {
                    // Buyers
                    var buyers = _swamiContext.MASTER_SalesBuyerTbl
                        .Where(x => vendorIds.Contains(x.Id))
                        .Select(x => new
                        {
                            VendorId = x.Id,
                            VendorName = x.Company_Name ?? ""
                        })
                        .ToList();

                    return Ok(new { data = buyers });
                }

                return BadRequest(new { success = false, message = "Invalid Type" });
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
        [HttpGet("GetGrnInvoiceDetails")]
        public IActionResult GetGrnInvoiceDetails(int seller, string checkval)
        {
            try
            {
                var grnDetails = (
                    from inv in _msmeContext.AccountNonGRNInvoice
                    join item in _msmeContext.AccountNonGRNInvoiceDetails
                        on inv.NonGrnInvoiceId equals item.NonGrnId
                    join led in _msmeContext.AccountLedger
                        on item.LedgerId equals led.AccountLedgerId into ledgerJoin
                    from led in ledgerJoin.DefaultIfEmpty()

                    where inv.VendorId == seller && inv.NonGrnInvoice == checkval

                    select new
                    {
                        grN_NO = inv.InvoiceNo,
                        invoiceDate = inv.InvoiceDate,

                        description = item.Description,
                        qty = item.Qty,

                        basicAmount = item.BasicAmount,

                        totalValue = item.TotalValue,

                        ledgerId = item.LedgerId,
                        ledgerName = led.AccountLedgerName,

                        taxRate = item.TaxRate,

                        // ✅ ADD THESE
                        totalTaxValue = item.TaxAmount,
                        netAmount = item.TotalValue,

                        cgst = item.CGST,
                        sgst = item.SGST,
                        igst = item.IGST,

                        nonGrnInvoiceId = inv.NonGrnInvoiceId,
                        approveNonGRNInvoice = inv.ApproveNonGRNInvoice
                    }
                ).ToList();

                if (grnDetails.Count == 0)
                {
                    return Ok(new
                    {
                        success = false,
                        message = "No GRN Found"
                    });
                }

                return Ok(new
                {
                    success = true,
                    grnDetails = grnDetails
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error fetching GRN details",
                    error = ex.Message
                });
            }
        }
        [HttpPost("ApproveGrnInvoice")]
        public IActionResult ApproveGrnInvoice([FromBody] List<ApproveNonGrnVM> model)
        {
            try
            {
                foreach (var item in model)
                {
                    var invoice = _msmeContext.AccountNonGRNInvoice
                        .FirstOrDefault(x => x.NonGrnInvoiceId == item.NonGrnInvoiceId);

                    if (invoice != null)
                    {
                        invoice.ApproveNonGRNInvoice = item.ApproveNonGRNInvoice;
                        invoice.CheckNonGRNInvoice = "Approved";
                    }
                }

                _msmeContext.SaveChanges();

                return Ok(new
                {
                    success = true,
                    message = "GRN approved successfully"
                });
            }
            catch (Exception ex)
            {
                return Ok(new
                {
                    success = false,
                    message = "Error while updating GRN",
                    error = ex.Message
                });
            }
        }
        public class ApproveNonGrnVM
        {
            public int NonGrnInvoiceId { get; set; }
            public bool ApproveNonGRNInvoice { get; set; }
        }
        [HttpGet("GetNonGrnBank")]
        public IActionResult GetNonGrnBank([FromQuery] string supplier)
        {
            if (string.IsNullOrEmpty(supplier))
            {
                return BadRequest(new { message = "Supplier name is required" });
            }

            var bankList = new List<object>();

            // Check Potential Vendor
            var potentialVendor = _swamiContext.Potential_Vendor
                                  .FirstOrDefault(v => v.Company_Name == supplier);

            if (potentialVendor != null)
            {
                // Main bank
                if (!string.IsNullOrEmpty(potentialVendor.Bank_Name))
                {
                    bankList.Add(new
                    {
                        BankName = potentialVendor.Bank_Name,
                        Id = potentialVendor.Id
                    });
                }

                // Other banks
                var otherBanks = _msmeContext.AccountBankDetails
                                  .Where(b => b.VendorId == potentialVendor.Id)
                                  .Select(b => new
                                  {
                                      BankName = b.BankName,
                                      Id = b.AccountBankDetailId
                                  })
                                  .ToList();

                bankList.AddRange(otherBanks);
            }
            else
            {
                // Check Account Vendor
                var accountVendor = _msmeContext.AccountVendor
                                    .FirstOrDefault(v => v.VendorName == supplier);

                if (accountVendor != null)
                {
                    if (!string.IsNullOrEmpty(accountVendor.BanckName))
                    {
                        bankList.Add(new
                        {
                            BankName = accountVendor.BanckName,
                            Id = accountVendor.AccountVendorId
                        });
                    }

                    var otherBanks = _msmeContext.AccountBankDetails
                                      .Where(b => b.VendorId == accountVendor.AccountVendorId)
                                      .Select(b => new
                                      {
                                          BankName = b.BankName,
                                          Id = b.AccountBankDetailId
                                      })
                                      .ToList();

                    bankList.AddRange(otherBanks);
                }
            }

            return Ok(new { data = bankList });
        }
        [HttpGet("GetLedger")]
        public IActionResult GetLedger()
        {
            var ledger = _msmeContext.AccountLedger
                .Select(l => new
                {
                    l.AccountLedgerId,
                    l.AccountLedgerName
                })
                .ToList();

            return Ok(new { success = true, data = ledger });
        }
        [HttpGet("GetSubLedger")]
        public IActionResult GetSubLedger(int ledgerId)
        {
            var ledger = _msmeContext.AccountSubLedger
                .Where(s => s.AccountLedgerid == ledgerId)
                .Select(l => new
                {
                    l.AccountLedgerSubid,
                    l.AccountLedgerSubName
                })
                .ToList();

            return Ok(new { success = true, data = ledger });
        }
        //[HttpGet("GetLedgerBalance")]
        //public IActionResult GetLedgerBalance(int ledger)
        //{
        //    var balance = _msmeContext.AccountSubLedger
        //        .Where(l => l.AccountLedgerSubid == ledger)
        //        .Select(l => l.ClosingBal)
        //        .FirstOrDefault();

        //    return Ok(new { success = true, balance = balance });
        //}

        [HttpGet("GetPaymentAllocNonGrn")]
        public IActionResult GetPaymentAllocNonGrn()
        {
            try
            {
                var latestPayments = _msmeContext.AccountPaymentAllocation
                    .GroupBy(x => x.GRNNo)
                    .Select(g => g.OrderByDescending(x => x.PaymentAllocateId).FirstOrDefault())
                    .ToList();

                var invoices = (from a in _msmeContext.AccountNonGRNInvoice
                                join d in _msmeContext.AccountNonGRNInvoiceDetails
                                    on a.NonGrnInvoiceId equals d.NonGrnId
                                where a.ApproveNonGRNInvoice == true
                                      && (a.NonGrnInvoice.Contains("NonGRN") || a.NonGrnInvoice.Contains("NonSO"))
                                orderby a.NonGrnInvoiceId ascending

                                select new
                                {
                                    a.NonGrnInvoiceId,
                                    a.InvoiceNo,
                                    a.InvoiceDate,
                                    a.PayDueDate,
                                    a.TotalAmount,
                                    a.VendorCode
                                })
                                .Distinct()
                                .ToList();

                var potentialVendors = _swamiContext.Potential_Vendor
                    .Select(x => new
                    {
                        x.Vendor_Code,
                        x.Company_Name
                    }).ToList();

                var accountVendors = _msmeContext.AccountVendor
                    .Select(x => new
                    {
                        x.VendorCode,
                        x.VendorName
                    }).ToList();

                var result = invoices.Select(a =>
                {
                    var payment = latestPayments.FirstOrDefault(p => p.GRNNo == a.InvoiceNo);

                    var supplierName =
                        potentialVendors
                            .Where(x => x.Vendor_Code == a.VendorCode)
                            .Select(x => x.Company_Name)
                            .FirstOrDefault()
                        ??
                        accountVendors
                            .Where(x => x.VendorCode == a.VendorCode)
                            .Select(x => x.VendorName)
                            .FirstOrDefault();

                    return new
                    {
                        Supplier_Name = supplierName,
                        Due_Date = a.PayDueDate,
                        Invoice_NO = a.InvoiceNo,
                        Invoice_Date = a.InvoiceDate,
                        Total_Amount = a.TotalAmount,
                        VendorCode = a.VendorCode,

                        BalanceAmount =
                            (payment != null && payment.BalanceAmount != null && payment.BalanceAmount > 0)
                            ? payment.BalanceAmount
                            : a.TotalAmount
                    };

                }).Where(x => x.BalanceAmount != 0).ToList();

                return Ok(new
                {
                    success = true,
                    data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Error loading payment allocation data",
                    error = ex.Message
                });
            }
        }
    }

}
