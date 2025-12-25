using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models;
using System.Globalization;

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

        private DateTime? ConvertToDate(string dateString)
        {
            if (string.IsNullOrWhiteSpace(dateString))
                return null;

                    DateTime parsedDate;
                    string[] formats =
                    {
                "yyyy-MM-dd",
                "dd/MM/yyyy",
                "MM/dd/yyyy",
                "yyyy-MM-ddTHH:mm:ss.fffZ"
            };

            if (DateTime.TryParseExact(
                dateString,
                formats,
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out parsedDate))
            {
                return parsedDate;
            }

            if (DateTime.TryParse(dateString, out parsedDate))
                return parsedDate;

            return null;
        }

        [HttpPost("SaveCOARows")]
        public JsonResult SaveCOARows([FromBody] List<COARecordDTO> records)
        {
            try
            {
                if (records == null || records.Count == 0)
                    return Json(new { success = false, message = "No COA records received" });

                foreach (var dto in records)
                {
                    var entity = new PQM_FinishProdCOATbl
                    {
                        PlanId = dto.PlanId,
                        ProdPlanDate = dto.ProdPlanDate,
                        PlanDate = dto.PlanDate,
                        BuyerName = dto.BuyerName,
                        SONo = dto.SONo,
                        ItemName = dto.ItemName,
                        ItemCode = dto.ItemCode,
                        Grade = dto.Grade,
                        MachineNo = dto.MachineNo,
                        OperatorName = dto.OperatorName,
                        Shift = dto.Shift,
                        BatchNo = dto.BatchNo,
                        PlanQty = dto.PlanQty,
                        ActualQty = dto.ActualQty,
                        Width = dto.Width,
                        Length = dto.Length,
                        Thickness = dto.Thickness,
                        Height = dto.Height,
                        PartNumber = dto.PartNumber,
                        Weight = dto.Weight,
                        WeightperCover = dto.WeightperCover,
                        PrintingQuality = dto.PrintingQuality,
                        Color = dto.Color,
                        VciTest = dto.VciTest,
                        Dust = dto.Dust,
                        Remark = dto.Remark,
                        MoistureFree = dto.MoistureFree,
                        IsSubmitted = true,
                        CreatedDate = DateTime.Now
                    };

                    _context.PQM_FinishProdCOATbl.Add(entity);
                }

                _context.SaveChanges();

                return Json(new { success = true, message = "COA saved successfully" });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = ex.InnerException?.Message ?? ex.Message
                });
            }

        }

        [HttpGet("CheckButton")]
        public IActionResult CheckButton()
        {
            var submittedPlans = _context.PQM_FinishProdCOATbl
                .Where(x => x.IsSubmitted == true)
                .Select(x => x.PlanId)
                .Distinct()
                .ToList();

            return Json(new
            {
                success = true,
                submitted = submittedPlans
            });
        }

        [HttpGet("GetInwardQCRecords")]
        public async Task<IActionResult> GetInwardQCRecords()
        {
            var data = await (from g in _context.MMM_GRNTbl
                              join gp in _context.MMM_GRNProductTbl
                              on g.Id equals gp.G_Id
                              where gp.Rejected_Qty == null
                                 && gp.QtyTobeRepaired == null
                                 && gp.Received_Qty != null
                              select new InwardQCViewModel
                              {
                                  Id = g.Id,
                                  GRN_NO = g.GRN_NO,
                                  GRN_Date = g.GRN_Date.HasValue ? g.GRN_Date.Value.ToDateTime(TimeOnly.MinValue) : (DateTime?)null,
                                  Supplier_Name = g.Supplier_Name,
                                  Invoice_NO = g.Invoice_NO,
                                  Invoice_Date = g.Invoice_Date.HasValue ? g.Invoice_Date.Value.ToDateTime(TimeOnly.MinValue) : (DateTime?)null,
                                  PO_No = gp.PO_No,
                                  Purchase_Date = gp.Purchase_Date,
                                  Item_Name = gp.Item_Name,
                                  Item_Descrpition = gp.Item_Descrpition,
                                  UOM = gp.UOM,
                                  Challan_Qty = gp.Challan_Qty,
                                  Received_Qty = gp.Received_Qty,
                                  Rejected_Qty = gp.Rejected_Qty,
                                  QtyTobeRepaired = gp.QtyTobeRepaired,
                                  G_Product_Id = gp.G_Product_Id
                              }).ToListAsync();


            return Ok(data);
        }

        [HttpPost("SubmitInwardQC")]
        public JsonResult SubmitInwardQC(int productId, decimal? rejectedQty, decimal? holdQty)
        {
            try
            {
                using (SwamiSamarthDbContext db = new SwamiSamarthDbContext())
                {
                    var product = db.MMM_GRNProductTbl
                        .FirstOrDefault(p => p.G_Product_Id == productId);

                    if (product == null)
                    {
                        return Json(new
                        {
                            success = false,
                            message = "Product not found."
                        });
                    }

                    // 2. Validation
                    if (!rejectedQty.HasValue || !holdQty.HasValue)
                    {
                        return Json(new
                        {
                            success = false,
                            message = "Rejected Qty and Hold Qty are required."
                        });
                    }

                    // 3. Update Product QC fields
                    product.Rejected_Qty = rejectedQty.Value.ToString();
                    product.QtyTobeRepaired = (int)holdQty.Value;
                    product.IsSubmitted = true;

                    // 4. Update GRN QC clearance date
                    var grn = db.MMM_GRNTbl.FirstOrDefault(g => g.Id == product.G_Id);
                    if (grn != null)
                    {
                        grn.QC_Clearance_Date = DateOnly.FromDateTime(DateTime.Today);
                    }

                    // 5. Save
                    db.SaveChanges();

                    return Json(new
                    {
                        success = true,
                        message = "QC submitted successfully!"
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    success = false,
                    message = "Error: " + ex.Message
                });
            }
        }

        [HttpGet("GetSemiFinPlanReport")]
        public async Task<IActionResult> GetSemiFinPlanReport()
        {
            var data = await (from sf in _context.PQM_SemiFinProdTbl
                              join tfp in _context.PQM_TodaysSemiFinPlanTbl
                              on sf.CustProdId equals tfp.CustProdId
                              where tfp.RejectionQty == null && tfp.ActualQty != null
                              select new SemiFinPlanViewModel
                              {
                                  CustProdId = sf.CustProdId,
                                  BuyerName = sf.BuyerName,
                                  SONumber = sf.SONumber,
                                  SemiFinishItemName = sf.ItemName,
                                  SemiFinishGrade = sf.Grade,
                                  FinishItemName = sf.FinishItemName,
                                  FinishGrade = sf.FinishGrade,
                                  PlanCode = sf.PlanCode,
                                  Date = sf.Date.HasValue ? sf.Date.Value.ToDateTime(TimeOnly.MinValue) : (DateTime?)null,

                                  PlanId = tfp.PlanId,
                                  Location = tfp.Location,
                                  MachineName = tfp.MachineName,
                                  MachineNumber = tfp.MachineNumber,
                                  MachineCap = tfp.MachineCap,
                                  PlanDate = tfp.PlanDate.HasValue ? tfp.PlanDate.Value.ToDateTime(TimeOnly.MinValue) : (DateTime?)null,
                                  Shift = tfp.Shift,
                                  OpName = tfp.OpName,
                                  BatchNo = tfp.BatchNo,
                                  PlanQty = tfp.PlanQty,
                                  ActualQty = tfp.ActualQty,
                                  RejectionQty = tfp.RejectionQty,
                                  QtyToWH = tfp.QtyToWH
                              }).ToListAsync();

            return Ok(data);
        }

        [HttpPost("SaveSemiFinRejectionQty")]
        public async Task<IActionResult> SaveSemiFinRejectionQty([FromBody] List<SemiFinPlanViewModel> productionData)
        {
            if (productionData == null || !productionData.Any())
            {
                return BadRequest(new { success = false, message = "No data received!" });
            }

            try
            {
                foreach (var item in productionData)
                {
                    var existingPlan = await _context.PQM_TodaysSemiFinPlanTbl
                        .FirstOrDefaultAsync(p => p.PlanId == item.PlanId);

                    if (existingPlan != null)
                    {
                        decimal rejectionQty = item.RejectionQty ?? 0;
                        decimal qtyToWH = item.QtyToWH ?? 0;

                        existingPlan.RejectionQty = rejectionQty;
                        existingPlan.QtyToWH = qtyToWH;

                        var semiFinRecord = await _context.PQM_SemiFinProdTbl
                            .FirstOrDefaultAsync(s => s.CustProdId == existingPlan.CustProdId);

                        if (semiFinRecord != null)
                        {
                            semiFinRecord.TotalRejectionQty = (semiFinRecord.TotalRejectionQty ?? 0) + rejectionQty;
                            semiFinRecord.TotalWHQty = (semiFinRecord.TotalWHQty ?? 0) + qtyToWH;
                        }
                    }
                }

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Data saved successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

    }
}





























