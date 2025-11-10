using Microsoft.AspNetCore.Mvc;
using SwamiSamarthSyn8.Models;
using SwamiSamarthSyn8.Data;

namespace SwamiSamarthSyn8.Accounts.Controller
{
    [Route("api/")]
    [ApiController]
    public class AccountFiscalPeriodController : ControllerBase
    {
        private readonly SwamiSamarthDbContext _context;
        public AccountFiscalPeriodController(SwamiSamarthDbContext context)
        {
            _context = context;
        }

        // ---------- AccountFiscalPeriod APIs ----------

        // ✅ GET all fiscal period
        [HttpGet("AccountFiscalPeriod")]
        public IActionResult GetAllAccountFiscalPeriods([FromQuery] bool? isActive)
        {
            var query = _context.AccountFiscalPeriod.AsQueryable();

            if (isActive.HasValue)
            {
                query = query.Where(x => x.IsActive == isActive.Value);
            }

            var data = query
                .Select(x => new
                {
                    x.AccountFiscalPeriodId,
                    x.FiscalPeriodEndDate,
                    x.FiscalPeriodStartDate,
                    x.FiscalPeriodName,
                    x.FiscalYear,
                    //x.FiscalPeriodStatus,
                    x.IsActive
                })
                .ToList();

            return Ok(data);
        }

        // ✅ POST create fiscal period
        [HttpPost("AccountFiscalPeriod")]
        public IActionResult CreateAccountFiscalPeriod([FromBody] AccountFiscalPeriod model)
        {
            if (model == null)
                return BadRequest("Invalid data.");

            var fiscalperiod = new AccountFiscalPeriod
            {
                FiscalYear = model.FiscalYear,
                FiscalPeriodName = model.FiscalPeriodName,
                FiscalPeriodStartDate = model.FiscalPeriodStartDate,
                FiscalPeriodEndDate = model.FiscalPeriodEndDate,
                //FiscalPeriodStatus = model.FiscalPeriodStatus,
                IsActive = true
            };

            _context.AccountFiscalPeriod.Add(fiscalperiod);
            _context.SaveChanges();

            return Ok(new { success = true, message = "Fiscal Period added successfully!" });
        }

        [HttpPut("AccountFiscalPeriod/{id}")]
        public IActionResult UpdateAccountFiscalPeriod(int id, [FromBody] AccountFiscalPeriod accountFiscalPeriod)
        {
            var existing = _context.AccountFiscalPeriod.Find(id);
            if (existing == null) return NotFound();

            existing.FiscalPeriodStartDate = accountFiscalPeriod.FiscalPeriodStartDate;
            existing.FiscalPeriodEndDate = accountFiscalPeriod.FiscalPeriodEndDate;
            existing.FiscalPeriodName = accountFiscalPeriod.FiscalPeriodName;
            existing.FiscalYear = accountFiscalPeriod.FiscalYear;
            //existing.FiscalPeriodStatus = accountFiscalPeriod.FiscalPeriodStatus;
            existing.IsActive = accountFiscalPeriod.IsActive;

            _context.SaveChanges();
            return Ok(existing);
        }

    }
}
