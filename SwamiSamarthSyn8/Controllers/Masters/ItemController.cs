using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SwamiSamarthSyn8.Data;
using SwamiSamarthSyn8.Models.Masters;

namespace SwamiSamarthSyn8.Controllers.Masters
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController : Controller
    {

        private readonly MsmeERPDbContext _context;

        public ItemController(MsmeERPDbContext context)
        {
            _context = context;
           

        }
     
        [HttpGet("GetVendorItemCategories")]
        public async Task<IActionResult> GetVendorItemCategories()
        {
            var list = await _context.Master_ItemVendorCategory
                .Where(x => x.IsActive == true) 
                .ToListAsync();

            return Ok(list);
        }


        [HttpPost("ItemCategory")]

        public async Task<IActionResult> ItemCategory([FromBody] dynamic model)
        {
            int? id = model.itemVendorCategoryId;
            string categoryName = model.itemVendorCategory;
            string categoryType = model.categoryType;

            if (string.IsNullOrEmpty(categoryName) || string.IsNullOrEmpty(categoryType))
                return BadRequest("Category name and type are required");

            int catCode = categoryType?.ToLower() == "item" ? 1 : 2;

            if (id == null || id == 0)
            {
                var exists = await _context.Master_ItemVendorCategory
                    .AnyAsync(x => x.ItemVendorCategory == categoryName
                                && x.ItemVendorCatCode == catCode);

                if (exists)
                    return BadRequest("Category already exists for this type");

                var newCategory = new Master_ItemVendorCategory
                {
                    ItemVendorCategory = categoryName,
                    ItemVendorCatCode = catCode,
                    IsActive = true
                };

                _context.Master_ItemVendorCategory.Add(newCategory);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Category Created Successfully",
                    data = newCategory
                });
            }
            else
            {
                var category = await _context.Master_ItemVendorCategory
                    .FirstOrDefaultAsync(x => x.ItemVendorCategoryId == id);

                if (category == null)
                    return NotFound(new { message = "Category not found" });

                var exists = await _context.Master_ItemVendorCategory
                    .AnyAsync(x => x.ItemVendorCategory == categoryName
                                && x.ItemVendorCatCode == catCode
                                && x.ItemVendorCategoryId != id);

                if (exists)
                    return BadRequest("Category already exists for this type");

                category.ItemVendorCategory = categoryName;
                category.ItemVendorCatCode = catCode;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Category Updated Successfully", data = category });
            }
        }
      

        [HttpDelete("DeleteCategory/{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Master_ItemVendorCategory
                .FirstOrDefaultAsync(x => x.ItemVendorCategoryId == id);

            if (category == null)
                return NotFound(new { message = "Category not found" });

         
            category.IsActive = false;   

            _context.Master_ItemVendorCategory.Update(category);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Category deleted successfully" });
        }


        [HttpPut("ActivateCategory/{id}")]
        public async Task<IActionResult> ActivateCategory(int id)
        {
            var category = await _context.Master_ItemVendorCategory
                .FirstOrDefaultAsync(x => x.ItemVendorCategoryId == id);

            if (category == null)
                return NotFound(new { message = "Category not found" });

            category.IsActive = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Category activated successfully", data = category });
        }
    }
}

