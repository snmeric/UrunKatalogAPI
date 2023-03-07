using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Models;
using UrunKatalogAPI.Core.Shared;

namespace UrunKatalogAPI.Core.Interfaces
{
    public interface IGenericRepository<TEntity> where TEntity : class
    {
        Task<TEntity> GetByIdAsync(int id);
        Task<IEnumerable<TEntity>> GetAllAsync();
        IQueryable<TEntity> Find(Expression<Func<TEntity, bool>> expression);
        Task InsertAsync(TEntity entity);
        void Update(TEntity entity); 
        void Delete(TEntity entity);

    }
}
