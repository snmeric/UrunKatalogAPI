using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.API.Shared;
using UrunKatalogAPI.Core.Domain.Entities;

namespace UrunKatalogAPI.Core.Application.Interfaces
{
    public interface IRepository<TEntity> where TEntity : class
    {
        Task<TEntity> Get(int id);

        Task<PaginatedResult<TEntity>> GetAll(Filter filter);

        void Add(TEntity entity);
        void Remove(TEntity entity);
    }
}
