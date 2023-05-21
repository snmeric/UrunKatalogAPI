using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Infrastructere.DTO;

namespace UrunKatalogAPI.Infrastructere.Repositories.ColorRepository
{
    public interface IColorRepository : IRepository<int, ColorDto, CreateColorInput, UpdateColorInput, ApplicationUser>
    {

    }
}
