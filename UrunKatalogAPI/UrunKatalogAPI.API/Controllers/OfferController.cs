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
using UrunKatalogAPI.Infrastructere.UnitOfWork;

namespace UrunKatalogAPI.API.Controllers
{
    // Teklif (Offer) işlemlerini gerçekleştiren controller sınıfı
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


        [HttpPost] //TEKLIF YAP ENDPOINT'I
        public async Task<ActionResult<ApplicationResult<OfferDto>>> MakeOffer([FromBody] CreateOfferInput input)
        {
            var requestedProduct = _unitOfWork.Product.GetAll().Result.Result.FirstOrDefault(x => x.Id == input.ProductId); 
            var user = await _userManager.GetUserAsync(HttpContext.User); 

            if (requestedProduct.IsOfferable == true && requestedProduct !=null)
            {
                if (input.IsOfferPercentage) // Yüzdelik durumunda, teklif fiyatını hesaplayın
                {
                    input.OfferedPrice =  (requestedProduct.Price * input.OfferedPrice / 100); 
                    var result = await _unitOfWork.Offer.Create(input, user);
                    if (result.Succeeded)
                    {
                        return result; 
                    }

                }
                else if (input.IsOfferPercentage == false)  // Sabit fiyat indirim durumunda, teklifi oluşturun
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

        [HttpDelete("{id}")] // Bir teklifi iptal eden HTTP DELETE metodu
        public async Task<ActionResult<ApplicationResult<OfferDto>>> CancelOffer(int id)
        {
            var requestedOffer = await _unitOfWork.Offer.Get(id); 
            var username = _userManager.GetUserName(HttpContext.User); 
            if (requestedOffer.Result.CreatedBy == username) 
            {
                // İptal edilecek teklifi bulun ve sil
                var result = await _unitOfWork.Offer.Delete(id); 
                if (result.Succeeded)
                {
                    return Ok("Teklif silindi.");
                }
            }
            else if (requestedOffer.Result.CreatedBy != username)
            {
                return BadRequest("Size ait olmayan teklifi silemezsiniz!");
            }
            return BadRequest("Böyle bir teklifiniz yok.");
        }
    }
}
