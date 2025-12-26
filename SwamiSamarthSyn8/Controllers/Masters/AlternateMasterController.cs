using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models;

namespace SwamiSamarthSyn8.Controllers.Masters
{
    public class AlternateMasterController : Controller
    {
        private readonly SwamiSamarthDbContext _context;
        public AlternateMasterController(SwamiSamarthDbContext context)
        {
            _context = context;
        }
     

        [HttpGet]
        [Route("api/AlternateMaster/GetPrimaryItems")]
        public IActionResult GetPrimaryItems()
        {
            try
            {
                var items = _context.MASTER_ItemTbl
                .Where(x => x.Primary_Alternate == "PRIMARY")
                .Select(x => new
                {
                    ID = x.Id,
                    Item_Name = x.Item_Name,
                    grade = x.Grade,
                    ItemCode = x.Item_Code,
                    UOM = x.Unit_Of_Measurement,
                    Type = x.Primary_Alternate
                })
                .ToList();

                return Json(items);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        [Route("api/AlternateMaster/GetItemDetails")]
        public IActionResult GetItemDetails()
        {
            try
            {
                var items = _context.MASTER_ItemTbl
                .Where(x => x.Primary_Alternate == "ALTERNATE")
                .Select(x => new
                {
                    ID = x.Id,
                    Item_Name = x.Item_Name,
                    grade = x.Grade,
                    ItemCode = x.Item_Code,
                    UOM = x.Unit_Of_Measurement,
                    Type = x.Primary_Alternate
                })
                .ToList();

                return Json(items);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("api/AlternateMaster/SaveData")]
        public ActionResult SaveData([FromBody] BothPrimeAndAlt data)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return Json(new { success = false, message = "Invalid data!" });
                }

                int primaryItemId = 0;


                if (data.PrimaeryData != null && data.PrimaeryData.Count > 0)
                {
                    foreach (var primaryItem in data.PrimaeryData)
                    {
                        PrimaryItemMaster prime = new PrimaryItemMaster
                        {
                            ITEM_NAME = primaryItem.ITEM_NAME,   // Correct property
                            GRADE = primaryItem.GRADE,
                            UOM = primaryItem.UOM,
                            QTY = primaryItem.QTY,               // decimal → decimal OK
                            TYPE = primaryItem.TYPE,
                            Item_Code = primaryItem.ITEM_CODE
                        };

                        _context.PrimaryItemMasters.Add(prime);
                    }

                    _context.SaveChanges();

                    // Get LAST INSERTED PRIMARY ITEM ID
                    primaryItemId = _context.PrimaryItemMasters
                                    .OrderByDescending(x => x.ID)
                                    .Select(x => x.ID)
                                    .FirstOrDefault();
                }


                if (data.AlternateData != null && data.AlternateData.Count > 0)
                {
                    foreach (var alternateItem in data.AlternateData)
                    {
                        AlternateItemMaster alt = new AlternateItemMaster
                        {
                            ITEM_NAME = alternateItem.ITEM_NAME,  // Correct property
                            GRADE = alternateItem.GRADE,
                            UOM = alternateItem.UOM,
                            QTY = alternateItem.QTY,              // decimal → decimal OK
                            TYPE = alternateItem.TYPE,
                            Item_Code = alternateItem.ITEM_CODE,
                            PId = primaryItemId
                        };

                        _context.AlternateItemMasters.Add(alt);
                    }

                    _context.SaveChanges();
                }

                return Json(new { success = true, message = "Data saved successfully!" });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = "Server error!",
                    error = ex.Message
                });
            }
        }

        [HttpGet]
        [Route("api/AlternateMaster/GetAllItemsWithAlternates")]

        public IActionResult GetAllItemsWithAlternates()
        {
            try
            {
                // Fetch primary items
                var primaryItems = _context.PrimaryItemMaster
                    .Select(p => new
                    {
                        p.ID,
                        ITEM_NAME = p.ITEM_NAME,
                        GRADE = p.GRADE,
                        UOM = p.UOM,
                        QTY = p.QTY,
                        TYPE = p.TYPE,
                        Item_Code = p.Item_Code
                    })
                    .ToList();

                // Fetch alternate items
                var alternateItems = _context.AlternateItemMaster
                    .Select(a => new
                    {
                        a.ID,
                        ITEM_NAME = a.ITEM_NAME,
                        GRADE = a.GRADE,
                        UOM = a.UOM,
                        QTY = a.QTY,
                        TYPE = a.TYPE,
                        PId = a.PId,
                        Item_Code = a.Item_Code
                    })
                    .ToList();

                // Combine primary with their alternates
                var result = primaryItems
                    .Select(p => new
                    {
                        Primary = p,
                        Alternates = alternateItems
                            .Where(a => a.PId == p.ID)
                            .Select(a => new
                            {
                                a.ID,
                                a.ITEM_NAME,
                                a.GRADE,
                                a.UOM,
                                a.QTY,
                                a.TYPE,
                                a.Item_Code
                            })
                            .ToList() // ensures Alternates is always a list
                    })
                    .ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet]
        [Route("api/AlternateMaster/GetRecordById")]
        public IActionResult GetRecordById(int id)
        {
            var p = _context.PrimaryItemMaster
                .Where(x => x.ID == id)
                .Select(x => new
                {
                    ID = x.ID,
                    iteM_NAME = x.ITEM_NAME,
                    grade = x.GRADE,
                    uom = x.UOM,
                    qty = x.QTY,
                    type = x.TYPE,
                    item_Code = x.Item_Code
                })
                .FirstOrDefault();

            if (p == null)
                return NotFound();

            var alternates = _context.AlternateItemMaster
                .Where(a => a.PId == id)
                .Select(a => new
                {
                    ID = a.ID,
                    iteM_NAME = a.ITEM_NAME,
                    grade = a.GRADE,
                    uom = a.UOM,
                    qty = a.QTY,
                    type = a.TYPE,
                    item_Code = a.Item_Code
                })
                .ToList();

            return Ok(new
            {
                primary = p,
                alternates = alternates
            });
        }
    }

}
