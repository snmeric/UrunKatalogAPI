using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.API.Shared;
using UrunKatalogAPI.Core.Application.Interfaces;
using UrunKatalogAPI.Core.Domain.Entities;

namespace UrunKatalogAPI.Infrastructere.Repositories
{
    public abstract class Repository<TEntity> : IRepository<TEntity> where TEntity : class
    {
        private readonly UrunKatalogDbContext _context;


        public Repository(UrunKatalogDbContext context)
        {
            _context = context;
        }

        //we use abstract for gets here because every model has different includes
        public void Add(TEntity entity)
        {
            _context.Set<TEntity>().Add(entity);
        }


        public void Remove(TEntity entity)
        {
            _context.Set<TEntity>().Remove(entity);
        }

        public abstract Task<TEntity> Get(int id);

        public abstract Task<PaginatedResult<TEntity>> GetAll(Filter filter);
    }
}
