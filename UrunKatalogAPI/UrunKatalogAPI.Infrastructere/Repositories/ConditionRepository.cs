using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Application.Interfaces;
using UrunKatalogAPI.Core.Domain.Entities;

namespace UrunKatalogAPI.Infrastructere.Repositories
{
    public class ConditionRepository : Repository<Condition>, IConditionRepository
    {
        private readonly UrunKatalogDbContext _context;

        public ConditionRepository(UrunKatalogDbContext context) : base(context)
        {
            _context = context;
        }

        public override async Task<Condition> Get(int id)
        {
            var result = await _context.Conditions
                                .FirstOrDefaultAsync(p => p.Id == id);

            if (result == null)
                throw new KeyNotFoundException("Not Found!");

            return result;
        }



        public override async Task<PaginatedResult<Condition>> GetAll(Filter filter)
        {
            var query = _context.Conditions.AsQueryable();

            var result = await query.ToPaginatedListAsync(filter.PageNumber, filter.PageSize);

            return result;
        }

    }
}
