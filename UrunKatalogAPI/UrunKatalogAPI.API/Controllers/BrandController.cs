using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using UrunKatalogAPI.Core.Shared;
using UrunKatalogAPI.Infrastructere.DTO;
using UrunKatalogAPI.Infrastructere.Repositories;
using UrunKatalogAPI.Infrastructere.UnitOfWork;

namespace UrunKatalogAPI.API.Controllers
{

    // Marka (Brand) işlemlerini gerçekleştiren controller
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class BrandController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUnitOfWork _unitOfWork;

        // Bağımlılıkların enjekte edildiği constructor metodu
        public BrandController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }


        // Tüm markaları getiren endpoint
        [HttpGet]
        public Task<ApplicationResult<List<BrandDto>>> GetAllBrandies()
        {
            return _unitOfWork.Brand.GetAll();
        }

        // Belirli bir markayı id'ye göre getiren endpoint
        [HttpGet("{id}")]
        public async Task<ActionResult<ApplicationResult<BrandDto>>> GetBrandById(int id)
        {
            var result = await _unitOfWork.Brand.Get(id);
            if (result.Succeeded)
                return result;
            return NotFound(result);
        }

        // Yeni bir marka oluşturan HTTP POST metodu
        [HttpPost]
        public async Task<ActionResult<ApplicationResult<BrandDto>>> CreateBrand([FromBody] CreateBrandInput input)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.GetUserAsync(HttpContext.User);
                var result = await _unitOfWork.Brand.Create(input, user);
                if (result.Succeeded)
                    return Ok(result);

                return NotFound(result);
            }
            return BadRequest();
        }

        // Bir markayı güncelleyen HTTP PUT metodu
        [HttpPut]
        public async Task<IActionResult> UpdateBrand([FromBody] UpdateBrandInput updateBrand)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var result = await _unitOfWork.Brand.Update(updateBrand, user);
            if (result.Succeeded)
                return Ok(result);
            return BadRequest("Kategori güncellenemedi!");

        }

        // Bir markayı silen HTTP DELETE metodu
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBrand(int id)
        {
            var result = await _unitOfWork.Brand.Delete(id);
            if (result.Succeeded)
            {
                return Ok("Kategori silindi.");
            }

            return BadRequest("Silinirken Hata Oluştu.");

        }
    }
}
