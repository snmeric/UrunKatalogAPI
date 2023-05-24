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
            var rr = _unitOfWork.Product.GetAll().Result.Result.FirstOrDefault(x => x.Id == input.ProductId); //girilen inputtaki productid product tablosundaki id ise rr'ye at
            var user = await _userManager.GetUserAsync(HttpContext.User); //kullanıcıyı al

            if (rr.IsOfferable == true && rr!=null) //eğer ürün teklife açıksa
            {
                if (input.IsOfferPercentage) // ürünün teklifi yüzdelik ise
                {
                    input.OfferedPrice =  (rr.Price * input.OfferedPrice / 100); // inputta girilen yüzdelik olarak alınır ve fiyat üzerinden hesaplanır
                    var result = await _unitOfWork.Offer.Create(input, user); // teklif create edilir
                    if (result.Succeeded)
                    {
                        return result; //create başarılı ise döner
                    }

                }
                else if (input.IsOfferPercentage == false) // eğer ürünün teklifi yüzdelik değil ise
                {
                    var resultt = await _unitOfWork.Offer.Create(input, user); //inputtaki değerlerle offer create et
                    if (resultt.Succeeded)
                    {
                        return resultt; //create başarılı ise döner
                    }
                }
            }
            return NotFound("Ürün teklife açık değildir!"); //eğer ürün teklife açık değilse döner

        }

        [HttpDelete("{id}")] // Teklifi Sil
        public async Task<ActionResult<ApplicationResult<OfferDto>>> CancelOffer(int id)
        {
            var omu = await _unitOfWork.Offer.Get(id); //girilen id'yle teklif tablosunda eşleşen teklifi bul 
            var username = _userManager.GetUserName(HttpContext.User); //kullanıcının username'ini al
            if (omu.Result.CreatedBy == username) //teklif kullanıcının username'i ile oluşturulduysa
            {
                var result = await _unitOfWork.Offer.Delete(id); // teklifi sil
                if (result.Succeeded)
                {
                    return Ok("Teklif silindi."); //silme işlemi tamamlandıysa döner
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
