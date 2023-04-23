using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualStudio.Services.Users;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UrunKatalogAPI.API.Extensions;
using UrunKatalogAPI.Core.Domain.Entities;
using UrunKatalogAPI.Core.Shared;
using UrunKatalogAPI.Infrastructere.DTO;
using UrunKatalogAPI.Infrastructere.Repositories;
using static Microsoft.VisualStudio.Services.Graph.GraphResourceIds;

namespace UrunKatalogAPI.API.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class AuthenticateController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IUnitOfWork _unitOfWork;
        // private readonly JwtConfig _jwtConfig;



        public AuthenticateController(UserManager<ApplicationUser> userManager, IConfiguration configuration, SignInManager<ApplicationUser> signInManager, IUnitOfWork unitOfWork)
        {
            _userManager = userManager;
            _configuration = configuration;
            _signInManager = signInManager;
            _unitOfWork = unitOfWork;
            // _jwtConfig = jwtConfig;

        }

        [HttpPost]
        [Route("register")]
        // REGISTER OLMA ENDPOINT'İ
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {

            if (!ModelState.IsValid) //model validse
            {
                return BadRequest(new AuthResult()
                {
                    Result = false,
                    Errors = new List<string>()
                        {
                            "Başarısız!"
                        }
                });
            }

            // Email Zaten Kaytlı
            // usermanager ile kullanıcıyı oluştur
            var user_exist = await _userManager.FindByEmailAsync(model.Email);
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
            ApplicationUser newUser = new()
            {
                UserName = model.Username,
                SecurityStamp = Guid.NewGuid().ToString(),//yeni application user oluştur
                Email = model.Email
            };

            var registerUser = await _userManager.CreateAsync(newUser, model.Password);

            if (registerUser.Succeeded) //kullanıcı oluşturma başarılıysa
            {    
                await _signInManager.SignInAsync(newUser, isPersistent: false); //signin
                var user = await _userManager.FindByNameAsync(newUser.UserName);
                return Ok(GetTokenResponse(user));
            }
 
            return BadRequest(new AuthResult()
            {
                Result = false,
                Errors = new List<string>()
                        {
                            "Server Hatası!"
                        }
            });

        }
     

        private JwtTokenResult GetTokenResponse(ApplicationUser user) // TOKEN RESPONSE'UNU DÖNEN METOT
        {
            var token = GetToken(user);
            JwtTokenResult result = new()
            {
                AccessToken = token,
                ExpireInSeconds = _configuration.GetValue<int>("Tokens:Lifetime"),
                UserId = user.Id
            };
            return result;
        }
        private string GetToken(ApplicationUser user)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtConfig:Secret"]));
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
                                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                                new Claim(JwtRegisteredClaimNames.Iat, DateTime.UtcNow.ToString())
                };

            var jwt = new JwtSecurityToken(
                issuer: _configuration["JwtConfig:ValidIssuer"],
                audience: _configuration["JwtConfig:ValidAudience"],
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

            return new JwtSecurityTokenHandler().WriteToken(jwt);
        }

     

        [HttpPost]
        [Route("login")]            // LOGIN OLMA ENDPOINT'İ
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {

            if (ModelState.IsValid)
            {
                var userEmail = await _userManager.FindByEmailAsync(model.Email);
                var loginResult = await _signInManager.PasswordSignInAsync(userEmail.UserName, model.Password, true, false); // username ve password ile giriş yap
                if (!loginResult.Succeeded) // giriş başarılı
                {

                    var user = await _userManager.FindByEmailAsync(model.Email); //bul user değişkenine at
                    await _userManager.AccessFailedAsync(user);
                    var failedCount = _userManager.GetAccessFailedCountAsync(user);

                    return BadRequest("Giriş yapılamadı. Bilgilerinizi kontrol ediniz."); // giriş başarısızsa
                }
                var user1 = await _userManager.FindByEmailAsync(model.Email);

                return Ok( GetTokenResponse(user1)); // model state valid ise
            }
            return BadRequest(ModelState); // model state valid değil ise
        }
    }
}

