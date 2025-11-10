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
                return BadRequest("Invalid data.");

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

            existing.VoucherType = accountVoucherType.VoucherType;
            existing.VoucherNarration = accountVoucherType.VoucherNarration;
            existing.IsActive = accountVoucherType.IsActive;

            _context.SaveChanges();
            return Ok(existing);
        }

    }
}
