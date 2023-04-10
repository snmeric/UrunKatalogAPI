using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using UrunKatalogAPI.Core.Shared;
using UrunKatalogAPI.Infrastructere.DTO;
using UrunKatalogAPI.Infrastructere.Repositories;

namespace UrunKatalogAPI.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class CategoryController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUnitOfWork _unitOfWork;

        public CategoryController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        [HttpGet] // TÜM KATEGORİLERİ LİSTELEME ENDPOINT'İ
        public Task<ApplicationResult<List<CategoryDto>>> GetAllCategories()
        {
            return _unitOfWork.Category.GetAll();
        }

        [HttpGet("{id}")] // İDYE GÖRE KATEGORİLERİ LİSTELEME ENDPOINT'İ
        public async Task<ActionResult<ApplicationResult<CategoryDto>>> GetCategoryById(int id)
        {
            var result = await _unitOfWork.Category.Get(id);
            if (result.Succeeded)
                return result;
            return NotFound(result);
        }

        [HttpPost] // YENİ KATEGORİ OLUŞTURMA ENDPOINT'İ
        public async Task<ActionResult<ApplicationResult<CategoryDto>>> CreateCategory([FromBody] CreateCategoryInput input)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.GetUserAsync(HttpContext.User);
                var result = await _unitOfWork.Category.Create(input, user);
                if (result.Succeeded)
                    return Ok(result);

              //  return NotFound(result);
            }
            return BadRequest();
        }

        [HttpPut] // KATEGORİ GÜNCELLEME ENDPOINT'İ
        public async Task<IActionResult> UpdateCategory([FromBody] UpdateCategoryInput updateCategory)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var result = await _unitOfWork.Category.Update(updateCategory, user);
            if (result.Succeeded)
                return Ok(result);
            return BadRequest("Kategori güncellenemedi!");

        }

        [HttpDelete("{id}")] //KATEGORİ SİLME ENDPOINT'İ
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var result = await _unitOfWork.Category.Delete(id);
            if (result.Succeeded)
            {
                return Ok("Kategori silindi.");
            }

            return BadRequest("Kategori silinemedi!");

        }
    }
}
