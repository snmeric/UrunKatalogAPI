using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Shared;

namespace UrunKatalogAPI.Infrastructere.Repositories
{
    public interface IRepository<PK, MainDto, CreateDto, UpdateDto, ApplicationUser>
    {
        Task<ApplicationResult<MainDto>> Get(PK id);
        Task<ApplicationResult<List<MainDto>>> GetAll();
        Task<ApplicationResult<MainDto>> Create(CreateDto input, ApplicationUser applicationUser);
        Task<ApplicationResult<MainDto>> Update(UpdateDto input, ApplicationUser applicationUser);
        Task<ApplicationResult> Delete(PK id);
    }
}
