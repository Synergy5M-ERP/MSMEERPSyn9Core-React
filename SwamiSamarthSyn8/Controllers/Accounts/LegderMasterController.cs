using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models;
using SwamiSamarthSyn8.Models.Accounts;

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
                // Child table columns
                var productColumns = typeof(MMM_GRNProductTbl)
                                        .GetProperties()
                                        .Select(p => p.Name)
                                        .ToList();

                // Parent table columns
                var grnColumns = typeof(MMM_GRNTbl)
                                    .GetProperties()
                                    .Select(p => p.Name)
                                    .ToList();

                // Combine both
                columns = productColumns
                            .Concat(grnColumns)
                            .Distinct() // avoid duplicate names
                            .ToList();
            }

            else if (type == "Invoice")
            {
                columns = typeof(SDM_InvItemTbl)
                            .GetProperties()
                            .Select(p => p.Name)
                            .ToList();
            }
            else if (type == "NonGRN" || type == "NonSO")
            {
                columns = typeof(AccountNonGRNInvoiceDetails)
                    .GetProperties()
                    .Select(i => i.Name)
                    .ToList();
            }
            else if (type == "Transportation")
            {
                columns = typeof(AccountTransportationGRN)
                            .GetProperties()
                            .Select(p => p.Name)
                            .ToList();
            }

            return Ok(columns);
        }
        // SAVE LEDGER MAPPING
        [HttpPost("SaveLedgerMapping")]
        public IActionResult SaveLedgerMapping([FromBody] LedgerMappingRequest request)
        {
            if (request == null)
            {
                return BadRequest(new { success = false, message = "Invalid request body" });
            }

            try
            {
                // 1. Fetch the ledger from the context
                var data = _msmeContext.AccountLedger
                                       .FirstOrDefault(x => x.AccountLedgerId == request.LedgerId);

                // 2. Null check
                if (data == null)
                {
                    return NotFound(new { success = false, message = "Ledger not found" });
                }

                // 3. Normalize type (Trim and handle casing)
                string type = request.Type?.Trim();

                // 4. Update the correct column based on 'Type'
                // Logic: GRN/Invoice -> GRNInvColumnName
                //        NonGRN/NonSO -> NONGRNInvColumnName
                //        Transportation -> TransportColumnName
                if (type == "GRN" || type == "Invoice")
                {
                    data.GRNInvColumnName = request.GRNInvColumnName;
                }
                else if (type == "NonGRN" || type == "NonSO")
                {
                    data.NONGRNInvColumnName = request.GRNInvColumnName;
                }
                else if (type == "Transportation")
                {
                    data.TransportColumnName = request.GRNInvColumnName;
                }
                else
                {
                    return BadRequest(new { success = false, message = "Invalid type provided" });
                }

                // Always update CrDr regardless of the specific column type
                data.CrDr = request.CrDr;

                // 5. Save changes
                _msmeContext.SaveChanges();

                return Ok(new { success = true, message = "Mapping saved successfully" });
            }
            catch (Exception ex)
            {
                // Log the exception here if you have a logger
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
        public class LedgerMappingRequest
        {
            public int LedgerId { get; set; }
            public string? GRNInvColumnName { get; set; }
            public string? CrDr { get; set; }
            public string? Type { get; set; } // "GRN", "NonGRN", "Transportation", etc.
        }
    }
}
