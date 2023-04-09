using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Infrastructere.Repositories.CategoryRepository;
using UrunKatalogAPI.Infrastructere.Repositories.MailRepository;
using UrunKatalogAPI.Infrastructere.Repositories.OfferRepository;
using UrunKatalogAPI.Infrastructere.Repositories.ProductRepository;

namespace UrunKatalogAPI.Infrastructere.Repositories
{
    public interface IUnitOfWork
    {
        ICategoryRepository Category { get; }
        IProductRepository Product { get; }
        IOfferRepository Offer { get; }
        IMailRepository Mail { get; }
        int Complete();
    }
}
