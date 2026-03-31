using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models;
using SwamiSamarthSyn8.Models.DTOs;
using SwamiSamarthSyn8.Models.Masters;
using System.Security.Claims;



namespace SwamiSamarthSyn8.Controllers.Masters
{

    [ApiController]
    [Route("api/[controller]")]
    public class VendorController : Controller
    {
        private readonly MsmeERPDbContext _context;

        public VendorController(MsmeERPDbContext context)
        {
            _context = context;

        }

        [HttpGet("GetVendorCategories")]
        public async Task<IActionResult> GetVendorCategories()
        {
            var list = await _context.Master_ItemVendorCategory
                .Where(x => x.ItemVendorCatCode == 2 && x.IsActive == true)
                .ToListAsync();

            return Ok(list);
        }


        [HttpGet("GetPaymentTerms")]
        public async Task<IActionResult> GetPaymentTerms()
        {
            var terms = await _context.Master_PaymentTerms
                .Where(x => x.IsActive == true)
                .Select(x => new
                {
                    x.PaymentTermsId,
                    x.PaymentTerms
                })
                .ToListAsync();

            return Ok(terms);
        }

        [HttpGet("GetDeliveryTerms")]
        public async Task<IActionResult> GetDeliveryTerms()
        {
            var terms = await _context.Master_PriceBasis
                .Where(x => x.IsActive == true)
                .Select(x => new
                {
                    x.PriceBasisId,
                    x.PriceBasis
                })
                .ToListAsync();

            return Ok(terms);
        }

        [HttpGet("GetIndusCatSubcat")]
        public IActionResult GetIndusCatSubcat(int? industryId, int? categoryId)
        {
            if (industryId == null)
            {
                var industries = _context.Master_Industry
                    .Where(x => x.IsActive)
                    .Select(x => new
                    {
                        x.IndustryId,
                        x.IndustryName
                    })
                    .ToList();

                return Ok(industries);
            }

            if (industryId != null && categoryId == null)
            {
                var categories = _context.Master_Category
                    .Where(x => x.IndustryId == industryId && x.IsActive)
                    .Select(x => new
                    {
                        x.CategoryId,
                        x.CategoryName
                    })
                    .ToList();

                return Ok(categories);
            }
            var subcategories = _context.Master_Subcategory
                .Where(x => x.CategoryId == categoryId && x.IsActive)
                .Select(x => new
                {
                    x.SubcategoryId,
                    x.SubcategoryName
                })
                .ToList();

            return Ok(subcategories);
        }

