using Microsoft.AspNetCore.Mvc;
using SwamiSamarthSyn8.Models;
using SwamiSamarthSyn8.Data;

namespace SwamiSamarthSyn8.Accounts.Controller
{
    [Route("api/")]
    [ApiController]
    public class AccountVoucherTypeController : ControllerBase
    {
        private readonly SwamiSamarthDbContext _context;
        public AccountVoucherTypeController(SwamiSamarthDbContext context)
        {
            _context = context;
        }

        // ---------- AccountVoucherType APIs ----------

        // ✅ GET all voucher type
        [HttpGet("AccountVoucherType")]
        public IActionResult GetAllAccountVoucherTypes([FromQuery] bool? isActive)
        {
            var query = _context.AccountVoucherType.AsQueryable();

            if (isActive.HasValue)
            {
                query = query.Where(x => x.IsActive == isActive.Value);
            }

            var data = query
                .Select(x => new
                {
                    x.AccountVoucherTypeId,
                    x.VoucherType,
                    x.VoucherNarration,
                    x.IsActive
                })
                .ToList();

            return Ok(data);
        }

        // ✅ POST create ledger
        [HttpPost("AccountVoucherType")]
        public IActionResult CreateAccountVoucherType([FromBody] AccountVoucherType model)
        {
            if (model == null)
                return BadRequest(new { message = "Invalid data." });

            if (string.IsNullOrWhiteSpace(model.VoucherType))
                return BadRequest(new { message = "Voucher Type is required" });

            bool exists = _context.AccountVoucherType
                        .Any(x => x.VoucherType.ToLower() == model.VoucherType.ToLower()
                         && x.IsActive);

            if (exists)
                return Conflict(new { message = "Voucher Type already exists." });

            var vouchertype = new AccountVoucherType
            {
                VoucherType = model.VoucherType,
                VoucherNarration = model.VoucherNarration,
                IsActive = true
            };

            _context.AccountVoucherType.Add(vouchertype);
            _context.SaveChanges();

            return Ok(new { success = true, message = "Voucher Type added successfully!" });
        }

        [HttpPut("AccountVoucherType/{id}")]
        public IActionResult UpdateAccountVoucherType(int id, [FromBody] AccountVoucherType accountVoucherType)
        {
            var existing = _context.AccountVoucherType.Find(id);
            if (existing == null) return NotFound();

            bool exists = _context.AccountVoucherType
            .Any(x => x.AccountVoucherTypeId != id
               && x.VoucherType.ToLower() == accountVoucherType.VoucherType.ToLower()
               && x.IsActive);

            if (exists)
                return Conflict(new { message = "Voucher Type already exists." });

            existing.VoucherType = accountVoucherType.VoucherType;
            existing.VoucherNarration = accountVoucherType.VoucherNarration;
            existing.IsActive = accountVoucherType.IsActive;

            _context.SaveChanges();
            return Ok(existing);
        }

        [HttpDelete("AccountVoucherType/{id}")]
        public IActionResult DeleteAccountVoucherType(int id)
        {
            var ledger = _context.AccountVoucherType.Find(id);
            if (ledger == null) return NotFound();

            ledger.IsActive = false;
            _context.SaveChanges();

            return Ok(new { success = true, message = "Voucher Type deactivated successfully" });
        }

        [HttpPatch("AccountVoucherType/{id}/activate")]
        public IActionResult ActivateAccountVoucherType(int id)
        {
            var ledger = _context.AccountVoucherType.Find(id);
            if (ledger == null) return NotFound();

            ledger.IsActive = true;
            _context.SaveChanges();

            return Ok(new { success = true, message = "Voucher Type activated successfully" });
        }

    }
}
