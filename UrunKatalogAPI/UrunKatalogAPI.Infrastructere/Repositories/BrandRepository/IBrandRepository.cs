using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Infrastructere.DTO;

namespace UrunKatalogAPI.Infrastructere.Repositories.BrandRepository
{
    public interface IBrandRepository : IRepository<int, BrandDto, CreateBrandInput, UpdateBrandInput, ApplicationUser>
    {

    }
}
