using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Infrastructere.DTO;

namespace UrunKatalogAPI.Infrastructere.Repositories.CategoryRepository.CategoryRepository
{
    public interface ICategoryRepository : IRepository<int, CategoryDto, CreateCategoryInput, UpdateCategoryInput, ApplicationUser>
    {

    }
}
