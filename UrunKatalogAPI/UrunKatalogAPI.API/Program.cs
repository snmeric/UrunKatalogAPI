using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.TeamFoundation.TestManagement.WebApi;
using Swashbuckle.AspNetCore.Filters;
using System.Text;
using UrunKatalogAPI.API;
using UrunKatalogAPI.API.Extensions;
using UrunKatalogAPI.Core.Shared.Filters;
using UrunKatalogAPI.Infrastructere;
using UrunKatalogAPI.Infrastructere.Mapping;
using UrunKatalogAPI.Infrastructere.Repositories;


var builder = WebApplication.CreateBuilder(args);



builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(
    options =>
    {
        options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
        {
            Description="Standart Authorization header using the Bearer scheme{\"bearer {token}\")",
            In=ParameterLocation.Header,
            Name="Authorization",
            Type=SecuritySchemeType.ApiKey
        });
        options.OperationFilter<SecurityRequirementsOperationFilter>(); 
    }
    
    );



builder.Services.AddPersistenceServices();

builder.Services.AddAutoMapper(typeof(Program).Assembly);

//builder.Services.AddIdentityCore<ApplicationUser>(options =>
//{
//    options.Password.RequireDigit = false;
//    options.Password.RequireLowercase = false;
//    options.Password.RequireUppercase = false;
//    options.Password.RequireNonAlphanumeric = false;
//    options.Password.RequiredUniqueChars = 1;
//})
//             .AddEntityFrameworkStores<ApplicationDbContext>()
//             .AddDefaultTokenProviders();


// Adding Authentication and jwt 
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

builder.Services.AddIdentityCore<IdentityUser>(options=>options.SignIn.RequireConfirmedAccount=false
    ).AddEntityFrameworkStores<ApplicationDbContext>();
// Adding Authentication and jwt 
builder.Services.Configure<JwtConfig>(builder.Configuration.GetSection("JWT"));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(jwt =>
{
    var key = Encoding.ASCII.GetBytes(builder.Configuration.GetSection("JwtConfig:Secret").Value);
    jwt.SaveToken = true;
    jwt.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer= false,
        ValidateAudience=false,
        RequireExpirationTime=false,
        ValidateLifetime=true,

    };
});

//builder.Services.Configure<IdentityOptions>(options =>
//{
//    options.Password.RequireDigit = false;
//    options.Password.RequireLowercase = false;
//    options.Password.RequireUppercase = false;
//    options.Password.RequireNonAlphanumeric = false;
//    options.Password.RequiredUniqueChars = 1;
//});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "UrunKatalogAPI.API v1"));
}
app.UseCustomGlobalException();

app.UseHttpsRedirection();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();
