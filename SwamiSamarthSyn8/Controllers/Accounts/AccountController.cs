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
        private readonly MsmeERPDbContext _context;
        private readonly ILogger<AccountController> _logger;

        public AccountController(MsmeERPDbContext context, ILogger<AccountController> logger)
        {
            _context = context;
            _logger = logger;

        }
        //[HttpGet("AccountType")]
        //public IActionResult GetAccountType()
        //{
        //    return Ok(new { message = "Account type API is working ✅" });
        [HttpGet("PrimaryGroup")]
        public async Task<IActionResult> GetAllAccountTypes([FromQuery] bool? isActive)
        {
            try
            {
                var query = _context.AccountPrimaryGroup.AsQueryable();

                if (isActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == isActive.Value);
                }

                var list = await query
                    .Select(x => new
                    {
                        x.PrimaryGroupId,
                        x.AccountPrimaryGroupName,
                        x.Type,
                        x.PrimaryGroupCode,
                        x.Description,
                        x.IsActive
                    })
                    .ToListAsync();

                return Ok(list); // Always return 200 with list (even empty)
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message,
                    inner = ex.InnerException?.Message
                });
            }
        }
        [HttpPost("PrimaryGroup")]
        public IActionResult CreateAccountPrimaryGroup([FromBody] AccountPrimaryGroup model)
        {
            if (model == null)
                return BadRequest();

            int nextCode = 1;

            if (_context.AccountPrimaryGroup.Any())
            {
                nextCode = _context.AccountPrimaryGroup
                    .Max(x => x.PrimaryGroupCode ?? 0) + 1;
            }

            model.PrimaryGroupCode = nextCode;
            model.IsActive = true;

            _context.AccountPrimaryGroup.Add(model);
            _context.SaveChanges();

            return Ok(model);
        }
        [HttpPut("PrimaryGroup/{id}")]
        public IActionResult UpdateAccountPrimaryGroup(int id, [FromBody] AccountPrimaryGroupUpdateDto dto)
        {
            var existing = _context.AccountPrimaryGroup.Find(id);
            if (existing == null)
                return NotFound();

            if (dto.AccountPrimaryGroupName != null)
                existing.AccountPrimaryGroupName = dto.AccountPrimaryGroupName;

            if (dto.Type != null)
                existing.Type = dto.Type;

            if (dto.PrimaryGroupCode != null)
                existing.PrimaryGroupCode = dto.PrimaryGroupCode;

            if (dto.Description != null)
                existing.Description = dto.Description;

            if (dto.IsActive.HasValue)
                existing.IsActive = dto.IsActive.Value;

            _context.SaveChanges();

            return Ok(existing);
        }


        [HttpDelete("PrimaryGroup/{id}")]
        public IActionResult DeleteAccountPrimaryGroup(int id)
        {
            var existing = _context.AccountPrimaryGroup.Find(id);
            if (existing == null)
                return NotFound();

            _context.AccountPrimaryGroup.Remove(existing);
            _context.SaveChanges();

            return Ok();
        }

        // ---------------- ACCOUNT GROUP ----------------
        [HttpGet("AccountGroups")]
        public IActionResult GetAllAccountGroups([FromQuery] bool? isActive)
        {
            var query = _context.AccountGroup
                .Include(a => a.AccountPrimaryGroup)
                .AsQueryable();

            if (isActive.HasValue)
                query = query.Where(x => x.IsActive == isActive.Value);

            var data = query.Select(a => new
            {
                a.AccountGroupid,
                a.AccountGroupName,
                a.AccountGroupNarration,
                a.PrimaryGroupId,
                AccountPrimaryGroup = a.AccountPrimaryGroup.AccountPrimaryGroupName, // ✅ Show name via relationship
               // a.AccountGroupCode,
                a.IsActive
            }).ToList();

            return Ok(data);
        }

        [HttpPost("AccountGroups")]
        public IActionResult CreateAccountGroup([FromBody] AccountGroup model)
        {
            if (model == null)
                return BadRequest("Invalid data");

            // Get last numeric code for same PrimaryGroupId
            var lastCode = _context.AccountGroup
                .Where(x => x.PrimaryGroupId == model.PrimaryGroupId
                            && x.AccountGroupCode != null)
                .Select(x => Convert.ToInt32(x.AccountGroupCode))
                .DefaultIfEmpty(0)
                .Max();

            int nextCode = lastCode + 1;

            model.AccountGroupCode = nextCode.ToString("D2"); // 01,02,03
            model.IsActive = true;

            _context.AccountGroup.Add(model);
            _context.SaveChanges();

            return Ok(model);
        }
        [HttpPut("AccountGroups/{id}")]
        public IActionResult UpdateAccountGroup(int id, [FromBody] AccountGroupUpdateDto dto)
        {
            if (dto == null)
                return BadRequest("Invalid body");

            var existing = _context.AccountGroup.Find(id);
            if (existing == null)
                return NotFound();

            if (dto.AccountGroupName != null)
                existing.AccountGroupName = dto.AccountGroupName;

            if (dto.AccountGroupNarration != null)
                existing.AccountGroupNarration = dto.AccountGroupNarration;

            if (dto.AccountGroupCode != null)
                existing.AccountGroupCode = dto.AccountGroupCode.ToString();

            if (dto.PrimaryGroupId.HasValue)
            {
                var primaryExists = _context.AccountPrimaryGroup
                    .Any(x => x.PrimaryGroupId == dto.PrimaryGroupId.Value);

                if (!primaryExists)
                    return BadRequest("Invalid PrimaryGroupId");

                existing.PrimaryGroupId = dto.PrimaryGroupId.Value;
            }

            if (dto.IsActive.HasValue)
                existing.IsActive = dto.IsActive.Value;

            _context.SaveChanges();
            return Ok(existing);
        }



        [HttpGet("Subgroups")]
        public async Task<IActionResult> GetSubGroups([FromQuery] bool? isActive)
        {
          var query = _context.AccountSubGroup
                .Include(s => s.AccountGroup)
                .ThenInclude(g => g.AccountPrimaryGroup)
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
                    PrimaryGroupId = s.AccountGroup.PrimaryGroupId,   // ✅ ADD THIS
                    AccountGroupName = s.AccountGroup.AccountGroupName,
                    AccountPrimaryGroupName = s.AccountGroup.AccountPrimaryGroup.AccountPrimaryGroupName, // ✅ ADD THIS
                    s.IsActive
                })
                .ToListAsync();

            return Ok(data);
        }
        [HttpPost("Subgroups")]
        public IActionResult CreateSubGroup([FromBody] AccountSubGroup model)
        {
            if (model == null)
                return BadRequest("Invalid data");

            var lastCode = _context.AccountSubGroup
                .Where(x => x.AccountGroupid == model.AccountGroupid
                            && x.SubGroupCode != null)
                .Select(x => Convert.ToInt32(x.SubGroupCode))
                .DefaultIfEmpty(0)
                .Max();

            int nextCode = lastCode + 1;

            model.SubGroupCode = nextCode.ToString("D2");
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

            if (dto.SubGroupCode != null)
                existing.SubGroupCode = dto.SubGroupCode;

            if (dto.AccountGroupid.HasValue)
            {
                var groupExists = _context.AccountGroup
                    .Any(x => x.AccountGroupid == dto.AccountGroupid.Value);

                if (!groupExists)
                    return BadRequest("Invalid AccountGroupid");

                existing.AccountGroupid = dto.AccountGroupid.Value;
            }

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
        .ThenInclude(g => g.AccountPrimaryGroup)
        .AsQueryable();

    if (isActive.HasValue)
        query = query.Where(x => x.IsActive == isActive.Value);

    var data = await query
        .Select(x => new
        {
            x.AccountSubSubGroupid,
            x.AccountSubSubGroupName,
            x.AccountSubSubGroupNarration,
            x.SubSubGroupCode,
            x.AccountSubGroupid,
            AccountGroupid = x.AccountSubGroup.AccountGroupid,   // ✅ ADD THIS
            PrimaryGroupId = x.AccountSubGroup.AccountGroup.PrimaryGroupId, // ✅ ADD THIS

            AccountSubGroupName = x.AccountSubGroup.AccountSubGroupName,
            AccountGroupName = x.AccountSubGroup.AccountGroup.AccountGroupName,
            AccountPrimaryGroupName = x.AccountSubGroup.AccountGroup.AccountPrimaryGroup.AccountPrimaryGroupName,

            x.IsActive
        })
        .ToListAsync();

    return Ok(data);
}
        [HttpPost("SubSubgroups")]
        public IActionResult CreateSubSubGroup([FromBody] AccountSubSubGroup model)
        {
            if (model == null)
                return BadRequest("Invalid data");

            // Step 1: Fetch existing codes as list (SQL executed here)
            var codes = _context.AccountSubSubGroup
                .Where(x => x.AccountSubGroupid == model.AccountSubGroupid
                            && x.SubSubGroupCode != null)
                .Select(x => x.SubSubGroupCode)
                .ToList();   // ✅ Important

            // Step 2: Convert in memory
            int lastCode = 0;

            if (codes.Any())
            {
                lastCode = codes
                    .Select(x => int.TryParse(x, out int num) ? num : 0)
                    .Max();
            }

            int nextCode = lastCode + 1;

            model.SubSubGroupCode = nextCode.ToString("D2");
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

            if (dto.SubSubGroupCode != null)
                existing.SubSubGroupCode = dto.SubSubGroupCode;

            if (dto.AccountSubGroupid.HasValue)
            {
                var subGroupExists = _context.AccountSubGroup
                    .Any(x => x.AccountSubGroupid == dto.AccountSubGroupid.Value);

                if (!subGroupExists)
                    return BadRequest("Invalid AccountSubGroupid");

                existing.AccountSubGroupid = dto.AccountSubGroupid.Value;
            }

            if (dto.IsActive.HasValue)
                existing.IsActive = dto.IsActive.Value;

            _context.SaveChanges();
            return Ok(existing);
        }

    }
}

