using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Interfaces;
using UrunKatalogAPI.Core.Models;
using UrunKatalogAPI.Core.Shared;

namespace UrunKatalogAPI.Infrastructere.Repositories
{
    public abstract class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity : class
    {
        protected readonly UrunKatalogDbContext _context;
        private readonly DbSet<TEntity> _dbSet;
        public GenericRepository(UrunKatalogDbContext context)
        {
            _context = context;
            _dbSet=context.Set<TEntity>();
        }

        public void Delete(TEntity entity)
        {
            _dbSet.Remove(entity);
        }

        public IQueryable<TEntity> Find(Expression<Func<TEntity, bool>> expression)
        {
            return _dbSet.Where(expression);
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return await _dbSet.AsNoTracking().ToListAsync();
        }

        public async virtual Task<TEntity> GetByIdAsync(int id)
        {
            var result = await _dbSet.FindAsync(id);
            if (result != null)
                _context.Entry(result).State = EntityState.Detached;
            return result;
        }

        public async Task InsertAsync(TEntity entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public void Update(TEntity entity)
        {
            _dbSet.Update(entity);
        }
    }
}
