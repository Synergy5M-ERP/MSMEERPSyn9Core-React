using Microsoft.AspNetCore.Mvc;
using SwamiSamarthSyn8.Models;
using SwamiSamarthSyn8.Data;

namespace SwamiSamarthSyn8.Accounts.Controller
{
    [Route("api/")]
    [ApiController]
    public class AccountSubLedgerController : ControllerBase
    {
        private readonly SwamiSamarthDbContext _context;
        public AccountSubLedgerController(SwamiSamarthDbContext context)
        {
            _context = context;
        }

        // ---------- AccountSubLedger APIs ----------
        // ✅ GET all ledgers
        [HttpGet("AccountSubLedger")]
        public IActionResult GetAllAccountSubLedgers([FromQuery] bool? isActive)
        {
            var query = _context.AccountSubLedger.AsQueryable();

            if (isActive.HasValue)
            {
                query = query.Where(x => x.IsActive == isActive.Value);
            }

            var data = query
                .Select(x => new
                {
                    x.AccountLedgerid,
                    x.AccountLedgerSubName,
                    x.AccountLedgerSubNarration,
                    x.AccountLedgerSubid,
                    x.IsActive
                })
                .ToList();

            return Ok(data);
        }

        // ✅ POST create sub ledger
        [HttpPost("AccountSubLedger")]
        public IActionResult CreateAccountSubLedger([FromBody] AccountSubLedger model)
        {
            if (model == null)
                return BadRequest("Invalid data.");

            var ledger = new AccountSubLedger
            {
                AccountLedgerSubName = model.AccountLedgerSubName,
                AccountLedgerSubNarration = model.AccountLedgerSubNarration,
                AccountLedgerid = model.AccountLedgerid,
                IsActive = true
            };

            _context.AccountSubLedger.Add(ledger);
            _context.SaveChanges();

            return Ok(new { success = true, message = "SubLedger added successfully!" });
        }

        [HttpPut("AccountSubLedger/{id}")]
        public IActionResult UpdateAccountSubLedger(int id, [FromBody] AccountSubLedger accountSubLedger)
        {
            var existing = _context.AccountSubLedger.Find(id);
            if (existing == null) return NotFound();

            existing.AccountLedgerSubName = accountSubLedger.AccountLedgerSubName;
            existing.AccountLedgerSubNarration = accountSubLedger.AccountLedgerSubNarration;
            existing.AccountLedgerid = accountSubLedger.AccountLedgerid;
            existing.IsActive = accountSubLedger.IsActive;

            _context.SaveChanges();
            return Ok(existing);
        }

        //[HttpDelete("AccountSubLedger/{id}")]
        //public IActionResult DeleteAccountSubLedger(int id)
        //{
        //    var existing = _context.AccountSubLedger.Find(id);
        //    if (existing == null) return NotFound();
        //    existing.IsActive = false;
           
        //    _context.SaveChanges();
        //    return Ok();
        //}

    }
}
