using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Application.Interfaces;

namespace UrunKatalogAPI.Infrastructere.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly UrunKatalogDbContext _context;

        public UnitOfWork(UrunKatalogDbContext context)
        {
            _context = context;
        }

        public async Task CompleteAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
