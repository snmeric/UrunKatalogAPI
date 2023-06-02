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

        public AuthenticateController(UserManager<ApplicationUser> userManager, IConfiguration configuration, SignInManager<ApplicationUser> signInManager, IUnitOfWork unitOfWork, ISendEmailJob sendEmailJob)
        {
            _userManager = userManager;
            _configuration = configuration;
            _signInManager = signInManager;
            _unitOfWork = unitOfWork;
            this.sendEmailJob = sendEmailJob;

        }

        [HttpPost]
        [Route("register")]
        // Register olma endpoint'i
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            // Modelin geçerlilik kontrolü
            if (!ModelState.IsValid)
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

            // Email zaten kayıtlı mı kontrolü
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

            // Yeni kullanıcı oluşturma
            ApplicationUser newUser = new()
            {
                UserName = model.Username,
                SecurityStamp = Guid.NewGuid().ToString(),
                Email = model.Email
            };

            var registerUser = await _userManager.CreateAsync(newUser, model.Password);

            if (registerUser.Succeeded)
            {
                await _signInManager.SignInAsync(newUser, isPersistent: false);
                var user = await _userManager.FindByNameAsync(newUser.UserName);

                // Kayıt işlemi başarılıysa e-posta gönderimi
                BackgroundJob.Enqueue(() => sendEmailJob.DoRegisterJob(model.Email));

                CreateMailInput input = new()
                {
                    CreatedBy = user.UserName,
                    CreatedById = user.Id,
                    CreatedDate = DateTime.Now,
                    Status = "Sent"

                };

                await _unitOfWork.Mail.Create(input, user);
                // Başarısız olan görevlerin sayısını al
                var failJob = Hangfire.SqlServer.SqlServerStorage.Current.GetMonitoringApi().FailedCount();

                // Eğer sadece bir tane başarısız görev varsa
                if (failJob is 1)
                {
                    var foundMail = _unitOfWork.Mail.GetAll().Result.Result.Find(x => x.CreatedById == user.Id);

                    // E-posta güncelleme bilgilerini oluştur
                    UpdateMailInput updateMail = new()
                    {
                        Id = foundMail.Id, // Id: Güncellenecek e-postanın kimliği
                        CreatedBy = foundMail.CreatedBy,  // CreatedBy: E-postanın oluşturan kullanıcı
                        CreatedById = foundMail.CreatedById,  // CreatedById: E-postayı oluşturan kullanıcının kimliği
                        CreatedDate = foundMail.CreatedDate,  // CreatedDate: E-postanın oluşturulma tarihi
                        Status = "Failed"   // Status: E-postanın durumu (Failed olarak ayarlanacak)

                    };

                    // E-postayı güncelle
                    await _unitOfWork.Mail.Update(updateMail, user);
                    Hangfire.SqlServer.SqlServerStorage.Current.GetMonitoringApi().FailedJobs(0, int.MaxValue).Clear();  // Başarısız görevleri temizle
                }
                // İşlem başarılıysa kullanıcıya token dönüşü yap
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

        // TOKEN DÖNEN METOT
        private JwtTokenResult GetTokenResponse(ApplicationUser user)
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


        // Login olma endpoint'i
        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {

            if (ModelState.IsValid)
            {
                // Kullanıcının e-posta adresine göre kullanıcıyı bul
                var userEmail = await _userManager.FindByEmailAsync(model.Email);

                // Eğer kullanıcı bulunamazsa hata dön
                if (userEmail == null)
                {
                    return BadRequest("Email Kayıtlı Değil");
                }

                // Kullanıcı adı ve şifreyle giriş yapma işlemi
                var loginResult = await _signInManager.PasswordSignInAsync(userEmail.UserName, model.Password, true, false);


                // Eğer giriş başarısız ise
                if (!loginResult.Succeeded)
                {

                    var user = await _userManager.FindByEmailAsync(model.Email);
                    await _userManager.AccessFailedAsync(user);
                    var failedCount = _userManager.GetAccessFailedCountAsync(user);
                    if (failedCount.Result.Equals(3)) // Eğer 3 başarısız giriş varsa
                    {
                        // Arkaplanda bir e-posta gönderme işi planla
                        BackgroundJob.Enqueue(() => sendEmailJob.DoLogInJob(model.Email)); 
                        CreateMailInput input = new()
                        {
                            CreatedBy = user.UserName,
                            CreatedById = user.Id,
                            CreatedDate = DateTime.Now,
                            Status = "Sent"

                        };
                        await _userManager.DeleteAsync(user); // Kullanıcıyı sil (hesabı bloke et)
                        await _unitOfWork.Mail.Create(input, user); // E-postayı oluştur
                        var failJob = Hangfire.SqlServer.SqlServerStorage.Current.GetMonitoringApi().FailedCount(); // Başarısız görev sayısını al
                        if (failJob is 1)
                        {
                            var foundMail = _unitOfWork.Mail.GetAll().Result.Result.Find(x => x.CreatedById == user.Id);  // Kullanıcının oluşturduğu e-postayı al

                            // E-posta güncelleme bilgilerini oluştur
                            UpdateMailInput updateMail = new()
                            {
                                Id = foundMail.Id,
                                CreatedBy = foundMail.CreatedBy,
                                CreatedById = foundMail.CreatedById,
                                CreatedDate = foundMail.CreatedDate,
                                Status = "Failed"

                            };
                            await _unitOfWork.Mail.Update(updateMail, user);
                            Hangfire.SqlServer.SqlServerStorage.Current.GetMonitoringApi().FailedJobs(0, int.MaxValue).Clear(); // Başarısız görevleri temizle
                        };
                        return BadRequest("Hesabınız bloke oldu. Mail atılmıştır.");
                    }
                    return BadRequest("Giriş yapılamadı. Bilgilerinizi kontrol ediniz.");
                }
                var userByEmail = await _userManager.FindByEmailAsync(model.Email); // Kullanıcıyı tekrar bul

                var response = new // Kullanıcı adı ve token bilgilerini oluştur
                {
                    UserName = userByEmail.UserName,
                    Token = GetTokenResponse(userByEmail)
                };
                return Ok(response);
            }
            return BadRequest(ModelState);
        }
    }
}