        [HttpGet("GenerateVendorCode")]
        public IActionResult GenerateVendorCode(
          string? industry,
          string? category,
          string? subCategory,
          string? source,
          string? continent,
          string? country,
          string? state,
          string? city)
            {
            try
            {
                int industryId = _context.Master_Industry
                    .Where(x => x.IndustryName == industry)
                    .Select(x => x.IndustryId)
                    .FirstOrDefault();

                int categoryId = _context.Master_Category
                    .Where(x => x.CategoryName == category && x.IndustryId == industryId)
                    .Select(x => x.CategoryId)
                    .FirstOrDefault();

                string subCategoryCode = _context.Master_Subcategory
                    .Where(x => x.SubcategoryName == subCategory && x.CategoryId == categoryId)
                    .Select(x => x.sub_Code)
                    .FirstOrDefault() ?? "00";

                int sourceId = _context.Master_Source
                    .Where(x => x.src_name == source)
                    .Select(x => x.src_id)
                    .FirstOrDefault();

                int continentId = _context.Master_Continent
                     .Where(x => x.conti_name == continent)
                     .Select(x => x.Continent_number)
                     .FirstOrDefault() ?? 0;

                int countryId = _context.Master_Country
                    .Where(x => x.country_name == country)
                    .Select(x => x.country_number)
                    .FirstOrDefault() ?? 0;

                int stateId = _context.Master_State
                    .Where(x => x.state_name == state)
                    .Select(x => x.state_number)
                    .FirstOrDefault() ?? 0;

                int cityId = _context.Master_City
                    .Where(x => x.city_name == city)
                    .Select(x => x.city_number)
                    .FirstOrDefault() ?? 0;

                string prefix = $"{sourceId}{continentId}{countryId:D2}{stateId:D2}{cityId:D2}{subCategoryCode}";

                int nextNumber = _context.Master_Vendor
                    .Where(x => x.VendorCode.StartsWith(prefix))
                    .Select(x => x.VendorCode)
                    .AsEnumerable()
                    .Select(code =>
                    {
                        if (string.IsNullOrEmpty(code) || code.Length <= prefix.Length)
                            return 0;

                        return int.TryParse(code.Substring(prefix.Length), out int num) ? num : 0;
                    })
                    .DefaultIfEmpty(0)
                    .Max() + 1;

                string vendorCode = prefix + nextNumber.ToString("D2");

                return Ok(new { VendorCode = vendorCode });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

     

        [HttpGet("GetVendorList")]
        public async Task<IActionResult> GetVendorList(int page = 1, int pageSize = 10)
        {
            // 1️⃣ Base Query (NO filter → ALL vendors)
            var baseQuery = from v in _context.Master_Vendor

                            join vc in _context.Master_ItemVendorCategory
                            on v.VendorCategoryId equals vc.ItemVendorCategoryId into vcat
                            from vc in vcat.DefaultIfEmpty()

                            join i in _context.Master_Industry
                            on v.IndustryId equals i.IndustryId into ind
                            from i in ind.DefaultIfEmpty()

                            join c in _context.Master_Category
                            on v.CategoryId equals c.CategoryId into cat
                            from c in cat.DefaultIfEmpty()

                            join s in _context.Master_Subcategory
                            on v.SubCategoryId equals s.SubcategoryId into sub
                            from s in sub.DefaultIfEmpty()

                            join p in _context.Master_PaymentTerms
                            on v.PaymentTermsId equals p.PaymentTermsId into pay
                            from p in pay.DefaultIfEmpty()

                            join d in _context.Master_PriceBasis
                            on v.DeliveryTermsid equals d.PriceBasisId into del
                            from d in del.DefaultIfEmpty()

                            select new
                            {
                                v.VendorId,
                                v.VendorCode,
                                v.ManualVendorCode,
                                v.VendorName,
                                v.GSTNo,
                                v.ContactPerson,
                                v.ContactNo,
                                v.Email,
                                v.IsActive,

                                VendorCategoryName = vc != null ? vc.ItemVendorCategory : "",
                                IndustryName = i != null ? i.IndustryName : "",
                                CategoryName = c != null ? c.CategoryName : "",
                                SubCategoryName = s != null ? s.SubcategoryName : "",
                                PaymentTermsName = p != null ? p.PaymentTerms : "",
                                DeliveryTermsName = d != null ? d.PriceBasis : ""
                            };

            // 2️⃣ Total Counts (VERY IMPORTANT 🔥)
            var totalCount = await baseQuery.CountAsync();
            var activeCount = await baseQuery.CountAsync(x => x.IsActive);
            var inactiveCount = await baseQuery.CountAsync(x => !x.IsActive);

            // 3️⃣ Pagination (NO IsActive sorting → mix records)
            var pagedData = await baseQuery
                .OrderByDescending(x => x.VendorId) // ✅ IMPORTANT CHANGE
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var vendorIds = pagedData.Select(v => v.VendorId).ToList();

            // 4️⃣ ONLY ACTIVE addresses
            var addresses = await _context.Master_VendorAddresses
                .Where(a => vendorIds.Contains(a.VendorId) && a.IsActive)
                .ToListAsync();

            // 5️⃣ ONLY ACTIVE bank details
            var bankDetails = await _context.Master_VendorBankDetails
                .Where(b => vendorIds.Contains(b.VendorId) && b.IsActive)
                .ToListAsync();

            // 6️⃣ Final Mapping
            var result = pagedData.Select(v => new
            {
                v.VendorId,
                v.VendorCode,
                v.ManualVendorCode,
                v.VendorName,
                v.GSTNo,
                v.ContactPerson,
                v.ContactNo,
                v.Email,
                v.IsActive,

                v.VendorCategoryName,
                v.IndustryName,
                v.CategoryName,
                v.SubCategoryName,
                v.PaymentTermsName,
                v.DeliveryTermsName,

                Addresses = addresses
                    .Where(a => a.VendorId == v.VendorId)
                    .Select(a => new
                    {
                        a.Address1,
                        a.Address2,
                        a.Pincode
                    })
                    .ToList(),

                BankList = bankDetails
                    .Where(b => b.VendorId == v.VendorId)
                    .Select(b => new
                    {
                        currentAccountNo = b.CurrentAccountNo,
                        bankName = b.BankName,
                        branchName = b.BranchName,
                        ifscCode = b.IFSCCode
                    })
                    .ToList()
            }).ToList();

            // 7️⃣ Final Response
            return Ok(new
            {
                data = result,
                totalCount = totalCount,
                activeCount = activeCount,     // ✅ NEW
                inactiveCount = inactiveCount, // ✅ NEW
                page = page,
                pageSize = pageSize
            });
        }


        [HttpDelete("DeleteVendor/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteVendor(int id)
        {
            try
            {
                var username = User.FindFirst(ClaimTypes.Name)?.Value;
                var empCode = User.FindFirst("EmpCode")?.Value;

                if (string.IsNullOrEmpty(username))
                    return Unauthorized(new { success = false, message = "User not authenticated" });

                var user = await _context.HRM_User
                    .FirstOrDefaultAsync(u => u.UserName == username || u.Emp_Code == empCode);

                if (user == null)
                    return Unauthorized(new { success = false, message = "User not found" });

                var vendor = await _context.Master_Vendor.FindAsync(id);
                if (vendor == null)
                    return NotFound(new { success = false, message = "Vendor not found" });

                if (!vendor.IsActive)
                    return BadRequest(new { success = false, message = "Vendor already deleted" });

                vendor.IsActive = false;
                vendor.DeletedBy = user.UserId;   
                vendor.DeletedDate = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Vendor deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        [HttpPut("ReactivateVendor/{id}")]
        [Authorize]
        public async Task<IActionResult> ReactivateVendor(int id)
        {
            try
            {
                var username = User.FindFirst(ClaimTypes.Name)?.Value;
                var empCode = User.FindFirst("EmpCode")?.Value;

                if (string.IsNullOrEmpty(username))
                    return Unauthorized(new { success = false, message = "User not authenticated" });

                var user = await _context.HRM_User
                    .FirstOrDefaultAsync(u => u.UserName == username || u.Emp_Code == empCode);

                if (user == null)
                    return Unauthorized(new { success = false, message = "User not found" });

                var vendor = await _context.Master_Vendor.FindAsync(id);
                if (vendor == null)
                    return NotFound(new { success = false, message = "Vendor not found" });

                if (vendor.IsActive)
                    return BadRequest(new { success = false, message = "Vendor already active" });

                vendor.IsActive = true;
                vendor.DeletedBy = null; 
                vendor.DeletedDate = null;

                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "Vendor re-activated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }


     
        [HttpPost("SaveOrUpdateVendor")]
        [Authorize]
        public async Task<IActionResult> SaveOrUpdateVendor([FromBody] VendorSaveRequest request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var usernameClaim = User.FindFirst(ClaimTypes.Name);
                var empCodeClaim = User.FindFirst("EmpCode");

                if (usernameClaim == null)
                    return Unauthorized(new { success = false, message = "User not authenticated." });

                string username = usernameClaim.Value;
                string empCode = empCodeClaim?.Value ?? "";

                var user = await _context.HRM_User
                    .FirstOrDefaultAsync(u => u.UserName == username || u.Emp_Code == empCode);

                if (user == null)
                    return Unauthorized(new { success = false, message = "User not found." });

                int loggedInUserId = user.UserId;

                bool isUpdate = request.Vendor.VendorId > 0;
                Master_Vendor vendor;

                if (isUpdate)
                {
                    // ================= UPDATE =================
                    vendor = await _context.Master_Vendor
                        .FirstOrDefaultAsync(v => v.VendorId == request.Vendor.VendorId);

                    if (vendor == null)
                        return NotFound(new { success = false, message = "Vendor not found." });

                    vendor.VendorCategoryId = request.Vendor.VendorCategoryId;
                    vendor.IndustryId = request.Vendor.IndustryId;
                    vendor.CategoryId = request.Vendor.CategoryId;
                    vendor.SubCategoryId = request.Vendor.SubCategoryId;
                    vendor.SourceId = request.Vendor.SourceId;

                    vendor.VendorCode = request.Vendor.VendorCode;
                    vendor.ManualVendorCode = request.Vendor.ManualVendorCode;
                    vendor.VendorName = request.Vendor.VendorName;

                    vendor.ContactPerson = request.Vendor.ContactPerson;
                    vendor.ContactNo = request.Vendor.ContactNo;
                    vendor.Email = request.Vendor.Email;
                    vendor.LandlineNo = request.Vendor.LandlineNo;

                    vendor.GSTNo = request.Vendor.GSTNo;
                    vendor.PanNo = request.Vendor.PanNo;
                    vendor.MSMENo = request.Vendor.MSMENo;
                    vendor.CINNo = request.Vendor.CINNo;

                    vendor.StateCode = request.Vendor.StateCode;
                    vendor.Website = request.Vendor.Website;

                    vendor.PaymentTermsId = request.Vendor.PaymentTermsId;
                    vendor.DeliveryTermsid = request.Vendor.DeliveryTermsid;

                    vendor.STDPaymentDays = request.Vendor.STDPaymentDays;
                    vendor.LedgerId = request.Vendor.LedgerId;
                    vendor.GLCode = request.Vendor.GLCode;

                    vendor.BajajVendor = request.Vendor.BajajVendor;

                    vendor.UpdatedBy = loggedInUserId;
                    vendor.UpdatedDate = DateTime.Now;

                    // ================= ADDRESS SOFT DELETE =================
                    var existingAddresses = await _context.Master_VendorAddresses
                        .Where(a => a.VendorId == vendor.VendorId)
                        .ToListAsync();

                    foreach (var oldAddr in existingAddresses)
                    {
                        oldAddr.IsActive = false;
                    }

                    if (request.Addresses?.Any() == true)
                    {
                        foreach (var addr in request.Addresses)
                        {
                            if (addr.VendorAddressId > 0)
                            {
                                var existing = existingAddresses
                                    .FirstOrDefault(a => a.VendorAddressId == addr.VendorAddressId);

                                if (existing != null)
                                {
                                    existing.Address1 = addr.Address1;
                                    existing.Address2 = addr.Address2;
                                    existing.Pincode = addr.Pincode;
                                    existing.ContinentId = addr.ContinentId;
                                    existing.CountryId = addr.CountryId;
                                    existing.StateId = addr.StateId;
                                    existing.CityId = addr.CityId;
                                    existing.Zone = addr.Zone;
                                    existing.IsActive = true;
                                }
                            }
                            else
                            {
                                addr.VendorId = vendor.VendorId;
                                addr.IsActive = true;
                                _context.Master_VendorAddresses.Add(addr);
                            }
                        }
                    }

                    // ================= BANK SOFT DELETE =================
                    var existingBanks = await _context.Master_VendorBankDetails
                        .Where(b => b.VendorId == vendor.VendorId)
                        .ToListAsync();

                    foreach (var oldBank in existingBanks)
                    {
                        oldBank.IsActive = false;
                    }

                    if (request.BankDetails?.Any() == true)
                    {
                        foreach (var bank in request.BankDetails)
                        {
                            if (bank.VendorbankDetailsId > 0)
                            {
                                var existing = existingBanks
                                    .FirstOrDefault(b => b.VendorbankDetailsId == bank.VendorbankDetailsId);

                                if (existing != null)
                                {
                                    existing.CurrentAccountNo = bank.CurrentAccountNo;
                                    existing.BankName = bank.BankName;
                                    existing.BranchName = bank.BranchName;
                                    existing.IFSCCode = bank.IFSCCode;
                                    existing.IsActive = true;
                                }
                            }
                            else
                            {
                                bank.VendorId = vendor.VendorId;
                                bank.IsActive = true;
                                _context.Master_VendorBankDetails.Add(bank);
                            }
                        }
                    }
                }
                else
                {
                    // ================= CREATE =================
                    bool exists = await _context.Master_Vendor.AnyAsync(v =>
                        v.VendorName.Trim().ToUpper() == request.Vendor.VendorName.Trim().ToUpper()
                        && v.GSTNo.Trim().ToUpper() == request.Vendor.GSTNo.Trim().ToUpper()
                    );

                    if (exists)
                        return BadRequest(new { success = false, message = "Vendor already exists." });

                    request.Vendor.CreatedDate = DateTime.Now;
                    request.Vendor.CreatedBy = loggedInUserId;
                    request.Vendor.IsActive = true;

                    _context.Master_Vendor.Add(request.Vendor);
                    await _context.SaveChangesAsync();

                    int newVendorId = request.Vendor.VendorId;

                    if (request.Addresses?.Any() == true)
                    {
                        foreach (var addr in request.Addresses)
                        {
                            addr.VendorId = newVendorId;
                            addr.IsActive = true;
                            _context.Master_VendorAddresses.Add(addr);
                        }
                    }

                    if (request.BankDetails?.Any() == true)
                    {
                        foreach (var bank in request.BankDetails)
                        {
                            bank.VendorId = newVendorId;
                            bank.IsActive = true;
                            _context.Master_VendorBankDetails.Add(bank);
                        }
                    }
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new
                {
                    success = true,
                    message = isUpdate ? "Vendor updated successfully" : "Vendor created successfully"
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.InnerException?.Message ?? ex.Message
                });
            }
        }
       
        [HttpGet("GetVendorById/{id}")]
        public async Task<IActionResult> GetVendorById(int id)
        {
            var vendor = await _context.Master_Vendor
                .Where(v => v.VendorId == id)
                .Select(v => new
                {
                    v.VendorId,
                    v.VendorCategoryId,
                    v.IndustryId,
                    v.CategoryId,
                    v.SubCategoryId,
                    v.SourceId,
                    v.VendorCode,
                    v.ManualVendorCode,
                    v.VendorName,
                    v.PaymentTermsId,
                    v.DeliveryTermsid,
                    v.ContactPerson,
                    v.Email,
                    v.ContactNo,
                    v.LandlineNo,
                    v.GSTNo,
                    v.Website,
                    v.GLCode,
                    v.CINNo,
                    v.PanNo,
                    v.MSMENo,
                    v.StateCode,
                    v.STDPaymentDays,
                    v.BajajVendor,
                    v.LedgerId,
                    v.IsActive
                })
                .FirstOrDefaultAsync();

            if (vendor == null)
                return NotFound(new { success = false });

            var source = await _context.Master_Source
                .Where(s => s.src_id == vendor.SourceId)
                .Select(s => new
                {
                    sourceId = s.src_id,
                    sourceName = s.src_name
                })
                .FirstOrDefaultAsync();

            var addresses = await (
                from a in _context.Master_VendorAddresses

                join cont in _context.Master_Continent
                    on a.ContinentId equals cont.conti_id into contJoin
                from cont in contJoin.DefaultIfEmpty()

                join country in _context.Master_Country
                    on a.CountryId equals country.country_id into countryJoin
                from country in countryJoin.DefaultIfEmpty()

                join state in _context.Master_State
                    on a.StateId equals state.state_id into stateJoin
                from state in stateJoin.DefaultIfEmpty()

                join city in _context.Master_City
                    on a.CityId equals city.city_id into cityJoin
                from city in cityJoin.DefaultIfEmpty()

                where a.VendorId == id && a.IsActive == true  

                select new
                {
                    a.VendorAddressId,
                    address1 = a.Address1,
                    address2 = a.Address2,
                    pincode = a.Pincode,
                    zone = a.Zone,

                    continentId = a.ContinentId,
                    continentName = cont != null ? cont.conti_name : "",

                    countryId = a.CountryId,
                    countryName = country != null ? country.country_name : "",

                    stateId = a.StateId,
                    stateName = state != null ? state.state_name : "",

                    cityId = a.CityId,
                    cityName = city != null ? city.city_name : ""
                }
            ).ToListAsync();

            var bankDetails = await _context.Master_VendorBankDetails
                .Where(b => b.VendorId == id && b.IsActive == true) 
                .Select(b => new
                {
                    b.VendorbankDetailsId,
                    b.CurrentAccountNo,
                    b.BankName,
                    b.BranchName,
                    b.IFSCCode,
                    b.IsActive
                })
                .ToListAsync();

            return Ok(new
            {
                success = true,
                vendor,
                source,
                addresses,
                bankDetails
            });
        }
    }

}

