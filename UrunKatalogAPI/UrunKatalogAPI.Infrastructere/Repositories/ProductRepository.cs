using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Interfaces;
using UrunKatalogAPI.Core.Models;

namespace UrunKatalogAPI.Infrastructere.Repositories
{
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        protected readonly UrunKatalogDbContext dbContext;

        public ProductRepository(UrunKatalogDbContext context) : base(context)
        {
            dbContext = context;
        }
    }
}
