using Microsoft.AspNetCore.Mvc;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models.Accounts;
using System.Linq;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Nodes;
using SwamiSamarthSyn8.DTOs.Accounts;

namespace SwamiSamarthSyn8.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly SwamiSamarthDbContext _context;
        private readonly ILogger<AccountController> _logger;

        public AccountController(SwamiSamarthDbContext context, ILogger<AccountController> logger)
        {
            _context = context;
            _logger = logger;

        }
        //[HttpGet("AccountType")]
        //public IActionResult GetAccountType()
        //{
        //    return Ok(new { message = "Account type API is working ✅" });
        //}
        [HttpGet("AccountType")]
        public async Task<IActionResult> GetAllAccountTypes([FromQuery] bool? isActive)
        {
            try
            {
                _logger.LogInformation("GetAllAccountTypes called. isActive={isActive}", isActive);

                var query = _context.AccountType.AsQueryable();

                if (isActive.HasValue)
                    query = query.Where(x => x.IsActive == isActive.Value);

                var list = await query.ToListAsync();

                if (list == null || list.Count == 0)
                {
                    _logger.LogWarning("GetAllAccountTypes returned no data. isActive={isActive}", isActive);
                    // return 204 No Content OR 200 with empty array depending on your API contract
                    return NoContent(); // -> HTTP 204
                                        // OR: return Ok(new object[0]); -> HTTP 200 with []
                }

                _logger.LogInformation("GetAllAccountTypes returning {count} items.", list.Count);
                return Ok(list); // 200 + JSON
            }
            catch (Exception ex)
            {
                // Important: log the exception with context
                _logger.LogError(ex, "Error in GetAllAccountTypes. isActive={isActive}", isActive);

                // Return a safe error message and 500
                return StatusCode(500, new { success = false, message = "Internal server error. Check logs for details." });
            }
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
        public IActionResult UpdateAccountType(int id, [FromBody] AccountTypeUpdateDto dto)
        {
            var existing = _context.AccountType.Find(id);
            if (existing == null)
                return NotFound();

            if (dto.AccountTypeName != null)
                existing.AccountTypeName = dto.AccountTypeName;

            if (dto.AccountTypeNarration != null)
                existing.AccountTypeNarration = dto.AccountTypeNarration;

            if (dto.IsActive.HasValue)
                existing.IsActive = dto.IsActive.Value;

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
        public IActionResult UpdateAccountGroup(int id, [FromBody] AccountGroupUpdateDto dto)
        {
            if (dto == null)
                return BadRequest("Invalid or empty JSON body");

            var existing = _context.AccountGroup.Find(id);
            if (existing == null)
                return NotFound();

            // Update only if property is provided
            if (dto.AccountGroupName != null)
                existing.AccountGroupName = dto.AccountGroupName;

            if (dto.AccountGroupNarration != null)
                existing.AccountGroupNarration = dto.AccountGroupNarration;

            if (dto.GroupCode != null)
                existing.GroupCode = dto.GroupCode;

            if (dto.AccountTypeid.HasValue)
                existing.AccountTypeid = dto.AccountTypeid.Value;

            if (dto.IsActive.HasValue)
                existing.IsActive = dto.IsActive.Value;

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
        public IActionResult UpdateSubGroup(int id, [FromBody] AccountSubGroupUpdateDto dto)
        {
            var existing = _context.AccountSubGroup.Find(id);
            if (existing == null)
                return NotFound();

            if (dto.AccountSubGroupName != null)
                existing.AccountSubGroupName = dto.AccountSubGroupName;

            if (dto.AccountSubGroupNarration != null)
                existing.AccountSubGroupNarration = dto.AccountSubGroupNarration;

            if (dto.AccountGroupid.HasValue)
                existing.AccountGroupid = dto.AccountGroupid.Value;

            if (dto.IsActive.HasValue)
                existing.IsActive = dto.IsActive.Value;

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
        public IActionResult UpdateSubSubGroup(int id, [FromBody] AccountSubSubGroupUpdateDto dto)
        {
            var existing = _context.AccountSubSubGroup.Find(id);
            if (existing == null)
                return NotFound();

            if (dto.AccountSubSubGroupName != null)
                existing.AccountSubSubGroupName = dto.AccountSubSubGroupName;

            if (dto.AccountSubSubGroupNarration != null)
                existing.AccountSubSubGroupNarration = dto.AccountSubSubGroupNarration;

            if (dto.AccountGroupid.HasValue)
                existing.AccountGroupid = dto.AccountGroupid.Value;

            if (dto.AccountSubGroupid.HasValue)
                existing.AccountSubGroupid = dto.AccountSubGroupid.Value;

            if (dto.IsActive.HasValue)
                existing.IsActive = dto.IsActive.Value;

            _context.SaveChanges();
            return Ok(existing);
        }

    }
}

