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
            if (model == null)
                return BadRequest("Invalid data.");

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

            existing.SubVoucherType = accountSubVoucherType.SubVoucherType;
            existing.SubVoucherNarration = accountSubVoucherType.SubVoucherNarration;
            existing.AccountVoucherTypeId = accountSubVoucherType.AccountVoucherTypeId;
            existing.IsActive = accountSubVoucherType.IsActive;

            _context.SaveChanges();
            return Ok(existing);
        }

    }
}
