using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.TeamFoundation.Work.WebApi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Infrastructere;
using UrunKatalogAPI.Infrastructere.Repositories.CategoryRepository;
using UrunKatalogAPI.Infrastructere.Repositories.MailRepository;
using UrunKatalogAPI.Infrastructere.Repositories.OfferRepository;
using UrunKatalogAPI.Infrastructere.Repositories.ProductRepository;

namespace UrunKatalogAPI.API
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ILogger _logger;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;

        public ICategoryRepository Category { get; private set; }

        public IProductRepository Product { get; private set; }

        public IOfferRepository Offer { get; private set; }
        public IMailRepository Mail { get; private set; }

     

        public UnitOfWork(ApplicationDbContext context, ILoggerFactory loggerFactory, IConfiguration configuration, IMapper mapper)
        {
            _context = context;
            _logger = loggerFactory.CreateLogger("Project");
            _mapper = mapper;

           Category = new CategoryRepository(_context, _mapper);
           Product = new ProductRepository(_context, _mapper);
           Offer = new OfferRepository(_context, _mapper);
           Mail = new MailRepository(_context, _mapper);
        }

        public int Complete()
        {
            return _context.SaveChanges();
        }
        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
