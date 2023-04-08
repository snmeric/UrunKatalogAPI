using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Domain.Entities;

namespace UrunKatalogAPI.Core.Application.Interfaces
{
    public interface IPurchaseHistoryRepository : IRepository<PurchaseHistory>
    {
        Task<IEnumerable<PurchaseHistory>> GetAllSold(string userId);
        Task<IEnumerable<PurchaseHistory>> GetAllPurchased(string userId);
    }
}
