using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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
    public class AccountController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUnitOfWork _unitOfWork;
        public AccountController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }


        [HttpGet("{Username}")]
        public async Task<ActionResult<List<OfferDto>>> OffersThatIMade(string username)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var offercreatedby = _unitOfWork.Offer.GetAll().Result.Result.FindAll(x => x.CreatedBy == user.UserName);
            if (offercreatedby != null)
            {
                return Ok(offercreatedby);
            }
            return BadRequest("Verdiğiniz bir teklif bulunmamaktadır.");
        }

        [HttpGet]
        public async Task<ActionResult<List<OfferDto>>> OffersThatIReceive()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var product = _unitOfWork.Product.GetAll().Result.Result.FindAll(x => x.CreatedBy == user.UserName);

            if (product != null)
            {
                List<int> productIdList = new List<int>();
                var result = new List<OfferDto>();

                product.ForEach(p => productIdList.Add(p.Id));

                foreach (var productId in productIdList)
                {
                    var offers = _unitOfWork.Offer.GetAll().Result.Result.FindAll(x => x.ProductId == productId);

                    if (offers != null)
                    {
                        foreach (var offer in offers)
                        {
                            var offerDto = new OfferDto
                            {
                                Id = offer.Id,

                                ProductId = offer.ProductId,
                                OfferedPrice = offer.OfferedPrice,
                                CreatedBy = offer.CreatedBy,
                                CreatedById = offer.CreatedById,
                                ModifiedBy = offer.ModifiedBy,
                                ModifiedById = offer.ModifiedById,
                                ModifiedDate = offer.ModifiedDate,
                                CreatedDate = offer.CreatedDate,

                            };

                            result.Add(offerDto);
                        }
                    }
                }

                if (result.Count > 0)
                {
                    return Ok(result);
                }
            }

            return BadRequest("Teklif bulunmamaktadır.");
        }



        [HttpPut("{id}")]
        public async Task<ActionResult<ApplicationResult<ProductDto>>> AcceptTheOffer(int id)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var teklif = await _unitOfWork.Offer.Get(id);

            if (teklif != null && teklif.Result != null)
            {
                var kk = teklif.Result.ProductId;
                var product = _unitOfWork.Product.GetAll().Result.Result.FirstOrDefault(x => x.Id == kk);

                if (product != null && product.UserName == user.UserName)
                {
                    if (teklif.Result.IsOfferPercentage == true)
                    {
                        int yuzdelik = teklif.Result.OfferedPrice;
                        var map = new UpdateProductInput
                        {
                            Id = product.Id,
                            BrandId = product.BrandId,
                            ColorId = product.ColorId,
                            CategoryId = product.CategoryId,
                            Description = product.Description,
                            UserName = product.UserName,
                            IsOfferable = false,
                            IsSold = true, // Satışı kapat
                            Name = product.Name,
                            Image = product.Image,
                            Price = (product.Price * (yuzdelik / 100)),
                            ProductCondition = product.ProductCondition
                        };

                        var result = await _unitOfWork.Product.Update(map, user);
                        await CancelOtherOffers(teklif.Result.ProductId); // Diğer teklifleri iptal et

                        return result;
                    }
                    else if (teklif.Result.IsOfferPercentage== false)
                    {
                        var map = new UpdateProductInput
                        {
                            Id = product.Id,
                            BrandId = product.BrandId,
                            ColorId = product.ColorId,
                            CategoryId = product.CategoryId,
                            Description = product.Description,
                            UserName = product.UserName,
                            IsOfferable = false,
                            IsSold = true, // Satışı kapat
                            Name = product.Name,
                            Image = product.Image,
                            Price = teklif.Result.OfferedPrice,
                            ProductCondition = product.ProductCondition
                        };

                        var result = await _unitOfWork.Product.Update(map, user);
                        await CancelOtherOffers(teklif.Result.ProductId); // Diğer teklifleri iptal et

                        return result;
                    }
                }
            }

            return NotFound("Teklif kabul edilirken hata oluştu.");
        }

        private async Task CancelOtherOffers(int productId)
        {
            var offers = await _unitOfWork.Offer.GetAll();
            var offersToCancel = offers.Result.Where(x => x.ProductId == productId);

            foreach (var offer in offersToCancel)
            {
                await _unitOfWork.Offer.Delete(offer.Id);
            }
        }

    }
}
