using AutoMapper;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.TeamFoundation.TestManagement.WebApi;
using Swashbuckle.AspNetCore.Filters;
using System.Reflection;
using System.Text;
using UrunKatalogAPI.API;
using UrunKatalogAPI.API.Extensions;
using UrunKatalogAPI.Core.Shared.Filters;
using UrunKatalogAPI.Infrastructere;
using UrunKatalogAPI.Infrastructere.Mapping;
using UrunKatalogAPI.Infrastructere.Repositories;


var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddMvc(options =>
{
    options.EnableEndpointRouting = false;
    options.Filters.Add<ValidationFilter>();
})
           .AddFluentValidation(m => m.RegisterValidatorsFromAssemblyContaining<Program>())
           .SetCompatibilityVersion(Microsoft.AspNetCore.Mvc.CompatibilityVersion.Version_3_0);

builder.Services.AddDataProtection()
      .PersistKeysToFileSystem(new DirectoryInfo(Path.GetTempPath()))
      .SetApplicationName("UrunKatalogAPI");


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

builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredUniqueChars = 1;
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(Configuration.ConnectionString);

});

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

var mappingConfig = new MapperConfiguration(mc =>
{
    mc.AddProfile(new AutoMapperProfile());
});
IMapper mapper = mappingConfig.CreateMapper();
builder.Services.AddSingleton(mapper);

builder.Services.AddAutoMapper(typeof(Program).Assembly);


// Adding Authentication and jwt 
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
        //  RequireExpirationTime=false,
        // ValidateLifetime=true,
        ValidIssuer = builder.Configuration["JwtConfig:ValidIssuer"],
        ValidAudience = builder.Configuration["JwtConfig:ValidAudience"],
        // ClockSkew = TimeSpan.Zero

    };
});

builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
             .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

//builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = false
//    ).AddEntityFrameworkStores<ApplicationDbContext>().AddDefaultTokenProviders();



var app = builder.Build();

//app.Use((context, next) =>
//{
//    context.Request.EnableBuffering();
//    return next();
//});

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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "UrunKatalogAPI.API v1"));
}
//app.UseCustomGlobalException();

app.UseHttpLogging();
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();




app.MapControllers();

app.Run();
