using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Domain.Entities;

namespace UrunKatalogAPI.Infrastructere.Context
{
    public interface IApplicationDbContext
    {
        DbSet<Category> Categories { get; }
        DbSet<Product> Products { get; }
        DbSet<Offer> Offers { get; }
        DbSet<Mail> Mails { get; }
        int SaveChanges();
    }
}
