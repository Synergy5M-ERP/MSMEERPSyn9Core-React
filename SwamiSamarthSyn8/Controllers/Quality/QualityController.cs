using Microsoft.AspNetCore.Mvc;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models;

namespace SwamiSamarthSyn8.Controllers.Quality
{
    [Route("api/")]
    [ApiController]
    public class QualityController : Controller
    {

        private readonly SwamiSamarthDbContext _context;
        public QualityController(SwamiSamarthDbContext context)
        {
            _context = context;
        }
  
        [HttpGet("OutwardQCReport")]
        public IActionResult OutwardQCReport()
        {
            var custFinList = _context.PQM_CustFinProdTbl
                .Select(c => new
                {
                    c.CustFinProdId,
                    c.BuyerName,
                    c.SONumber,
                    c.ItemName,
                    c.Grade,
                    c.MachineNumber,
                    c.ItemCode
                })
                .ToList();

            var todaysPlanList =
                (from plan in _context.PQM_TodaysFinPlanTbl
                 join prodPlan in _context.PQM_CustFinProdTbl
                    on plan.CustFinProdId equals prodPlan.CustFinProdId into prodPlanJoin
                 from prodPlan in prodPlanJoin.DefaultIfEmpty()
                 where plan.ActualQty != null
                 select new
                 {
                     plan.PlanId,
                     plan.CustFinProdId,
                     plan.PlanDate,
                     plan.Shift,
                     plan.OpName,
                     plan.BatchNo,
                     plan.PlanQty,
                     plan.ActualQty,
                     plan.RejectionQty,
                     plan.QtyToWH,
                     Date = prodPlan.Date
                 })
                 .ToList();

            var result = custFinList
                .Select(c => new
                {
                    c.CustFinProdId,
                    c.BuyerName,
                    c.SONumber,
                    c.ItemName,
                    c.Grade,
                    c.MachineNumber,
                    c.ItemCode,
                    PlanDetails = todaysPlanList
                        .Where(p => p.CustFinProdId == c.CustFinProdId)
                        .Select(p => new
                        {
                            p.PlanId,
                            p.PlanDate,
                            p.Shift,
                            p.OpName,
                            p.BatchNo,
                            p.PlanQty,
                            p.ActualQty,
                            p.RejectionQty,
                            p.QtyToWH,
                            p.Date
                        })
                        .ToList()
                })
                .Where(x => x.PlanDetails.Any())
                .ToList();

            return Ok(result);
        }

        [HttpPost("SaveRejectionQty") ]
        public IActionResult SaveRejectionQty([FromBody] ProductionSubmitDto payload)
        {
            try
            {
                if (payload?.ProductionData == null || !payload.ProductionData.Any())
                    return Json(new { success = false, message = "No data received." });

                if (!DateTime.TryParse(payload.PlanDate, out DateTime parsedPlanDate))
                    return Json(new { success = false, message = "Invalid Production Plan Date format." });

                using (var _context = new SwamiSamarthDbContext())
                {
                    decimal totalRejectionQty = 0;
                    decimal totalQtyToWH = 0;

                    foreach (var prod in payload.ProductionData)
                    {
                        var existingPlan = _context.PQM_TodaysFinPlanTbl
                            .FirstOrDefault(p => p.PlanId == prod.PlanId && p.Shift == prod.Shift);

                        if (existingPlan != null)
                        {
                            if (existingPlan.ActualQty == null || existingPlan.ActualQty <= 0)
                                return Json(new { alert = "Actual production quantity is pending!" });

                            existingPlan.RejectionQty = prod.RejectionQty;
                            existingPlan.QtyToWH = prod.QtyToWH;

                            // Mark as rejected

                            // ✅ Mark as submitted
                            existingPlan.IsRejectedSubmitted = true;

                            totalRejectionQty += prod.RejectionQty ?? 0;
                            totalQtyToWH += prod.QtyToWH ?? 0;
                        }
                    }


                    // Update customer totals
                    var custIds = payload.ProductionData.Select(p => p.CustFinProdId).Distinct().ToList();
                    var custProdList = _context.PQM_CustFinProdTbl
                                           .Where(c => custIds.Contains(c.CustFinProdId))
                                           .ToList();

                    foreach (var cust in custProdList)
                    {
                        cust.TotalRejectionQty = totalRejectionQty;
                        cust.TotalWHQty = totalQtyToWH;
                    }

                    _context.SaveChanges();

                    return Json(new { success = true });
                }
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }


        [HttpGet("SubmitButtonDisable")]
        public IActionResult SubmitButtonDisable()
        {
            try
            {
                var submittedPlans = _context.PQM_TodaysFinPlanTbl
                    .Where(x => x.IsRejectedSubmitted == true)
                    .Select(x => x.PlanId)
                    .Distinct()
                    .ToList();

                return Json(new
                {
                    success = true,
                    submitted = submittedPlans
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

    }
}


