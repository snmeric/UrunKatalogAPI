using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Interfaces;

namespace UrunKatalogAPI.Infrastructere.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly UrunKatalogDbContext dbContext;
        public UnitOfWork(UrunKatalogDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public void Commit()
        {
            dbContext.SaveChanges();
        }

        public async Task CommitAsync()
        {
            await dbContext.SaveChangesAsync();
        }
    }
}
