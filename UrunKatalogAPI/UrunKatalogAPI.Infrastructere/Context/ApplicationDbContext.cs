using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using UrunKatalogAPI.Core.Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using UrunKatalogAPI.Infrastructere.Repositories;
using UrunKatalogAPI.Infrastructere.Context;

namespace UrunKatalogAPI.Infrastructere
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
      
    }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
        public DbSet<Color> Colors { get; set; }
        public DbSet<Brand> Brandies { get; set; }
        public DbSet<Category> Categories { get; set; }

        public DbSet<Product> Products { get; set; }
        public DbSet<Offer> Offers { get; set; }
        public DbSet<Mail> Mails { get; set; }
        public override int SaveChanges()
        {
            return base.SaveChanges();
        }
    }
}
