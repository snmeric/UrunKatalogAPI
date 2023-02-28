using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Interfaces;
using UrunKatalogAPI.Core.Models;
using UrunKatalogAPI.Core.Shared;

namespace UrunKatalogAPI.Infrastructere.Repositories
{
    public abstract class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : class
    {
        private readonly UrunKatalogDbContext _context;
        public GenericRepository(UrunKatalogDbContext context)
        {
            _context = context;
        }

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
