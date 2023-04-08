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
    public class ColorRepository : Repository<Color>, IColorRepository
    {
        private readonly UrunKatalogDbContext _context;

        public ColorRepository(UrunKatalogDbContext context) : base(context)
        {
            _context = context;
        }

        public override async Task<Color> Get(int id)
        {
            var result = await _context.Colors
                                .FirstOrDefaultAsync(p => p.Id == id);

            if (result == null)
                throw new KeyNotFoundException("Not Found!");

            return result;
        }



        public override async Task<PaginatedResult<Color>> GetAll(Filter filter)
        {

            var query = _context.Colors.AsQueryable();

            var result = await query.ToPaginatedListAsync(filter.PageNumber, filter.PageSize);

            return result;

        }

    }
}
