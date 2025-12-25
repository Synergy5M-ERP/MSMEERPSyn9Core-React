using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models;

namespace SwamiSamarthSyn8.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        SwamiSamarthDbContext db = new SwamiSamarthDbContext();
        [HttpPost("CreateInv")]
   
        public IActionResult CreateInv([FromBody] Inventory inventory)
        {
            if (inventory == null)
            {
                return BadRequest(new { success = false, message = "Invalid inventory data!" });
            }

            try
            {
                using (var db = new SwamiSamarthDbContext())
                {
                    MASTER_InventoryTbl master = new MASTER_InventoryTbl()
                    {
                        //Date = DateTime.Now;

                        Item_Code = inventory.Item_Code,
                        Item_Name = inventory.Item_Name,
                        Unit_Of_Measurement = inventory.Unit_Of_Measurement,

                        Safe_Stock = inventory.Safe_Stock,
                        Lead_Time = inventory.Lead_Time,

                        Opening_Balance = inventory.Opening_Balance,
                        Receipt = inventory.Receipt,
                        Issue = inventory.Issue,
                        Closing_Balance = inventory.Closing_Balance,

                        MOQ = inventory.MOQ,
                        Quantity_Required = inventory.Quantity_Required,

                        Average_Price = inventory.Average_Price,
                        ClosingInvValue = inventory.ClosingInvValue,

                        Grade = inventory.Grade,
                        Currency = inventory.Currency,
                        InvCategory = (string)inventory.InvCategory
                    };

                    db.MASTER_InventoryTbl.Add(master);
                    db.SaveChanges();
                }

                return Ok(new
                {
                    success = true,
                    message = $"{inventory.Item_Name} saved successfully!"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpGet("GetItemList")]
        public IActionResult GetItemList()
        {
            var list = db.MASTER_InventoryTbl
                         .Where(i => i.Item_Code != null)
                         .OrderByDescending(i => i.Item_Name)
                         .ToList();

            return Ok(list);
        }

        [HttpGet("GetItemsByType")]
        public IActionResult GetItemsByType([FromQuery] string? type)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(type))
                {
                    return BadRequest(new
                    {
                        message = "Please provide a valid 'type' query parameter."
                    });
                }

                var items = db.MASTER_ItemTbl
                                .Where(x => x.Item_Category == type)
                                .Select(x=>x.Item_Name)
                                .Distinct()
                                .ToList();

                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Server error occurred.",
                    details = ex.Message
                });
            }
        }

        [HttpGet("GetItemsByGrade")]
        public IActionResult GetItemsByGrade([FromQuery] string? itemname)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(itemname))
                {
                    return BadRequest(new
                    {
                        message = "Please provide a valid 'itemname' query parameter."
                    });
                }

                var items = db.MASTER_ItemTbl
                                .Where(x => x.Item_Name == itemname)
                                .Select(x => new
                                {
                                   
                                    x.Grade,
                                    
                                })
                                .Distinct()
                                .ToList();

                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Server error occurred.",
                    details = ex.Message
                });
            }
        }

        [HttpGet("GetByGrade")]
        public IActionResult GetByGrade([FromQuery] string itemname, [FromQuery] string grade)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(itemname) || string.IsNullOrWhiteSpace(grade))
                {
                    return BadRequest(new
                    {
                        message = "itemname and grade are required."
                    });
                }

                var items = db.MASTER_ItemTbl
                              .Where(x => x.Item_Name == itemname && x.Grade == grade)
                              .Select(x => new
                              {
                                  item_Code = x.Item_Code,
                                  uom = x.Unit_Of_Measurement,
                                  currency = x.Currency,
                                  averagePrice = x.Average_Price
                              })
                              .FirstOrDefault();

                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Server error occurred.",
                    details = ex.Message
                });
            }
        }

        [HttpGet("GetInventoryById")]
        public IActionResult GetInventoryById(int id)
        {
            var data = db.MASTER_InventoryTbl
                .Where(x => x.Id == id)
                .Select(x => new
                {
                    id = x.Id,
                    invCategory = x.InvCategory,

                    item_Name = x.Item_Name,
                    grade = x.Grade,
                    item_Code = x.Item_Code,
                    unit_Of_Measurement = x.Unit_Of_Measurement,
                    currency = x.Currency,

                    opening_Balance = x.Opening_Balance,

                    // ✅ FIXED NAMES
                    issue_Qty = x.Issue,
                    receipt_Qty = x.Receipt,

                    closing_Balance = x.Closing_Balance,
                    averagePrice = x.Average_Price,
                    closingInvValue = x.ClosingInvValue
                })
                .FirstOrDefault();

            if (data == null)
                return NotFound(new { message = "Record not found" });

            return Ok(data);
        }

        [HttpPut("UpdateInv")]
        public IActionResult UpdateInv([FromBody] MASTER_InventoryTbl model)
        {
            var record = db.MASTER_InventoryTbl.FirstOrDefault(x => x.Id == model.Id);

            if (record == null)
                return NotFound(new { message = "Record not found" });

            record.Opening_Balance = model.Opening_Balance;
            record.Issue = model.Issue;
            record.Receipt = model.Receipt;
            record.Closing_Balance = model.Closing_Balance;
            record.Average_Price = model.Average_Price;
            record.ClosingInvValue = model.ClosingInvValue;

            db.SaveChanges();

            return Ok(new { message = "Inventory updated successfully" });
        }

    }
}
