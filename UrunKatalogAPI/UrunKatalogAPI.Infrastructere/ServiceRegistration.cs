using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace UrunKatalogAPI.Infrastructere
{
    public static class ServiceRegistration
    {
        public static void AddPersistenceServices(this IServiceCollection services)
        {
            services.AddDbContext<UrunKatalogDbContext>(options=> options.UseSqlServer(
              "Server=MERIC\\SQLEXPRESS; Database=UrunKatalog;Trusted_Connection=True;"
                ));
        }
    }
}
