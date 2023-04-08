using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Domain.Entities;


namespace UrunKatalogAPI.Core.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<AppUser> Get(string id);
        Task<IEnumerable<AppUser>> GetAll();
        void Remove(AppUser appUser);

    }
}
