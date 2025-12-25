using Microsoft.AspNetCore.Mvc;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models;
using Newtonsoft.Json.Linq;
using Microsoft.EntityFrameworkCore;


namespace SwamiSamarthSyn8.Controllers.Masters
{
    [ApiController]
    [Route("api/[controller]")]
    public class BOMController : Controller
    {
        private readonly SwamiSamarthDbContext _context;

        public BOMController(SwamiSamarthDbContext context)
        {
            _context = context;

        }
        //public IActionResult Index()
        //{
        //    return View();
        //}

        [HttpGet("GetBOMData")]
        public IActionResult GetBOMData(string category, string itemName = null, string grade = null, bool checkBOMExists = false)
        {
            if (string.IsNullOrEmpty(category))
                return BadRequest(new { message = "Category required (SELL / BUY)" });

            category = category.Trim().ToUpper();

            var query = _context.MASTER_ItemTbl
                .Where(x => x.Item_Category != null &&
                            x.Item_Category.Trim().ToUpper() == category);
            if (checkBOMExists && !string.IsNullOrEmpty(itemName) && !string.IsNullOrEmpty(grade))
            {
                var exists = _context.BOM_FinishProdTbl
                    .Any(x => x.ItemName.Trim().ToUpper() == itemName.Trim().ToUpper() &&
                              x.Grade.Trim().ToUpper() == grade.Trim().ToUpper());

                return Ok(new { type = "CheckBOM", exists });
            }
            if (string.IsNullOrEmpty(itemName) && string.IsNullOrEmpty(grade))
            {
                var items = query
                    .Select(x => x.Item_Name.Trim())
                    .Distinct()
                    .ToList();

                return Ok(new { type = "ItemNames", data = items });
            }
            if (!string.IsNullOrEmpty(itemName) && string.IsNullOrEmpty(grade))
            {
                var grades = query
                    .Where(x => x.Item_Name.Trim().ToUpper() == itemName.Trim().ToUpper())
                    .Select(x => x.Grade.Trim())
                    .Distinct()
                    .ToList();

                return Ok(new { type = "Grades", data = grades });
            }
            if (!string.IsNullOrEmpty(itemName) && !string.IsNullOrEmpty(grade))
            {
                var result = query
                    .Where(x => x.Item_Name.Trim().ToUpper() == itemName.Trim().ToUpper())
                    .Where(x => x.Grade.Trim().ToUpper() == grade.Trim().ToUpper())
                    .Select(x => new
                    {
                        itemcode = x.Item_Code,
                        uom = x.Unit_Of_Measurement,
                        currency = x.Currency,
                        averagep = x.Average_Price,
                        buyerName = x.Company_Name
                    })
                    .FirstOrDefault();

                if (result == null)
                    return NotFound(new { type = "ItemDetails", message = "Item not found" });

                return Ok(new { type = "ItemDetails", data = result });
            }
            return BadRequest(new { type = "Error", message = "Invalid request" });
        }


