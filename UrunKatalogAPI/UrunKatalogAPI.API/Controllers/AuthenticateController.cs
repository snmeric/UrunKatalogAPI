using Hangfire;
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
using UrunKatalogAPI.API.SendMail;
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
        private readonly ISendEmailJob sendEmailJob;
        // private readonly JwtConfig _jwtConfig;






        public AuthenticateController(UserManager<ApplicationUser> userManager, IConfiguration configuration, SignInManager<ApplicationUser> signInManager, IUnitOfWork unitOfWork, ISendEmailJob sendEmailJob)
        {
            _userManager = userManager;
            _configuration = configuration;
            _signInManager = signInManager;
            _unitOfWork = unitOfWork;
            this.sendEmailJob = sendEmailJob;
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

                 //hoşgeldiniz emaili
                    BackgroundJob.Enqueue(() => sendEmailJob.DoRegisterJob(model.Email)); // mail gönderme background servisini çalıştır

                    CreateMailInput input = new()
                    {
                        CreatedBy = user.UserName,         // Statüsü "mail gönderildi" olan yeni bir mail kaydı ekle database'e
                        CreatedById = user.Id,
                        CreatedDate = DateTime.Now,
                        Status = "Sent"

                    };
                    
                    await _unitOfWork.Mail.Create(input, user); //Statüsü "mail gönderildi" olan yeni bir mail kaydı ekle database'e
                    var failJob = Hangfire.SqlServer.SqlServerStorage.Current.GetMonitoringApi().FailedCount(); // hangfiredaki failed olan jobları count et değişkene at
                    if (failJob is 1) // background serviste başarısız olan mailleri 5 kez göndermeyi dene yine başarısızsa failed tablosuna at diye config yaptık. Eğer 5 kez denedi ve failed tablosuna attıysa burası 1 olacaktır. Eğer 1 ise
                    {
                        var kk = _unitOfWork.Mail.GetAll().Result.Result.Find(x => x.CreatedById == user.Id); //mail tablosundaki ilgili maili bul
                        UpdateMailInput updateMail = new()
                        {
                            Id = kk.Id,
                            CreatedBy = kk.CreatedBy,
                            CreatedById = kk.CreatedById, // statüsünü failed'e çek
                            CreatedDate = kk.CreatedDate,
                            Status = "Failed"

                        };
                        await _unitOfWork.Mail.Update(updateMail, user); // güncelle
                        Hangfire.SqlServer.SqlServerStorage.Current.GetMonitoringApi().FailedJobs(0, int.MaxValue).Clear(); // failed jobs 'ı temizle
                    }

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
                expires: DateTime.Now.AddHours(5),
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
                if (userEmail == null)
                {
                    return BadRequest("Email Kayıtlı Değil");
                }
                var loginResult = await _signInManager.PasswordSignInAsync(userEmail.UserName, model.Password, true, false); // username ve password ile giriş yap



                if (!loginResult.Succeeded) // giriş başarısız
                {
                    
                    var user = await _userManager.FindByEmailAsync(model.Email); 
                    await _userManager.AccessFailedAsync(user);
                    var failedCount = _userManager.GetAccessFailedCountAsync(user);
                    if (failedCount.Result.Equals(5)) // 5 hata
                    {
                        BackgroundJob.Enqueue(() => sendEmailJob.DoLogInJob(model.Email)); 

                        CreateMailInput input = new()
                        {
                            CreatedBy = user.UserName,         // Statüsü "mail gönderildi" olan yeni bir mail kaydı ekle database'e
                            CreatedById = user.Id,
                            CreatedDate = DateTime.Now,
                            Status = "Sent"

                        };
                        await _userManager.DeleteAsync(user); // bloke
                        await _unitOfWork.Mail.Create(input, user); //"mail gönderildi"
                        var failJob = Hangfire.SqlServer.SqlServerStorage.Current.GetMonitoringApi().FailedCount(); 
                        if (failJob is 1) // background serviste başarısız olan mailleri 5 kez göndermeyi dene yine başarısızsa failed tablosuna at diye config yaptık. Eğer 5 kez denedi ve failed tablosuna attıysa burası 1 olacaktır. Eğer 1 ise
                        {
                            var kk = _unitOfWork.Mail.GetAll().Result.Result.Find(x => x.CreatedById == user.Id); //mail tablosundaki ilgili maili bul
                            UpdateMailInput updateMail = new()
                            {
                                Id = kk.Id,
                                CreatedBy = kk.CreatedBy,
                                CreatedById = kk.CreatedById, // statüsünü failed'e çek
                                CreatedDate = kk.CreatedDate,
                                Status = "Failed"

                            };
                            await _unitOfWork.Mail.Update(updateMail, user); // güncelle
                            Hangfire.SqlServer.SqlServerStorage.Current.GetMonitoringApi().FailedJobs(0, int.MaxValue).Clear(); // failed jobs 'ı temizle
                        };
                        return BadRequest("Hesabınız bloke oldu. Mail atılmıştır."); // tüm işlemleri yaptıktan sonra dön
                    }
                    return BadRequest("Giriş yapılamadı. Bilgilerinizi kontrol ediniz."); // giriş başarısızsa
                    }
                    var user1 = await _userManager.FindByEmailAsync(model.Email);
                var response = new
                {
                    UserName = user1.UserName, // Kullanıcının adını (username) döndür
                    Token = GetTokenResponse(user1)
                };
                return Ok(response); // model state valid ise
                }
                return BadRequest(ModelState); // model state valid değil ise
            }
        }
    }


