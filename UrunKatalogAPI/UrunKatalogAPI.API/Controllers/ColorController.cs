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
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class ColorController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUnitOfWork _unitOfWork;

        public ColorController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        [HttpGet]
        public Task<ApplicationResult<List<ColorDto>>> GetAllColors()
        {
            return _unitOfWork.Color.GetAll();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApplicationResult<ColorDto>>> GetColorById(int id)
        {
            var result = await _unitOfWork.Color.Get(id);
            if (result.Succeeded)
                return result;
            return NotFound(result);
        }

        [HttpPost]
        public async Task<ActionResult<ApplicationResult<ColorDto>>> CreateColor([FromBody] CreateColorInput input)
        {
            if (ModelState.IsValid)
            {
                var user = await _userManager.GetUserAsync(HttpContext.User);
                var result = await _unitOfWork.Color.Create(input, user);
                if (result.Succeeded)
                    return Ok(result);

                return NotFound(result);
            }
            return BadRequest();
        }

        [HttpPut]
        public async Task<IActionResult> UpdateColor([FromBody] UpdateColorInput updateColor)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var result = await _unitOfWork.Color.Update(updateColor, user);
            if (result.Succeeded)
                return Ok(result);
            return BadRequest("Kategori güncellenemedi!");

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteColor(int id)
        {
            var result = await _unitOfWork.Color.Delete(id);
            if (result.Succeeded)
            {
                return Ok("Kategori silindi.");
            }

            return BadRequest("Silinirken Hata Oluştu.");

        }
    }
}
