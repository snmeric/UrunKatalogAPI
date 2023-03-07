using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Interfaces;
using UrunKatalogAPI.Core.Models;

namespace UrunKatalogAPI.Infrastructere.Repositories
{
    public class OfferRepository:GenericRepository<Offer>,IOfferRepository
    {
        protected readonly UrunKatalogDbContext dbContext;

        public OfferRepository(UrunKatalogDbContext context) : base(context)
        {
            dbContext = context;
        }
    }
}
