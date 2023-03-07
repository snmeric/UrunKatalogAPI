using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Models;

namespace UrunKatalogAPI.Core.Interfaces
{
    public interface IUserRepository
    {
        Task<Mail> Get(string id);
        Task<List<Mail>> GetAll();
        void Remove(Mail appUser);

    }
}
