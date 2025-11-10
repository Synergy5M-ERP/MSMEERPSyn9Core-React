using Microsoft.AspNetCore.Mvc;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models;
using System.Linq;

namespace SwamiSamarthSyn8.Accounts.Controller
{
    [Route("api/")]
    [ApiController]
    public class AccountLedgerController : ControllerBase
    {
        private readonly SwamiSamarthDbContext _context;
        public AccountLedgerController(SwamiSamarthDbContext context)
        {
            _context = context;
        }

        // ---------- AccountLedger APIs ----------

        // ✅ GET all ledgers
        [HttpGet("AccountLedger")]
        public IActionResult GetAllAccountLedgers([FromQuery] bool? isActive)
        {
            var query = _context.AccountLedger.AsQueryable();

            if (isActive.HasValue)
            {
                query = query.Where(x => x.IsActive == isActive.Value);
            }

            var data = query
                .Select(x => new
                {
                    x.AccountLedgerId,
                    x.AccountLedgerName,
                    x.AccountLedgerNarration,
                    x.IsActive
                })
                .ToList();

            return Ok(data);
        }

        // ✅ POST create ledger
        [HttpPost("AccountLedger")]
        public IActionResult CreateAccountLedger([FromBody] AccountLedger model)
        {
            if (model == null)
                return BadRequest("Invalid data.");

            var ledger = new AccountLedger
            {
                AccountLedgerName = model.AccountLedgerName,
                AccountLedgerNarration = model.AccountLedgerNarration,
                IsActive = true
            };

            _context.AccountLedger.Add(ledger);
            _context.SaveChanges();

            return Ok(new { success = true, message = "Ledger added successfully!" });
        }

        [HttpPut("AccountLedger/{id}")]
        public IActionResult UpdateAccountLedger(int id, [FromBody] AccountLedger accountLedger)
        {
            var existing = _context.AccountLedger.Find(id);
            if (existing == null) return NotFound();

            existing.AccountLedgerName = accountLedger.AccountLedgerName;
            existing.AccountLedgerNarration = accountLedger.AccountLedgerNarration;
            existing.IsActive = accountLedger.IsActive;

            _context.SaveChanges();
            return Ok(existing);
        }

        //[HttpDelete("AccountLedger/{id}")]
        //public IActionResult DeleteAccountLedger(int id)
        //{
        //    var existing = _context.AccountLedger.Find(id);
        //    if (existing == null) return NotFound();
        //    existing.IsActive = false;
        //    //_context.AccountLedger.Remove(existing);
        //    _context.SaveChanges();
        //    return Ok();
        //}

    }
}
