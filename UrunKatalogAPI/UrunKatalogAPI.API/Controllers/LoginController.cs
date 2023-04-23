//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.VisualStudio.Services.Users;
//using UrunKatalogAPI.Core.Domain.Entities;
//using UrunKatalogAPI.Infrastructere.DTO;
//using UrunKatalogAPI.Infrastructere.Repositories;

//namespace UrunKatalogAPI.API.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class LoginController : ControllerBase
//    {
//        private readonly UserManager<ApplicationUser> userManager;
//        private readonly IConfiguration _configuration;
//        private readonly SignInManager<ApplicationUser> signInManager;
//        private readonly IUnitOfWork _unitOfWork;
      

//        public LoginController(UserManager<ApplicationUser> userManager, IConfiguration configuration, SignInManager<ApplicationUser> signInManager, IUnitOfWork unitOfWork)
//        {
//            this.userManager = userManager;
//            _configuration = configuration;
//            this.signInManager = signInManager;
//            _unitOfWork = unitOfWork;
         
//        }

//        [HttpPost] // LOGIN OLMA ENDPOINT'İ
//        public async Task<IActionResult> Login([FromBody] LoginModel model)
//        {

//            if (ModelState.IsValid)
//            {
//                var loginResult = await signInManager.PasswordSignInAsync(model.Email, model.Password, true, false); // username ve password ile giriş yap
//                if (loginResult.Succeeded) // giriş başarısız olduysa
//                {
//                    var user = await userManager.FindByNameAsync(model.Email); //bul user değişkenine at
//                }
//                else
//                {

//                    var user = await userManager.FindByNameAsync(model.Email); //bul user değişkenine at
//                    await userManager.AccessFailedAsync(user);
//                    var failedCount = userManager.GetAccessFailedCountAsync(user);

//                    return BadRequest("Giriş yapılamadı. Bilgilerinizi kontrol ediniz."); // giriş başarısızsa
//                }

//                return Ok("Giriş Başarılı"); // model state valid ise
//            }
//            return BadRequest(ModelState); // model state valid değil ise
//        }



//    }
//}
