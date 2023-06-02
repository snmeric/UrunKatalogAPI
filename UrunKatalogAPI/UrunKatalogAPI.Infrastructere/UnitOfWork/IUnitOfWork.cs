using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Infrastructere.Repositories.BrandRepository;
using UrunKatalogAPI.Infrastructere.Repositories.CategoryRepository;
using UrunKatalogAPI.Infrastructere.Repositories.ColorRepository;
using UrunKatalogAPI.Infrastructere.Repositories.MailRepository;
using UrunKatalogAPI.Infrastructere.Repositories.OfferRepository;
using UrunKatalogAPI.Infrastructere.Repositories.ProductRepository;

namespace UrunKatalogAPI.Infrastructere.UnitOfWork
{
    public interface IUnitOfWork
    {
        IColorRepository Color { get; }
        IBrandRepository Brand { get; }
        ICategoryRepository Category { get; }
        IProductRepository Product { get; }
        IOfferRepository Offer { get; }
        IMailRepository Mail { get; }
        int Complete();
    }
}
