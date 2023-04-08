using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Domain.Entities;

namespace UrunKatalogAPI.Core.Application.Interfaces
{
    public interface IOfferRepository : IRepository<Offer>
    {
        Task<IEnumerable<Offer>> GetMyOffers(string userId);
        Task<IEnumerable<Offer>> GetMyProducts(string userId);
        Task<bool> IsOfferable(Offer offer);
    }
}
