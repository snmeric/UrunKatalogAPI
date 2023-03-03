using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Models;
using UrunKatalogAPI.Core.Shared;

namespace UrunKatalogAPI.Core.Interfaces
{
    public interface IGenericRepository<TEntity> where TEntity : class
    {
        Task<TEntity> GetById(int id);
        Task<PaginatedResult<TEntity>> GetAll(Filter filter);
        void Add(TEntity entity);
        void Remove(TEntity entity);
       
    }
}
