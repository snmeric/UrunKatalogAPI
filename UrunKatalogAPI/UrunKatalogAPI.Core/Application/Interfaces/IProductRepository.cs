using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Domain.Entities;

namespace UrunKatalogAPI.Core.Application.Interfaces
{
    public interface IProductRepository : IRepository<Product>
    {
        Task CreateSellInformation(PurchaseHistory purchaseInfo);
        Task BuyWithOffer(int id);
    }
}
