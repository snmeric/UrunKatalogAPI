using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrunKatalogAPI.Infrastructere
{
    public class UrunKatalogDbContext : DbContext
    {
        public UrunKatalogDbContext(DbContextOptions options) : base(options)
        {
        }
    }
}
