using Microsoft.AspNetCore.Mvc;
using SwamiSamarthSyn8.Models;
using SwamiSamarthSyn8.Data;

namespace SwamiSamarthSyn8.Accounts.Controller
{
    [Route("api/")]
    [ApiController]
    public class AccountBankDetailsController : ControllerBase
    {
        private readonly SwamiSamarthDbContext _context;
        public AccountBankDetailsController(SwamiSamarthDbContext context)
        {
            _context = context;
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
                    x.Vendor_Code,
                    x.BranchName,
                    x.BankName,
                    x.AccountNo,
                    x.IFSCCode,
                    x.IsActive
                })
                .ToList();

            return Ok(data);
        }

        // ✅ POST create bank details
        [HttpPost("AccountBankDetails")]
        public IActionResult CreateAccountBankDetails([FromBody] AccountBankDetails model)
        {
            if (model == null)
                return BadRequest("Invalid data.");

            var bankdetail = new AccountBankDetails
            {
                BankName = model.BankName,
                AccountNo = model.AccountNo,
                BranchName = model.BranchName,
                IFSCCode = model.IFSCCode,
                Vendor_Code=model.Vendor_Code,
                IsActive = true
            };

            _context.AccountBankDetails.Add(bankdetail);
            _context.SaveChanges();

            return Ok(new { success = true, message = "Bank Details added successfully!" });
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
