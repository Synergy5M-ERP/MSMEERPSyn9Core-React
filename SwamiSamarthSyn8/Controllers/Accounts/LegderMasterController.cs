using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models;

namespace SwamiSamarthSyn8.Controllers.Accounts
{
    [Route("api/[controller]")]
    [ApiController]

    public class LegderMasterController : Controller
    {
        
            private readonly SwamiSamarthDbContext _swamiContext;   // 🔹 MMM DB
            private readonly MsmeERPDbContext _msmeContext;         // 🔹 Accounts DB
            private readonly ILogger<GRNController> _logger;

            public LegderMasterController(
                SwamiSamarthDbContext swamiContext,
                MsmeERPDbContext msmeContext,
                ILogger<GRNController> logger)
            {
                _swamiContext = swamiContext;
                _msmeContext = msmeContext;
                _logger = logger;
            }
            [HttpGet("GetGRNInvoiceNames")]
        public IActionResult GetGRNInvoiceNames(string type)
        {
            List<string> columns = new List<string>();

            if (type == "GRN")
            {
                var entity = typeof(MMM_GRNProductTbl);
                columns = entity.GetProperties()
                                .Select(p => p.Name)
                                .ToList();
            }
            else if (type == "Invoice")
            {
                var entity = typeof(SDM_InvItemTbl);
                columns = entity.GetProperties()
                                .Select(p => p.Name)
                                .ToList();
            }

            return Ok(columns);
        }
        // SAVE LEDGER MAPPING
        [HttpPost("SaveLedgerMapping")]
        public IActionResult SaveLedgerMapping([FromBody] LedgerMappingRequest request)
        {
            try
            {
                var data = _msmeContext.AccountLedger
                    .FirstOrDefault(x => x.AccountLedgerId == request.LedgerId);

                if (data == null)
                    return NotFound("Ledger not found");

                data.GRNInvColumnName = request.GRNInvColumnName;
                data.CrDr = request.CrDr;

                _msmeContext.SaveChanges();

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
        public class LedgerMappingRequest
        {
            public int LedgerId { get; set; }
            public string GRNInvColumnName { get; set; }
            public string CrDr { get; set; }
        }
    }
}
