using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Helper;
using SwamiSamarthSyn8.Models.Accounts;

namespace SwamiSamarthSyn8.Controllers.Accounts
{
    [Route("api/")]
    [ApiController]
    public class AccountDebitNoteController : ControllerBase
    {
        private readonly SwamiSamarthDbContext _context;

        public AccountDebitNoteController(SwamiSamarthDbContext context)
        {
            _context = context;
        }
        private static string GetFinancialYear()
        {
            var now = DateTime.Now;
            if (now.Month >= 4)
                return $"{now.Year}-{(now.Year + 1).ToString().Substring(2)}";
            else
                return $"{now.Year - 1}-{now.Year.ToString().Substring(2)}";
        }

        [HttpGet("GetNextDebitNoteNo")]
        public async Task<IActionResult> GetNextDebitNoteNo()
        {
            try
            {
                var fy = GetFinancialYear();

                var lastDebitNote = await _context.AccountDebitNote
                    .Where(x => x.DebitNoteNo.StartsWith($"DN/{fy}/"))
                    .OrderByDescending(x => x.AccountDebitNoteId)
                    .Select(x => x.DebitNoteNo)
                    .FirstOrDefaultAsync();

                int nextNumber = 1;

                if (!string.IsNullOrEmpty(lastDebitNote))
                {
                    var parts = lastDebitNote.Split('/');
                    nextNumber = int.Parse(parts[^1]) + 1;
                }

                var nextDebitNoteNo = $"DN/{fy}/{nextNumber.ToString("D4")}";

                return Ok(new
                {
                    success = true,
                    nextDebitNoteNo
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }
  
        [HttpPost("SaveDebitNote")]
        public async Task<IActionResult> SaveDebitNote([FromBody] AccountDebitNote model)
        {
            /* ---------------- VALIDATION ---------------- */
            if (model == null)
                return BadRequest("Invalid payload");

            if (string.IsNullOrEmpty(model.Category))
                return BadRequest("Category is required");

            if (model.DebiitNoteEntries == null || !model.DebiitNoteEntries.Any())
                return BadRequest("At least one item is required");

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                /* ----------- SAVE CREDIT NOTE ----------- */
                var debitNote = new AccountDebitNote
                {
                    Category = model.Category,
                    VendorId = model.VendorId,
                    InvocieNoId = model.InvocieNoId,
                    DebitNoteNo = model.DebitNoteNo,
                    DebitNoteDate = model.DebitNoteDate,
                    PaymentDueDate = model.PaymentDueDate,
                    TotalAmount = model.TotalAmount,
                    TotalTaxAmount = model.TotalTaxAmount,
                    GrandAmount = model.GrandAmount,
                    CreatedBy = model.CreatedBy
                };

                _context.AccountDebitNote.Add(debitNote);
                await _context.SaveChangesAsync();

                int debitNoteId = debitNote.AccountDebitNoteId;

                /* ----------- SAVE ITEMS ----------- */
                if (model.DebiitNoteEntries != null && model.DebiitNoteEntries.Count > 0)
                {
                    foreach (var item in model.DebiitNoteEntries)
                    {
                        var debitItem = new AccountDebitNoteDetails
                        {
                            AccountDebitNoteId = debitNote.AccountDebitNoteId,
                            ItemId = item.ItemId,
                            Qty = item.Qty,
                            UnitId = item.UnitId,
                            Price = item.Price,
                            TotalAmount = item.TotalAmount,
                            TaxTypeId = item.TaxTypeId,
                            CGST = item.CGST,
                            SGST = item.SGST,
                            IGST = item.IGST,
                            TotalTax = item.TotalTax,
                            NetAmount = item.NetAmount
                        };

                        _context.AccountDebitNoteDetails.Add(debitItem);
                    }
                    await _context.SaveChangesAsync();
                }

                await transaction.CommitAsync();

                return Ok(new { success = true, message = "Debit Note saved successfully", debitNoteId });

            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to save Credit Note",
                    error = ex.Message,
                    innerError = ex.InnerException?.Message
                });
            }
        }


    }
}
