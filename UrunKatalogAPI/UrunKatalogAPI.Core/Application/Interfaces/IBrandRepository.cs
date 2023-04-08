using System;
using System.Collections.Generic;
using System.Drawing.Drawing2D;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.API.Shared;
using UrunKatalogAPI.Core.Domain.Entities;

namespace UrunKatalogAPI.Core.Application.Interfaces
{
    public interface IBrandRepository : IRepository<Brand>
    {
        Task<PaginatedResult<Brand>> GetAll(Filter filter);
    }
}
