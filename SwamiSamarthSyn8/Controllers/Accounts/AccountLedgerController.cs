using Microsoft.AspNetCore.Mvc;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models;

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

        //----------- Get Account Group lists -----------
        [HttpGet("AccountGroups")]
        public IActionResult GetAllAccountGroups([FromQuery] bool? isActive)
        {
            var query = _context.AccountGroup.AsQueryable();

            if (isActive.HasValue)
            {
                query = query.Where(x => x.IsActive == isActive.Value);
            }

            var data = query
                .Select(x => new
                {
                    id = x.AccountGroupid,
                    name = x.AccountGroupName
                })
                .ToList();

            return Ok(data);
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
                    x.AccountGroupId,
                    x.AccountLedgerId,
                    x.AccountLedgerName,
                    x.AccountLedgerNarration,
                    x.OpeningBal,
                    x.ClosingBal,
                    x.GSTNo,
                    x.Address,
                    x.MobileNo,
                    x.EmailId,
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
                AccountGroupId = model.AccountGroupId,
                AccountLedgerName = model.AccountLedgerName,
                AccountLedgerNarration = model.AccountLedgerNarration,
                MobileNo = model.MobileNo,
                EmailId = model.EmailId,
                GSTNo = model.GSTNo,
                OpeningBal = model.OpeningBal,
                ClosingBal = model.ClosingBal,
                Address = model.Address,
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

            existing.AccountGroupId = accountLedger.AccountGroupId;
            existing.AccountLedgerName = accountLedger.AccountLedgerName;
            existing.AccountLedgerNarration = accountLedger.AccountLedgerNarration;
            existing.MobileNo = accountLedger.MobileNo;
            existing.EmailId = accountLedger.EmailId;
            existing.GSTNo = accountLedger.GSTNo;
            existing.OpeningBal = accountLedger.OpeningBal;
            existing.ClosingBal = accountLedger.ClosingBal;
            existing.Address = accountLedger.Address;
            existing.IsActive = accountLedger.IsActive;

            _context.SaveChanges();
            return Ok(existing);
        }
    }
}
