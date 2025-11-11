using Microsoft.AspNetCore.Mvc;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models;
using System.Linq;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

namespace SwamiSamarthSyn8.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly SwamiSamarthDbContext _context;

        public AccountController(SwamiSamarthDbContext context)
        {
            _context = context;
        }


        [HttpGet("Hello")]
        public IActionResult Hello()
        {
            return Ok(new
            {
                success = true,
                message = "✅ API is running fine on Azure!",
                serverTime = DateTime.UtcNow
            });
        }

        [HttpGet("CheckDb")]
        public IActionResult CheckDb()
        {
            try
            {
                var connection = _context.Database.GetDbConnection().ConnectionString;
                var total = _context.AccountType.Count();
                return Ok(new { connectedTo = connection, totalAccountTypes = total });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }

        // ---------------- ACCOUNT TYPE ----------------
        [HttpGet("AccountType")]
        public IActionResult GetAllAccountTypes([FromQuery] bool? isActive)
        {
            var query = _context.AccountType.AsQueryable();
            if (isActive.HasValue)
                query = query.Where(x => x.IsActive == isActive.Value);

            return Ok(query.ToList());
        }

        [HttpPost("AccountType")]
        public IActionResult CreateAccountType([FromBody] AccountType accountType)
        {
            if (accountType == null) return BadRequest();
            accountType.IsActive = true;
            _context.AccountType.Add(accountType);
            _context.SaveChanges();
            return Ok(accountType);
        }

        [HttpPut("AccountType/{id}")]
        public IActionResult UpdateAccountType(int id, [FromBody] JsonElement body)
        {
            var existing = _context.AccountType.Find(id);
            if (existing == null)
                return NotFound();

            // ✅ Case 1: Only IsActive toggle (Activate / Deactivate)
            if (body.TryGetProperty("isActive", out var isActiveProp) && body.EnumerateObject().Count() == 1)
            {
                existing.IsActive = isActiveProp.GetBoolean();
                _context.Entry(existing).State = EntityState.Modified;
                _context.SaveChanges();
                return Ok(existing);
            }

            // ✅ Case 2: Full update (edit form)
            var updatedType = JsonSerializer.Deserialize<AccountType>(
                body.GetRawText(),
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            );

            if (updatedType == null)
                return BadRequest("Invalid data");

            existing.AccountTypeName = updatedType.AccountTypeName;
            existing.AccountTypeNarration = updatedType.AccountTypeNarration;
            existing.IsActive = updatedType.IsActive;

            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();

            return Ok(existing);
        }


        [HttpDelete("AccountType/{id}")]
        public IActionResult DeleteAccountType(int id)
        {
            var existing = _context.AccountType.Find(id);
            if (existing == null) return NotFound();

            _context.AccountType.Remove(existing);
            _context.SaveChanges();
            return Ok();
        }

        // ---------------- ACCOUNT GROUP ----------------
        [HttpGet("AccountGroups")]
        public IActionResult GetAllAccountGroups([FromQuery] bool? isActive)
        {
            var query = _context.AccountGroup
                .Include(a => a.AccountType)
                .AsQueryable();

            if (isActive.HasValue)
                query = query.Where(x => x.IsActive == isActive.Value);

            var data = query.Select(a => new
            {
                a.AccountGroupid,
                a.AccountGroupName,
                a.AccountGroupNarration,
                a.GroupCode,
                a.AccountTypeid,
                AccountTypeName = a.AccountType.AccountTypeName, // ✅ Show name via relationship
                a.IsActive
            }).ToList();

            return Ok(data);
        }


        [HttpPost("AccountGroups")]
        public IActionResult CreateAccountGroup([FromBody] AccountGroup model)
        {
            if (model == null) return BadRequest("Invalid data");

            model.IsActive = true;
            _context.AccountGroup.Add(model);
            _context.SaveChanges();
            return Ok(model);
        }
        [HttpPut("AccountGroups/{id}")]
        public IActionResult UpdateAccountGroup(int id, [FromBody] JsonElement body)
        {
            var existing = _context.AccountGroup.Find(id);
            if (existing == null)
                return NotFound();

            // ✅ Case 1: Only IsActive is being updated (Active/Inactive toggle)
            if (body.TryGetProperty("isActive", out var isActiveProp) && body.EnumerateObject().Count() == 1)
            {
                existing.IsActive = isActiveProp.GetBoolean();
                _context.Entry(existing).State = EntityState.Modified;
                _context.SaveChanges();
                return Ok(existing);
            }

            // ✅ Case 2: Full object update (edit form)
            var updatedGroup = JsonSerializer.Deserialize<AccountGroup>(
                body.GetRawText(),
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            );

            if (updatedGroup == null)
                return BadRequest("Invalid data");

            existing.AccountGroupName = updatedGroup.AccountGroupName;
            existing.AccountGroupNarration = updatedGroup.AccountGroupNarration;
            existing.GroupCode = updatedGroup.GroupCode;
            existing.AccountTypeid = updatedGroup.AccountTypeid;
            existing.IsActive = updatedGroup.IsActive;

            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();

            return Ok(existing);
        }


        [HttpGet("SubGroups")]
        public async Task<IActionResult> GetSubGroups([FromQuery] bool? isActive)
        {
            var query = _context.AccountSubGroup
                .Include(s => s.AccountGroup)
                .AsQueryable();

            if (isActive.HasValue)
                query = query.Where(s => s.IsActive == isActive.Value);

            var data = await query
                .Select(s => new
                {
                    s.AccountSubGroupid,
                    s.AccountSubGroupName,
                    s.AccountSubGroupNarration,
                    s.AccountGroupid,
                    AccountGroupName = s.AccountGroup.AccountGroupName, // ✅ Include related group name
                    s.IsActive
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpPost("Subgroups")]
        public IActionResult CreateSubGroup([FromBody] AccountSubGroup model)
        {
            if (model == null) return BadRequest("Invalid data");

            model.IsActive = true;
            _context.AccountSubGroup.Add(model);
            _context.SaveChanges();
            return Ok(model);
        }
        [HttpPut("Subgroups/{id}")]
        public IActionResult UpdateSubGroup(int id, [FromBody] JsonElement body)
        {
            var existing = _context.AccountSubGroup.Find(id);
            if (existing == null)
                return NotFound();

            // ✅ Case 1: Only IsActive toggle
            if (body.TryGetProperty("isActive", out var isActiveProp) && body.EnumerateObject().Count() == 1)
            {
                existing.IsActive = isActiveProp.GetBoolean();
                _context.Entry(existing).State = EntityState.Modified;
                _context.SaveChanges();
                return Ok(existing);
            }

            // ✅ Case 2: Full update from edit form
            var updated = JsonSerializer.Deserialize<AccountSubGroup>(
                body.GetRawText(),
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            );

            if (updated == null)
                return BadRequest("Invalid data");

            existing.AccountSubGroupName = updated.AccountSubGroupName;
            existing.AccountSubGroupNarration = updated.AccountSubGroupNarration;
            existing.AccountGroupid = updated.AccountGroupid;
            existing.IsActive = updated.IsActive;

            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();

            return Ok(existing);
        }

        // ---------------- SUB-SUBGROUP ----------------
        // ✅ Get all Sub-Sub Groups
        [HttpGet("SubSubGroups")]
        public async Task<IActionResult> GetAllSubSubGroups([FromQuery] bool? isActive)
        {
            var query = _context.AccountSubSubGroup
                .Include(s => s.AccountSubGroup)
                .ThenInclude(sg => sg.AccountGroup)
                .AsQueryable();

            if (isActive.HasValue)
                query = query.Where(x => x.IsActive == isActive.Value);

            var data = await query
                .Select(x => new
                {
                    x.AccountSubSubGroupid,
                    x.AccountSubSubGroupName,
                    x.AccountSubSubGroupNarration,
                    x.AccountSubGroupid,
                    AccountSubGroupName = x.AccountSubGroup.AccountSubGroupName,
                    AccountGroupName = x.AccountSubGroup.AccountGroup.AccountGroupName, // ✅ Include both group names
                    x.IsActive
                })
                .ToListAsync();

            return Ok(data);
        }

        [HttpPost("SubSubgroups")]
        public IActionResult CreateSubSubGroup([FromBody] AccountSubSubGroup model)
        {
            if (model == null) return BadRequest("Invalid data");

            model.IsActive = true;
            _context.AccountSubSubGroup.Add(model);
            _context.SaveChanges();
            return Ok(model);
        }

        [HttpPut("SubSubgroups/{id}")]
        public IActionResult UpdateSubSubGroup(int id, [FromBody] JsonElement body)
        {
            var existing = _context.AccountSubSubGroup.Find(id);
            if (existing == null)
                return NotFound();

            // ✅ Case 1: Only IsActive toggle
            if (body.TryGetProperty("isActive", out var isActiveProp) && body.EnumerateObject().Count() == 1)
            {
                existing.IsActive = isActiveProp.GetBoolean();
                _context.Entry(existing).State = EntityState.Modified;
                _context.SaveChanges();
                return Ok(existing);
            }

            // ✅ Case 2: Full update from edit form
            var updated = JsonSerializer.Deserialize<AccountSubSubGroup>(
                body.GetRawText(),
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            );

            if (updated == null)
                return BadRequest("Invalid data");

            existing.AccountSubSubGroupName = updated.AccountSubSubGroupName;
            existing.AccountSubSubGroupNarration = updated.AccountSubSubGroupNarration;
            existing.AccountGroupid = updated.AccountGroupid;
            existing.AccountSubGroupid = updated.AccountSubGroupid;
            existing.IsActive = updated.IsActive;

            _context.Entry(existing).State = EntityState.Modified;
            _context.SaveChanges();

            return Ok(existing);
        }

        // -------------------- VENDOR LIST --------------------
        [HttpGet("Vendors")]
        public async Task<IActionResult> GetVendors()
        {
            try
            {
                var vendors = await _context.Potential_Vendor
                    .Select(v => new
                    {
                        v.Id,
                        VendorCode = v.Vendor_Code,
                        CompanyName = v.Company_Name,
                        v.Contact_Person,
                        v.Email,
                        v.Contact_Number,
                        v.Bank_Name,
                        v.CurrentAcNo,
                        v.Branch,
                        v.IFSC_No,
                        v.GST_Number,
                        v.Country,
                        v.State_Province,
                        v.City,
                        v.Address,
                        v.industry,
                        v.Category,
                        v.Sub_Category,

                    })
                    .ToListAsync();

                if (vendors == null || vendors.Count == 0)
                    return NotFound(new { success = false, message = "No vendors found" });

                return Ok(new { success = true, data = vendors });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
    }
}

