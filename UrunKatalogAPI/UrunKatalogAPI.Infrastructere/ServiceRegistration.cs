using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace UrunKatalogAPI.Infrastructere
{
    public static class ServiceRegistration
    {
        public static IServiceCollection AddPersistenceServices(this IServiceCollection services)
        {

            ConfigurationManager configurationManager = new();
            configurationManager.SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../UrunKatalogAPI.API"));
            configurationManager.AddJsonFile("appsettings.json");

            services.AddDbContext<UrunKatalogDbContext>(options =>
            {
                options.UseSqlServer(configurationManager.GetConnectionString("DefaultConnection"));
            });
            return services;
        }
    }
}
