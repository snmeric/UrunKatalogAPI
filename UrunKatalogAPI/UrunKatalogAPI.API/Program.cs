using AutoMapper;
using FluentValidation.AspNetCore;
using Hangfire;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using System.Text;
using UrunKatalogAPI.API;
using UrunKatalogAPI.API.Extensions;
using UrunKatalogAPI.API.Extensions.ServiceExtensions;
using UrunKatalogAPI.Infrastructere.Services;
using UrunKatalogAPI.Infrastructere;
using UrunKatalogAPI.Infrastructere.Mapping;
using UrunKatalogAPI.Infrastructere.Repositories;
using UrunKatalogAPI.Infrastructere.Services.SendMail;
using UrunKatalogAPI.Infrastructere.UnitOfWork;

var builder = WebApplication.CreateBuilder(args);

// Kontrollerin eklenmesi
builder.Services.AddControllers();

// Veri koruma ayarlar�n�n yap�land�r�lmas�
builder.Services.AddDataProtection()
      .PersistKeysToFileSystem(new DirectoryInfo(Path.GetTempPath()))
      .SetApplicationName("UrunKatalogAPI");

// Hangfire'�n yap�land�r�lmas�
builder.Services.AddHangfire(x => x.UseSqlServerStorage(builder.Configuration["ConnectionStrings:DefaultConnection"]));
builder.Services.AddHangfireServer();

// E-posta g�nderimi i�in hizmetlerin yap�land�r�lmas�
builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("SmtpSettings"));
builder.Services.AddSingleton<IMailService, MailService>();
builder.Services.AddSingleton<ISendEmailJob, SendEmailJob>();

// API i�in Swagger'�n yap�land�r�lmas�
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(
    options =>
    {
        options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
        {
            Scheme = "Bearer",
            BearerFormat = "JWT",
            Description ="Standart Authorization header using the Bearer scheme{\"bearer {token}\")",
            In=ParameterLocation.Header,
            Name="Authorization",
            Type=SecuritySchemeType.ApiKey
        });
        options.OperationFilter<SecurityRequirementsOperationFilter>(); 
    }
    
    );


// Veritaban� ba�lant�s�n�n yap�land�r�lmas�
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(Configuration.ConnectionString);

});

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Unit of Work ve Mapper'�n eklenmesi
var mappingConfig = new MapperConfiguration(mc =>
{
    mc.AddProfile(new AutoMapperProfile());
});
IMapper mapper = mappingConfig.CreateMapper();
builder.Services.AddSingleton(mapper);
builder.Services.AddAutoMapper(typeof(Program).Assembly);


// Authentication ve jwt Ekleme
builder.Services.Configure<JwtConfig>(builder.Configuration.GetSection("JwtConfig"));
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(jwt =>
{
    var key = Encoding.ASCII.GetBytes(builder.Configuration.GetSection("JwtConfig:Secret").Value);
    jwt.RequireHttpsMetadata = false;
    jwt.SaveToken = true;
    jwt.TokenValidationParameters = new TokenValidationParameters()
    {

        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer= true,
        ValidateAudience= true,
        ValidIssuer = builder.Configuration["JwtConfig:ValidIssuer"],
        ValidAudience = builder.Configuration["JwtConfig:ValidAudience"],
    };
});

// CORS politikalar�n�n yap�land�r�lmas�
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name:MyAllowSpecificOrigins, policy =>
    {
        policy.WithOrigins("http://localhost:3000")
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// Kimlik do�rulama ve yetkilendirme eklentilerinin yap�land�r�lmas�
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
             .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();


// Uygulaman�n olu�turulmas�
var app = builder.Build();


// Hata y�netimi
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
        var error = exceptionHandlerPathFeature?.Error;
        var result = new { error = error?.Message };
        await context.Response.WriteAsJsonAsync(result);
    });
});

// Geli�tirme ortam�nda Swagger'�n etkinle�tirilmesi
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "UrunKatalogAPI.API v1"));
}

// Custom Global hata y�netimi kullan�m�
app.UseCustomGlobalException();

// Hangfire ve CORS'�n kullan�m�
app.UseHangfireDashboard();
app.UseCors(MyAllowSpecificOrigins);

app.UseHttpLogging();
app.UseHttpsRedirection();

// Statik dosyalar�n kullan�m�
app.UseStaticFiles(new StaticFileOptions {FileProvider=new PhysicalFileProvider(Path.Combine(builder.Environment.ContentRootPath,"images")),RequestPath="/Resources" });



// Kimlik do�rulama ve yetkilendirme kullan�m�
app.UseAuthentication();
app.UseAuthorization();

// Kontrollerin e�le�tirilmesi
app.MapControllers();


app.Run();
