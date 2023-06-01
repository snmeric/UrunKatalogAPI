using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using UrunKatalogAPI.Core.Domain.Entities;
using UrunKatalogAPI.Core.Shared;
using UrunKatalogAPI.Infrastructere.DTO;
using UrunKatalogAPI.Infrastructere.Repositories;
using UrunKatalogAPI.Infrastructere.Repositories.OfferRepository;

namespace UrunKatalogAPI.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class OfferController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUnitOfWork _unitOfWork;

        public OfferController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }


        [HttpPost] //TEKLİF YAP ENDPOINT'İ
        public async Task<ActionResult<ApplicationResult<OfferDto>>> MakeOffer([FromBody] CreateOfferInput input)
        {
            var rr = _unitOfWork.Product.GetAll().Result.Result.FirstOrDefault(x => x.Id == input.ProductId); 
            var user = await _userManager.GetUserAsync(HttpContext.User); 

            if (rr.IsOfferable == true && rr!=null)
            {
                if (input.IsOfferPercentage) 
                {
                    input.OfferedPrice =  (rr.Price * input.OfferedPrice / 100); 
                    var result = await _unitOfWork.Offer.Create(input, user);
                    if (result.Succeeded)
                    {
                        return result; 
                    }

                }
                else if (input.IsOfferPercentage == false) 
                {
                    var resultt = await _unitOfWork.Offer.Create(input, user); 
                    if (resultt.Succeeded)
                    {
                        return resultt; 
                    }
                }
            }
            return NotFound("Ürün teklife açık değildir!");

        }

        [HttpDelete("{id}")] // Teklifi Sil
        public async Task<ActionResult<ApplicationResult<OfferDto>>> CancelOffer(int id)
        {
            var omu = await _unitOfWork.Offer.Get(id); 
            var username = _userManager.GetUserName(HttpContext.User); 
            if (omu.Result.CreatedBy == username) 
            {
                var result = await _unitOfWork.Offer.Delete(id); 
                if (result.Succeeded)
                {
                    return Ok("Teklif silindi.");
                }
            }
            else if (omu.Result.CreatedBy != username)
            {
                return BadRequest("Size ait olmayan teklifi silemezsiniz!");
            }
            return BadRequest("Böyle bir teklifiniz yok.");
        }
    }
}
