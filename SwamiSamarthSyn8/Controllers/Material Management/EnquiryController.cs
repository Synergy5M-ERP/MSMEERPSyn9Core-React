using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;

namespace SwamiSamarthSyn8.Controllers.Material_Management
{

    [ApiController]
    [Route("api/[controller]")]
    public class EnquiryController : Controller
    {

        private readonly SwamiSamarthDbContext _context;

        public EnquiryController(SwamiSamarthDbContext context)
        {
            _context = context;

        }

        [HttpGet("GetPRNumbers")]
        public async Task<ActionResult<List<PRNumberDto>>> GetPRNumbers([FromQuery] string prType)
        {
            if (string.IsNullOrWhiteSpace(prType))
                return BadRequest("PR Type is required.");

            List<PRNumberDto> prNumbers = new List<PRNumberDto>();

            if (prType.Equals("Manual", StringComparison.OrdinalIgnoreCase))
            {
                // Join MMM_PrItemTbl and MMM_PurchaseReqTbl for Manual PR
                prNumbers = await (from item in _context.MMM_PrItemTbl
                                   join pr in _context.MMM_PurchaseReqTbl
                                       on item.Id equals pr.Id // adjust join key if needed
                                   where item.BalQty != 0
                                   select new PRNumberDto
                                   {
                                       Value = pr.PurchaseReqNo,
                                       Text = pr.PurchaseReqNo
                                   })
                                  .Distinct()
                                  .ToListAsync();
            }
            else if (prType.Equals("Auto", StringComparison.OrdinalIgnoreCase))
            {
                // Auto PR fetch
                prNumbers = await _context.MMM_AutoPRTbl
                                          .Where(a => a.BalQtyAutoPr != 0)
                                          .Select(a => new PRNumberDto
                                          {
                                              Value = a.PRNo,
                                              Text = a.PRNo
                                          })
                                          .Distinct()
                                          .ToListAsync();
            }
            else
            {
                return BadRequest("Invalid PR Type. Allowed values: Manual, Auto.");
            }

            return Ok(prNumbers);
        }


        [HttpGet("GetPRItemDetails")]
        public IActionResult GetPRItemDetails(
     string prNo,
     string prType,
     string itemName = null,
     string specification = null)
        {
            // ==============================
            // MANUAL PR
            // ==============================
            if (prType == "Manual")
            {
                var query = from i in _context.MMM_PrItemTbl
                            join p in _context.MMM_PurchaseReqTbl on i.Id equals p.Id
                            where p.PurchaseReqNo == prNo && i.BalQty != 0
                            select i;

                // 🔹 1️⃣ PR selected → Item list
                if (itemName == null)
                {
                    return Ok(query
                        .Select(x => x.ItemName)
                        .Distinct()
                        .ToList());
                }

                // 🔹 2️⃣ Item selected → Specification list
                if (specification == null)
                {
                    var specs = query
                        .Where(x => x.ItemName == itemName)
                        .AsEnumerable()
                        .SelectMany(x => x.Grade.Split(','))
                        .Select(x => x.Trim())
                        .Distinct()
                        .ToList();

                    return Ok(specs);
                }

                // 🔹 3️⃣ Item + Specification → Full details
                var result = query.FirstOrDefault(x =>
                    x.ItemName == itemName &&
                    x.Grade == specification);

                if (result == null) return Ok(null);

                return Ok(new PRItemDetailDto
                {
                    ItemName = result.ItemName,
                    Specification = result.Grade,
                    ItemCode = result.ItemCode,
                    UOM = result.UOM,
                    CurrencyCode = result.Currency,
                    TargetPrice = result.AvgPrice,
                    ReqQty = result.BalQty
                });
            }

            // ==============================
            // AUTO PR
            // ==============================
            if (prType == "Auto")
            {
                var query = _context.MMM_AutoPRTbl
                    .Where(x => x.PRNo == prNo && x.BalQtyAutoPr != 0);

                // 🔹 1️⃣ PR selected → Item list
                if (itemName == null)
                {
                    return Ok(query
                        .Select(x => x.Item_Name)
                        .Distinct()
                        .ToList());
                }

                // 🔹 2️⃣ Item selected → Specification list
                if (specification == null)
                {
                    var specs = query
                        .Where(x => x.Item_Name == itemName)
                        .AsEnumerable()
                        .SelectMany(x => x.Grade.Split(','))
                        .Select(x => x.Trim())
                        .Distinct()
                        .ToList();

                    return Ok(specs);
                }

                // 🔹 3️⃣ Item + Specification → Full details
                var result = query.FirstOrDefault(x =>
                    x.Item_Name == itemName &&
                    x.Grade == specification);

                if (result == null) return Ok(null);

                return Ok(new PRItemDetailDto
                {
                    ItemName = result.Item_Name,
                    Specification = result.Grade,
                    ItemCode = result.Item_Code,
                    UOM = result.Unit_Of_Measurement,
                    CurrencyCode = result.Currency,
                    TargetPrice = decimal.TryParse(result.Avg_Price, out var price)
                ? price
                : (decimal?)null,

                    ReqQty = result.BalQtyAutoPr
                });
            }

            return BadRequest("Invalid PR Type");
        }

    }

    public class PRNumberDto
        {
            public string Value { get; set; }
            public string Text { get; set; }
        }
    public class PRItemDetailDto
    {
        public string ItemName { get; set; }
        public string Specification { get; set; } // Grade
        public string ItemCode { get; set; }
        public string UOM { get; set; }
        public string CurrencyCode { get; set; }
        public decimal? TargetPrice { get; set; }
        public decimal? ReqQty { get; set; }
    }
}


