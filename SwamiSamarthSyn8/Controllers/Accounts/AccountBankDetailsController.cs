using Microsoft.AspNetCore.Mvc;
using SwamiSamarthSyn8.Models;
using SwamiSamarthSyn8.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

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
        
        // -----------------------------------------------------
        // ✅ GET ALL VENDORS
        // -----------------------------------------------------
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
                        v.Company_Name,
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
                        v.Sub_Category
                    })
                    .ToListAsync();

                if (!vendors.Any())
                    return NotFound(new { success = false, message = "No vendors found" });

                return Ok(new { success = true, data = vendors });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
        // -----------------------------------------------------
        // ✅ GET ALL BANK DETAILS (ASYNC, TOP 200000)
        // -----------------------------------------------------
        [HttpGet("AccountBankDetail")]
        public async Task<IActionResult> GetAllBankDetails()
        {
            try
            {
                var bankDetails = await (from bank in _context.AccountBankDetails
                                         join vendor in _context.Potential_Vendor
                                         on bank.VendorId equals vendor.Id
                                         orderby bank.AccountBankDetailId
                                         select new
                                         {
                                             bank.AccountBankDetailId,
                                             bank.VendorId,
                                             VendorName = vendor.Company_Name, // get company name
                                             bank.BankName,
                                             bank.AccountNo,
                                             bank.BranchName,
                                             bank.IFSCCode,
                                             bank.IsActive
                                         })
                     .ToListAsync();

                if (!bankDetails.Any())
                    return NotFound(new { success = false, message = "No bank details found" });

                return Ok(new { success = true, data = bankDetails });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // -----------------------------------------------------
        // ✅ GET ALL BANK DETAILS (with optional filtering)
        // -----------------------------------------------------
        [HttpGet("BankDetails")]
        public IActionResult GetBankDetails([FromQuery] int? vendorId, [FromQuery] bool? isActive)
        {
            var query = _context.AccountBankDetails.AsQueryable();

            if (isActive.HasValue)
                query = query.Where(x => x.IsActive == isActive.Value);

            if (vendorId.HasValue)
                query = query.Where(x => x.VendorId == vendorId.Value);

            var result = query.Select(x => new
            {
                x.AccountBankDetailId,
                x.VendorId,
                x.BranchName,
                x.BankName,
                x.AccountNo,
                x.IFSCCode,
                x.IsActive
            }).ToList();

            return Ok(new { success = true, data = result });
        }


        // -----------------------------------------------------
        // ✅ ADD MULTIPLE BANK DETAILS
        // -----------------------------------------------------
        [HttpPost("AccountBankDetailsSave")]
        public async Task<IActionResult> PostAccountBankDetails([FromBody] List<AccountBankDetails> bankList)
        {
            if (bankList == null || !bankList.Any())
                return BadRequest(new { success = false, message = "No data received" });

            try
            {
                foreach (var bank in bankList)
                {
                    if (string.IsNullOrEmpty(bank.BankName) || bank.VendorId <= 0)
                        return BadRequest(new { success = false, message = "Missing required fields" });

                    var vendor = await _context.Potential_Vendor.FindAsync(bank.VendorId);
                    if (vendor == null)
                        return BadRequest(new { success = false, message = $"Vendor ID {bank.VendorId} not found" });

                    bank.IsActive = true;
                    bank.Vendor = vendor;

                    _context.AccountBankDetails.Add(bank);
                }

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Bank details added successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        // -----------------------------------------------------
        // ✅ UPDATE BANK DETAILS
        [HttpPut("AccountBankDetails/{id}")]
        public async Task<IActionResult> UpdateAccountBankDetails(int id, [FromBody] JsonElement body)
        {
            var existing = await _context.AccountBankDetails.FindAsync(id);
            if (existing == null)
                return NotFound(new { success = false, message = "Record not found" });

            // ✅ Case 1: Only IsActive toggle (Activate / Deactivate)
            if (body.TryGetProperty("isActive", out var isActiveProp) && body.EnumerateObject().Count() == 1)
            {
                existing.IsActive = isActiveProp.GetBoolean();
                _context.Entry(existing).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Status updated", data = existing });
            }

            // ✅ Case 2: Full update (edit form)
            var updatedBank = JsonSerializer.Deserialize<AccountBankDetails>(
                body.GetRawText(),
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            );

            if (updatedBank == null)
                return BadRequest(new { success = false, message = "Invalid data" });

            existing.BankName = updatedBank.BankName;
            existing.AccountNo = updatedBank.AccountNo;
            existing.BranchName = updatedBank.BranchName;
            existing.IFSCCode = updatedBank.IFSCCode;
            existing.IsActive = updatedBank.IsActive;

            _context.Entry(existing).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "Updated successfully", data = existing });
        }

    }
}
