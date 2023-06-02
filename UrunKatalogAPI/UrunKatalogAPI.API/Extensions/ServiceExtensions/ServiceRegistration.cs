using Microsoft.EntityFrameworkCore;
using UrunKatalogAPI.Infrastructere;
using UrunKatalogAPI.Infrastructere.UnitOfWork;

namespace UrunKatalogAPI.API.Extensions.ServiceExtensions
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
