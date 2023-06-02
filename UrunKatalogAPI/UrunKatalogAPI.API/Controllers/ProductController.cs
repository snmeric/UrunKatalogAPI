using AutoMapper;
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
    public class ProductController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment webHostEnvironment;
        public ProductController(IUnitOfWork unitOfWork, UserManager<ApplicationUser> userManager, IMapper mapper, IWebHostEnvironment hostEnvironment)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _mapper = mapper;
            webHostEnvironment = hostEnvironment;

        }
        private string ImageFile(ProductImage image)
        {
            string uniqueFileName = null;

            if (image.Image != null)
            {
                // Resim dosyasının yükleneceği klasör yolunu belirle
                string uploadsFolder = Path.Combine(webHostEnvironment.ContentRootPath, "images");

                // Guid.NewGuid() yöntemi kullanarak benzersiz bir dosya adı oluştur
                uniqueFileName = Guid.NewGuid().ToString() + "_" + image.Image.FileName;

                // Klasör yolunu ve benzersiz dosya adını birleştirerek tam dosya yolunu elde et
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // Bir dosya akışı oluştur ve resim dosyasını belirtilen dosya yoluna kopyala
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    image.Image.CopyTo(fileStream);
                }
            }
            // Yüklenen resme daha sonra erişmek için kullanılabilecek benzersiz dosya adını döndür
            return uniqueFileName;
        }
        [HttpGet]
        public Task<ApplicationResult<List<ProductDto>>> GetAllProducts()
        {
            // Tüm ürünleri almak için
            return _unitOfWork.Product.GetAll();
        }

        [HttpGet("category/{categoryId}")]
        public async Task<IActionResult> GetProductsByCategory(int categoryId)
        {
            // Alınan ürünlerin sonucunda, belirtilen kategoriye sahip ürünleri filtreler ve bir liste olarak alır.
            var products = await _unitOfWork.Product.GetAll();
            var matchingProducts = products.Result.Where(p => p.CategoryId == categoryId).ToList();

            // Eşleşen ürünlerin sayısı 0 ise, NotFound (404) döndürür.
            if (matchingProducts.Count == 0)
            {
                return NotFound();
            }
            // Eşleşen ürünlerin listesini Ok (200) döndürür.
            return Ok(matchingProducts);
        }


        // ÜRÜN EKLEME ENDPOINT'İ
        [HttpPost] 
        public async Task<ActionResult<ApplicationResult<ProductDto>>> AddProduct([FromForm] ProductImage image, [FromQuery] CreateProductInput input)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User); 
            string uniqueFileName = ImageFile(image); // Yüklenen resmin benzersiz dosya adını alır.
            var n = new CreateProductInput
            {
                BrandId = input.BrandId,
                CategoryId = input.CategoryId,
                ColorId = input.ColorId,
                Description = input.Description,
                Image = uniqueFileName,
                IsOfferable = input.IsOfferable,                          
                IsSold = input.IsSold,
                Name = input.Name,
                Price = input.Price,
                ProductCondition = input.ProductCondition,
                UserName = input.UserName
            };

           
            var result = await _unitOfWork.Product.Create(n, user); // Ürünü oluşturur ve kullanıcı ile ilişkilendirir.
            if (result.Succeeded) 
            {
                return result; 
            }

            return NotFound("Ürün eklenemedi!");

        }

        [HttpGet("{id}")] // ID'YE GÖRE ÇAĞIR
        public async Task<ActionResult<ApplicationResult<ProductDto>>> GetProductById(int id)
        {
            var product = await _unitOfWork.Product.Get(id);

            if (product == null)
            {
                return NotFound(); // Ürün bulunamadıysa 404 Not Found döndürülür.
            }

            return Ok(product); // Ürün bulunduysa 200 OK durumunda ürünün kendisi döndürülür.
        }

     
        [HttpGet("purchase/{id}")] // SATIN ALMA
        public async Task<ActionResult<ApplicationResult<ProductDto>>> Purchase(int id)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User); 
            var result = await _unitOfWork.Product.Get(id); 
            if (result.Succeeded) 
            {
                if (result.Result.IsSold is false) // Ürünün satılmadığı kontrol edilir.
                {
                    var maplendi =
                    new UpdateProductInput
                    {
                        Id = result.Result.Id,
                        BrandId = result.Result.BrandId,
                        ColorId = result.Result.ColorId,
                        CategoryId = result.Result.CategoryId,
                        Description = result.Result.Description,                   
                        UserName = result.Result.UserName,                          
                        IsOfferable = false,
                        IsSold = true,
                        Image = result.Result.Image,
                        Name = result.Result.Name,
                        Price = result.Result.Price,
                        ProductCondition = result.Result.ProductCondition
                    };

                    var resultt = await _unitOfWork.Product.Update(maplendi, user); 

                    return resultt;
                }
                else if (result.Result.IsSold is true) 
                {
                    return BadRequest("Bu ürün stokta kalmamış.");
                }
            }

            return NotFound(result);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateProductInput ([FromBody] UpdateProductInput updateProduct)
        {
            var user=await _userManager.GetUserAsync(User);
            var result = await _unitOfWork.Product.Update(updateProduct, user);

            if (result.Succeeded)
            {
                return Ok(result);
            }
            return BadRequest("Ürün Güncellenirken Hata Oluştu.");
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApplicationResult<ProductDto>>> DeleteProduct(int id)
        {
            var product = await _unitOfWork.Product.Get(id); // ID'ye göre ürünü al

            if (product == null)
            {
                return BadRequest("Böyle bir ürün bulunamadı.");
            }

            var username = _userManager.GetUserName(HttpContext.User); 

            if (product.Result.ModifiedBy == username) 
            {
                var result = await _unitOfWork.Product.Delete(id); // Ürünü sil
                if (result.Succeeded)
                {
                    return Ok("Ürün silindi.");
                }
            }
            else
            {
                return BadRequest("Size ait olmayan ürünü silemezsiniz!");
            }

            return BadRequest("Ürün silinirken bir hata oluştu.");
        }


    }
}