        [HttpPost("SaveBOMItem")]
        public IActionResult SaveBOMItem([FromBody] SaveBOMRequest model)
        {
            if (model == null || model.FinishItem == null)
            {
                return Json(new { success = false, message = "Finish item is required." });
            }

            try
            {
                Console.WriteLine("Finish Quantity Received: " + model.FinishItem.Quantity);

                _context.BOM_FinishProdTbl.Add(model.FinishItem);

                _context.Entry(model.FinishItem)
                        .Property(x => x.Quantity)
                        .IsModified = true;

                _context.SaveChanges(); 

                if (model.RMItems != null && model.RMItems.Count > 0)
                {
                    foreach (var rm in model.RMItems)
                    {
                        rm.FPBID = model.FinishItem.FPBID;
                        _context.BOM_RawMatTbl.Add(rm);
                    }
                    _context.SaveChanges();
                }

                return Json(new { success = true, message = "BOM saved successfully." });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }


        [HttpGet("GetBOMList")]
        public async Task<IActionResult> GetBOMList()
        {
            var bomList = await _context.BOM_FinishProdTbl
                .Where(f => f.IsActive) 
                .Include(f => f.BOM_RawMatTbls) 
                .Select(f => new
                {
                    id = f.FPBID,
                    finishItem = new
                    {
                        FPBID = f.FPBID,     
                        f.ItemName,
                        f.Grade,
                        f.ItemCode,
                        f.UOM,
                        f.Quantity,
                        f.AssemblyCode,
                        f.Buyer_Name,
                        f.ProcureType,
                        f.Level,
                        //f.TotalRmQty
                    },
                    rmItems = f.BOM_RawMatTbls
                                .Where(r => r.IsActive) 
                                .Select(r => new
                                {
                                    RMID = r.RMID,
                                    r.ItemName,
                                    r.Grade,
                                    r.ItemCode,
                                    r.UOM,
                                    r.Quantity,
                                    r.QtyInGrms,
                                    r.AssemblyCode,
                                    r.ProcureType,
                                    r.Level
                                }).ToList()
                })
                .ToListAsync();

            return Ok(bomList);
        }


        [HttpPost("UpdateBOM")]
        public async Task<IActionResult> UpdateBOM([FromBody] SaveBOMRequest request)
        {
            if (request?.FinishItem == null || request.FinishItem.FPBID <= 0)
                return BadRequest("Invalid BOM data or missing Finish Item ID.");

            int finishItemId = request.FinishItem.FPBID;

            var existingFinishItem = await _context.BOM_FinishProdTbl
                .Include(f => f.BOM_RawMatTbls)
                .FirstOrDefaultAsync(f => f.FPBID == finishItemId);

            if (existingFinishItem == null)
                return NotFound($"Finish Item with ID {finishItemId} not found.");

            existingFinishItem.Quantity = request.FinishItem.Quantity;
            existingFinishItem.ProcureType = request.FinishItem.ProcureType;

            foreach (var reqRm in request.RMItems)
            {
                if (reqRm.RMID > 0)
                {
                    var dbRm = existingFinishItem.BOM_RawMatTbls
                        .FirstOrDefault(r => r.RMID == reqRm.RMID);

                    if (dbRm != null)
                    {
                        dbRm.Quantity = reqRm.Quantity;
                        dbRm.ProcureType = reqRm.ProcureType;
                        dbRm.IsActive = reqRm.IsActive; 
                    }
                }
                else
                {
                    var newRm = new BOM_RawMatTbl
                    {
                        FPBID = finishItemId,
                        ItemName = reqRm.ItemName ?? "",
                        ItemCode = reqRm.ItemCode ?? "",
                        Quantity = reqRm.Quantity,
                        UOM = reqRm.UOM ?? "",
                        ProcureType = reqRm.ProcureType ?? "bought",
                        Grade = reqRm.Grade ?? "",
                        Currency = reqRm.Currency ?? "INR",
                        AssemblyCode = reqRm.AssemblyCode ?? "",
                        AveragePrice = reqRm.AveragePrice,
                        Level = reqRm.Level ?? "",
                        QtyInGrms = reqRm.QtyInGrms,
                        IsActive = true
                    };
                    _context.BOM_RawMatTbl.Add(newRm);
                }
            }

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "BOM updated successfully" });
            }
            catch (DbUpdateException ex)
            {
                var innerMessage = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new { success = false, message = $"Database error: {innerMessage}" });
            }
        }


        [HttpDelete("DeleteBOM/{bomId}")]
        public async Task<IActionResult> DeleteBOM(int bomId)
        {
            if (bomId <= 0) return BadRequest("Invalid BOM ID");

            try
            {
                var bom = await _context.BOM_FinishProdTbl.FirstOrDefaultAsync(b => b.FPBID == bomId);
                if (bom == null) return NotFound("BOM not found");

                bom.IsActive = false;
                bom.DeletedAt = DateTime.Now;

                var rmItems = await _context.BOM_RawMatTbl.Where(r => r.FPBID == bomId).ToListAsync();
                foreach (var rm in rmItems)
                {
                    rm.IsActive = false;
                    rm.DeletedAt = DateTime.Now;
                }
                await _context.SaveChangesAsync();
                return Ok(new { message = "BOM and its RM items soft-deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }

    public class SaveBOMRequest
    {
        public double? TempId { get; set; }
        public BOM_FinishProdTbl FinishItem { get; set; }
        public List<BOM_RawMatTbl> RMItems { get; set; }
    }

}
