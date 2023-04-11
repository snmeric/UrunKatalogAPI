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
    [Authorize(AuthenticationSchemes =JwtBearerDefaults.AuthenticationScheme)]
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
                List<int> list2 = new List<int>(); 
                var sonuc = new List<OfferDto>(); 
                product.ForEach(n => list2.Add(n.Id)); 
                for (int i = 0; i < list2.Count(); i++)
                {
                    var offer = _unitOfWork.Offer.GetAll().Result.Result.Find(x => x.ProductId == list2[i]);
                    sonuc.Add(offer);
                }
                return sonuc;
            }


            return BadRequest("Teklif bulunmamaktadır.");
        }

        [HttpPut("{id}")] 
        public async Task<ActionResult<ApplicationResult<ProductDto>>> AcceptTheOffer(int id)
        {

            var user = await _userManager.GetUserAsync(HttpContext.User); 
            var teklif = await _unitOfWork.Offer.Get(id);
            var kk = teklif.Result.ProductId;      
            var product = _unitOfWork.Product.GetAll().Result.Result.FirstOrDefault(x => x.Id == kk); 
            if (product.UserName == user.UserName)
            {
                if (teklif.Result.IsOfferPercentage is true) 
                {
                    int yuzdelik = teklif.Result.OfferedPrice; 
                    var map = new UpdateProductInput
                    {

                        Id = product.Id,
                        Brand = product.Brand,
                        Color = product.Color,
                        CategoryId = product.CategoryId,
                        Description = product.Description,
                        UserName = product.UserName,             
                        IsOfferable = true,
                        IsSold = false,
                        Name = product.Name,
                        Image = product.Image,
                        Price = (product.Price * (yuzdelik / 100)),
                        ProductCondition = product.ProductCondition
                    };

                    var result = await _unitOfWork.Product.Update(map, user); 

                    return result;
                }
                else if (teklif.Result.IsOfferPercentage is false) 
                {
                    var map = new UpdateProductInput
                    {

                        Id = product.Id,
                        Brand = product.Brand,
                        Color = product.Color,
                        CategoryId = product.CategoryId,
                        Description = product.Description,
                        UserName = product.UserName,             
                        IsOfferable = true,
                        IsSold = false,
                        Name = product.Name,
                        Image = product.Image,
                        Price = teklif.Result.OfferedPrice,
                        ProductCondition = product.ProductCondition
                    };

                    var result = await _unitOfWork.Product.Update(map, user); 

                    return result;
                }

            }

            return NotFound("Teklif kabul edilemedi.");
        }


    }
}
