using Microsoft.AspNetCore.Mvc;
using SwamiSamarthSyn8.Models;
using SwamiSamarthSyn8.Data;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Accounts.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountBankDetailsController : ControllerBase
    {
        private readonly SwamiSamarthDbContext _context;
        public AccountBankDetailsController(SwamiSamarthDbContext context)
        {
            _context = context;
        }
        // -------------------- VENDOR LIST --------------------
        [HttpGet("Vendors")]
        public async Task<IActionResult> GetVendors()
        {
            try
            {
                var vendors = await _context.Potential_Vendor
                    .Select(v => new
                    {
                        v.Id,
                        VendorCode = v.Vendor_Code,
                        CompanyName = v.Company_Name,
                        v.Contact_Person,
                        v.Email,
                        v.Contact_Number,
                        v.Bank_Name,
                        v.CurrentAcNo,
                        v.Branch,
                        v.IFSC_No,
                        v.GST_Number,
                        v.Country,
                        v.State_Province,
                        v.City,
                        v.Address,
                        v.industry,
                        v.Category,
                        v.Sub_Category,

                    })
                    .ToListAsync();

                if (vendors == null || vendors.Count == 0)
                    return NotFound(new { success = false, message = "No vendors found" });

                return Ok(new { success = true, data = vendors });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
        // ---------- AccountBankDetails APIs ----------

        // ✅ GET all bank details
        [HttpGet("AccountBankDetails")]
        public IActionResult GetAllAccountBankDetails([FromQuery] bool? isActive)
        {
            var query = _context.AccountBankDetails.AsQueryable();

            if (isActive.HasValue)
            {
                query = query.Where(x => x.IsActive == isActive.Value);
            }

            var data = query
                .Select(x => new
                {
                    x.AccountBankDetailId,
                    x.VendorId,
                    x.BranchName,
                    x.BankName,
                    x.AccountNo,
                    x.IFSCCode,
                    x.IsActive
                })
                .ToList();

            return Ok(data);
        }

        // ✅ POST: api/AccountBankDetails
        [HttpPost("AccountBankDetails")]
        public async Task<IActionResult> PostAccountBankDetails([FromBody] List<AccountBankDetails> bank)
        {
            if (bank == null)
                return BadRequest(new { success = false, message = "No data received" });

            try
            {
                foreach (var bank_ in bank)
                {
                    if (string.IsNullOrEmpty(bank_.BankName) || bank_.VendorId <= 0)
                        return BadRequest(new { success = false, message = "Missing required fields" });

                    // ✅ verify vendor exists
                    var vendorExists = await _context.Potential_Vendor.AnyAsync(v => v.Id == bank_.VendorId);
                    if (!vendorExists)
                        return BadRequest(new { success = false, message = $"Vendor ID {bank_.VendorId} not found." });
                    var vendorDetail = _context.Potential_Vendor.Where(v => v.Id == bank_.VendorId).FirstOrDefault();
                    bank_.IsActive = true;
                    bank_.Vendor = vendorDetail;
                    _context.AccountBankDetails.Add(bank_);
                    await _context.SaveChangesAsync();
                }
                return Ok(new { success = true, message = "Bank Details added successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.InnerException?.Message ?? ex.Message });
            }
        }


        [HttpPut("AccountBankDetails/{id}")]
        public IActionResult UpdateAccountBankDetails(int id, [FromBody] AccountBankDetails accountBankDetails)
        {
            var existing = _context.AccountBankDetails.Find(id);
            if (existing == null) return NotFound();

            existing.AccountBankDetailId = accountBankDetails.AccountBankDetailId;
            existing.BranchName = accountBankDetails.BranchName;
            existing.BankName = accountBankDetails.BankName;
            existing.AccountNo = accountBankDetails.AccountNo;
            existing.IFSCCode = accountBankDetails.IFSCCode;
            existing.IsActive = accountBankDetails.IsActive;

            _context.SaveChanges();
            return Ok(existing);
        }

    }
}
