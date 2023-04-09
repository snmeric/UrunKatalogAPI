using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using UrunKatalogAPI.Infrastructere.Repositories;
using UrunKatalogAPI.Infrastructere;

namespace UrunKatalogAPI.API
{
    public static class ServiceRegistration
    {
        public static void AddPersistenceServices(this IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer(Configuration.ConnectionString);

            });
          
            services.AddScoped<IUnitOfWork, UnitOfWork>();


            
    }
     
    }
}
