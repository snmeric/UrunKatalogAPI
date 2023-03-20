using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Interfaces;
using UrunKatalogAPI.Core.Models;

namespace UrunKatalogAPI.Infrastructere.Repositories
{
    public class CategoryRepository : GenericRepository<Category>, ICategoryRepository
    {
        protected readonly UrunKatalogDbContext _dbContext;
        private readonly DbSet<Category> _dbSet;
        public CategoryRepository(UrunKatalogDbContext context) : base(context)
        {
            _dbContext = context;
            _dbSet = context.Set<Category>();

        }
        public async override Task<Category> GetByIdAsync(int id)
        {
            var result=await _dbSet.Include(r=>r.Products)
                                    .AsNoTracking()
                                    .FirstOrDefaultAsync(r=>r.Id==id);
            return result;
        }
    }
}
