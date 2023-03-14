using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.DTO;
using UrunKatalogAPI.Core.Models;

namespace UrunKatalogAPI.Services.Services.Abstract
{
    public interface ICategoryService :IGenericRepositoryService<CategoryDto,Category>
    {

    }
}
