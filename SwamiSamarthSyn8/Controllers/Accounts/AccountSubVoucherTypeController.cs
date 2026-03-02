using Microsoft.AspNetCore.Mvc;
using SwamiSamarthSyn8.Models;
using SwamiSamarthSyn8.Data;

namespace SwamiSamarthSyn8.Accounts.Controller
{
    [Route("api/")]
    [ApiController]
    public class AccountSubVoucherTypeController : ControllerBase
    {
        private readonly SwamiSamarthDbContext _context;
        public AccountSubVoucherTypeController(SwamiSamarthDbContext context)
        {
            _context = context;
        }

        // ---------- AccountSubVoucherType APIs ----------

        // ✅ GET all sub voucher type
        [HttpGet("AccountSubVoucherType")]
        public IActionResult GetAllAccountSubVoucherTypes([FromQuery] bool? isActive)
        {
            var query = _context.AccountSubVoucherType.AsQueryable();

            if (isActive.HasValue)
            {
                query = query.Where(x => x.IsActive == isActive.Value);
            }

            var data = query
                .Select(x => new
                {
                    x.AccountSubVoucherTypeId,
                    x.AccountVoucherTypeId,
                    x.SubVoucherType,
                    x.SubVoucherNarration,
                    x.IsActive
                })
                .ToList();

            return Ok(data);
        }

        // ✅ POST create sub voucher type
        [HttpPost("AccountSubVoucherType")]
        public IActionResult CreateAccountSubVoucherType([FromBody] AccountSubVoucherType model)
        {
            if (model == null || string.IsNullOrWhiteSpace(model.SubVoucherType))
                return BadRequest("Invalid data.");

            bool exists = _context.AccountSubVoucherType.Any(x =>
                        x.SubVoucherType.ToLower() == model.SubVoucherType.ToLower() &&
                        x.AccountVoucherTypeId == model.AccountVoucherTypeId &&
                        x.IsActive);

            if (exists)
                return Conflict(new { message = "Sub Voucher Type already exists for this Voucher Type." });

            var subvouchertype = new AccountSubVoucherType
            {
                SubVoucherType = model.SubVoucherType,
                SubVoucherNarration = model.SubVoucherNarration,
                AccountVoucherTypeId = model.AccountVoucherTypeId,
                IsActive = true
            };

            _context.AccountSubVoucherType.Add(subvouchertype);
            _context.SaveChanges();

            return Ok(new { success = true, message = "SubVoucher Type added successfully!" });
        }

        [HttpPut("AccountSubVoucherType/{id}")]
        public IActionResult UpdateAccountSubVoucherType(int id, [FromBody] AccountSubVoucherType accountSubVoucherType)
        {
            var existing = _context.AccountSubVoucherType.Find(id);
            if (existing == null) return NotFound();

            bool exists = _context.AccountSubVoucherType.Any(x =>
                            x.AccountSubVoucherTypeId != id &&
                            x.SubVoucherType.ToLower() == accountSubVoucherType.SubVoucherType.ToLower() &&
                            x.AccountVoucherTypeId == accountSubVoucherType.AccountVoucherTypeId &&
                            x.IsActive);

            if (exists)
                return Conflict(new { message = "Sub Voucher Type already exists for this Voucher Type." });

            existing.SubVoucherType = accountSubVoucherType.SubVoucherType;
            existing.SubVoucherNarration = accountSubVoucherType.SubVoucherNarration;
            existing.AccountVoucherTypeId = accountSubVoucherType.AccountVoucherTypeId;
            existing.IsActive = accountSubVoucherType.IsActive;

            _context.SaveChanges();
            return Ok(existing);
        }

        [HttpDelete("AccountSubVoucherType/{id}")]
        public IActionResult DeleteAccountVoucherType(int id)
        {
            var ledger = _context.AccountVoucherType.Find(id);
            if (ledger == null) return NotFound();

            ledger.IsActive = false;
            _context.SaveChanges();

            return Ok(new { success = true, message = "Sub Voucher Type deactivated successfully" });
        }

        [HttpPatch("AccountSubVoucherType/{id}/activate")]
        public IActionResult ActivateAccountVoucherType(int id)
        {
            var ledger = _context.AccountVoucherType.Find(id);
            if (ledger == null) return NotFound();

            ledger.IsActive = true;
            _context.SaveChanges();

            return Ok(new { success = true, message = "Sub Voucher Type activated successfully" });
        }

    }
}
