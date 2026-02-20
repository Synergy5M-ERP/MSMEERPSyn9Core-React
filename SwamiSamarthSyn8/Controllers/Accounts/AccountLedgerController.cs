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

        [HttpGet("AccountPrimaryGroup")]
        public IActionResult GetAllPrimaryGroups([FromQuery] bool? isActive)
        {
            try
            {
                var query = _context.AccountPrimaryGroup.AsQueryable();

                if (isActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == isActive.Value);
                }

                var data = query
                    .Select(x => new
                    {
                        primaryGroupid = x.PrimaryGroupId,
                        primaryGroupName = x.AccountPrimaryGroupName,
                        primaryGroupcode = x.PrimaryGroupCode
                    })
                    .ToList();

                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    error = ex.Message,
                    innerError = ex.InnerException?.Message
                });
            }
        }


        //----------- Get Account Group lists -----------
        [HttpGet("AccountGroups")]
        public IActionResult GetAllAccountGroups([FromQuery] bool? isActive, [FromQuery] int? primarygroupid)
        {
            var query = _context.AccountGroup.AsQueryable();

            if (isActive.HasValue)
            {
                query = query.Where(x => x.IsActive == isActive.Value);
            }

            if (primarygroupid.HasValue)
            {
                query = query.Where(x => x.PrimaryGroupId == primarygroupid.Value); // Filter by selected type
            }

            var data = query
                .Select(x => new
                {
                    accountGroupId = x.AccountGroupid,
                    accountGroupName = x.AccountGroupName,
                    accountGroupCode = x.GroupCode
                })
                .ToList();

            return Ok(data);
        }

        //----------- Get Account Sub Group lists -----------
        [HttpGet("AccountSubGroup")]
        public IActionResult GetAllAccountSubGroups([FromQuery] bool? isActive, [FromQuery] int? groupid)
        {
            var query = _context.AccountSubGroup.AsQueryable();

            if (isActive.HasValue)
            {
                query = query.Where(x => x.IsActive == isActive.Value);
            }

            if (groupid.HasValue)
            {
                query = query.Where(x => x.AccountGroupid == groupid.Value); // Filter by selected type
            }

            var data = query
                .Select(x => new
                {
                    accountSubGroupId = x.AccountSubGroupid,
                    accountSubGroupName = x.AccountSubGroupName,
                    //subGroupCode = x.
                })
                .ToList();

            return Ok(data);
        }

        //----------- Get Account Sub Group lists -----------
        [HttpGet("AccountSubSubGroup")]
        public IActionResult GetAllAccountSubSubGroups([FromQuery] bool? isActive, [FromQuery] int? subgroupid)
        {
            var query = _context.AccountSubSubGroup.AsQueryable();

            if (isActive.HasValue)
            {
                query = query.Where(x => x.IsActive == isActive.Value);
            }

            if (subgroupid.HasValue)
            {
                query = query.Where(x => x.AccountGroupid == subgroupid.Value); // Filter by selected type
            }

            var data = query
                .Select(x => new
                {
                    accountSubSubGroupId = x.AccountSubSubGroupid,
                    accountSubSubGroupName = x.AccountSubSubGroupName
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
                PrimaryGroupId = model.PrimaryGroupId,
                AccountGroupId = model.AccountGroupId,
                AccountSubGroupId = model.AccountSubGroupId,
                AccountSubSubGroupId = model.AccountSubSubGroupId,
                AccountLedgerName = model.AccountLedgerName,
                GLCode = model.GLCode,
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

            existing.PrimaryGroupId = accountLedger.PrimaryGroupId;
            existing.AccountGroupId = accountLedger.AccountGroupId;
            existing.AccountSubGroupId = accountLedger.AccountSubGroupId;
            existing.AccountSubSubGroupId = accountLedger.AccountSubSubGroupId;
            existing.AccountLedgerName = accountLedger.AccountLedgerName;
            existing.GLCode = accountLedger.GLCode;
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

        [HttpDelete("AccountLedger/{id}")]
        public IActionResult DeleteAccountLedger(int id)
        {
            var ledger = _context.AccountLedger.Find(id);
            if (ledger == null) return NotFound();

            ledger.IsActive = false;
            _context.SaveChanges();

            return Ok(new { success = true, message = "Ledger deactivated successfully" });
        }

        [HttpPatch("AccountLedger/{id}/activate")]
        public IActionResult ActivateAccountLedger(int id)
        {
            var ledger = _context.AccountLedger.Find(id);
            if (ledger == null) return NotFound();

            ledger.IsActive = true;
            _context.SaveChanges();

            return Ok(new { success = true, message = "Ledger activated successfully" });
        }

    }
}
