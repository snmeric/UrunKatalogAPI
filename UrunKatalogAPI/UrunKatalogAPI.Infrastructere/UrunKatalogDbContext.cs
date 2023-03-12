using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Models;

namespace UrunKatalogAPI.Infrastructere
{
    public class UrunKatalogDbContext : DbContext
    {
        public UrunKatalogDbContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Offer> Offers { get; set; }
        public DbSet<AppUser> AppUser { get; set; }
    }
}
