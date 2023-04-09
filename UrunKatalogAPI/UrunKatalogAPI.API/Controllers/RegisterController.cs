using Hangfire;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UrunKatalogAPI.API.Extensions;
using UrunKatalogAPI.Core.Domain.Entities;
using UrunKatalogAPI.Core.Shared;
using UrunKatalogAPI.Infrastructere.DTO;
using UrunKatalogAPI.Infrastructere.Repositories;

namespace UrunKatalogAPI.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RegisterController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IConfiguration _configuration;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly IUnitOfWork _unitOfWork;
       // private readonly JwtConfig _jwtConfig;



        public RegisterController(UserManager<ApplicationUser> userManager, IConfiguration configuration, SignInManager<ApplicationUser> signInManager, IUnitOfWork unitOfWork, JwtConfig jwtConfig)
        {
            this.userManager = userManager;
            _configuration = configuration;
            this.signInManager = signInManager;
            _unitOfWork = unitOfWork;
           // _jwtConfig = jwtConfig;

        }

        [HttpPost] // REGISTER OLMA ENDPOINT'İ
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {

            if (ModelState.IsValid) //model validse
            {

                // Email Zaten Kaytlı
                var user_exist = await userManager.FindByEmailAsync(model.Email);
                if (user_exist != null)
                {
                    return BadRequest(new AuthResult()
                    {
                        Result = false,
                        Errors = new List<string>()
                        {
                            "Email zaten kayıtlı!"
                        }
                    });
                }

                //Kullanıcı oluşturma
                var newUser = new ApplicationUser
                {
                    UserName = model.Username,                 //yeni application user oluştur
                    Email = model.Email
                };

                var is_created = await userManager.CreateAsync(newUser, model.Password);

                if (is_created.Succeeded)
                {

                    //TOKEN ÜRETME

                    var token = GenerateJwtToken(newUser);

                    return Ok(new AuthResult()
                    {
                        Result = true,
                        Token = token
                    });

                }
                return BadRequest(new AuthResult()
                {
                    Result = false,
                    Errors = new List<string>() { "Server Error" }
                });
            }
            return BadRequest();
        }
        private string GenerateJwtToken(ApplicationUser user)
        {
            var JwtTokenHandler=new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration.GetSection("JwtConfig:Secret").Value);


            //Token Desc

            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim("Id",user.Id),
                    new Claim(JwtRegisteredClaimNames.Sub,user.Email),
                    new Claim(JwtRegisteredClaimNames.Email,user.Email),
                    new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Iat,DateTime.Now.ToUniversalTime().ToString())
                }),
                Expires = DateTime.Now.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };
            var token = JwtTokenHandler.CreateToken(tokenDescriptor);
            return JwtTokenHandler.WriteToken(token);
           
        }
    }
   
}

       
 
   


//                var registerUser = await userManager.CreateAsync(newUser, model.Password); // usermanager ile kullanıcıyı oluştur
//                if (registerUser.Succeeded) //kullanıcı oluşturma başarılıysa
//                {
//                    var jwtToken = GetTokenResponse(newUser);
//                    await signInManager.SignInAsync(newUser, isPersistent: false); //signin
//                    var user = await userManager.FindByNameAsync(newUser.UserName);

//                    ////hoşgeldiniz emaili
//                    //BackgroundJob.Enqueue(() => sendEmailJob.DoRegisterJob(model.Email, model.Username)); // mail gönderme background servisini çalıştır

//                    //CreateMailInput input = new()
//                    //{
//                    //    CreatedBy = user.UserName,         // Statüsü "mail gönderildi" olan yeni bir mail kaydı ekle database'e
//                    //    CreatedById = user.Id,
//                    //    CreatedDate = DateTime.Now,
//                    //    Status = "Sent"

//                    //};

//                    //await _unitOfWork.Mail.Create(input, user); //Statüsü "mail gönderildi" olan yeni bir mail kaydı ekle database'e
//                    //var failJob = Hangfire.SqlServer.SqlServerStorage.Current.GetMonitoringApi().FailedCount(); // hangfiredaki failed olan jobları count et değişkene at
//                    //if (failJob is 1) // background serviste başarısız olan mailleri 5 kez göndermeyi dene yine başarısızsa failed tablosuna at diye config yaptık. Eğer 5 kez denedi ve failed tablosuna attıysa burası 1 olacaktır. Eğer 1 ise
//                    //{
//                    //    var kk = _unitOfWork.Mail.GetAll().Result.Result.Find(x => x.CreatedById == user.Id); //mail tablosundaki ilgili maili bul
//                    //    UpdateMailInput updateMail = new()
//                    //    {
//                    //        Id = kk.Id,
//                    //        CreatedBy = kk.CreatedBy,
//                    //        CreatedById = kk.CreatedById, // statüsünü failed'e çek
//                    //        CreatedDate = kk.CreatedDate,
//                    //        Status = "Failed"

//                    //    };
//                    //    await _unitOfWork.Mail.Update(updateMail, user); // güncelle
//                    //    Hangfire.SqlServer.SqlServerStorage.Current.GetMonitoringApi().FailedJobs(0, int.MaxValue).Clear(); // failed jobs 'ı temizle
//                    //}
//                    return Ok(jwtToken);

//                }
//                AddErrors(registerUser);
//            }
//            return BadRequest("İşlem başarısız!");
//        }
//        private void AddErrors(IdentityResult result) //ERROR METODU
//        {
//            foreach (var err in result.Errors)
//            {
//                ModelState.AddModelError("error", err.Description);
//            }
//        }
//        private JwtTokenResult GetTokenResponse(ApplicationUser user) // TOKEN RESPONSE'UNU DÖNEN METOT
//        {
//            var token = GetToken(user).ToString();
//            JwtTokenResult result = new()
//            {
//                AccessToken = token,
//                ExpireInSeconds = _configuration.GetValue<int>("Tokens:Lifetime"),
//                UserId = user.Id
//            };
//            return result;
//        }

//        private JwtTokenResult GetToken(ApplicationUser user) //TOKEN ÜRETEN METOT
//        {
//            var utcNow = DateTime.UtcNow;
//            JwtTokenResult token = new JwtTokenResult();
//            var claims = new Claim[]
//            {
//                        new Claim(ClaimTypes.NameIdentifier, user.Id),
//                        new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
//                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
//                        new Claim(JwtRegisteredClaimNames.Iat, utcNow.ToString())
//            };

//            var signingKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
//            var signingCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
//            JwtSecurityToken securityToken = new JwtSecurityToken(
//                claims: claims,
//                notBefore: utcNow,
//                expires: DateTime.Now.AddDays(30),
//                audience: _configuration["JWT:ValidAudience"],
//                issuer: _configuration["JWT:ValidIssuer"],
//                signingCredentials: signingCredentials
//                );

//            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
//            string accessToken = tokenHandler.WriteToken(securityToken);
//            token.AccessToken = accessToken;
//            token.UserId = Guid.NewGuid().ToString();

//            return token;
//        }
//    }
//}
