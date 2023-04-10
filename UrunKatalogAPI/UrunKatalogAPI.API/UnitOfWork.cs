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
using UrunKatalogAPI.Infrastructere.Repositories;
using UrunKatalogAPI.Infrastructere.Repositories.CategoryRepository.CategoryRepository;
using UrunKatalogAPI.Infrastructere.Repositories.CategoryRepository.UrunKatalogAPI.Infrastructere.Repositories.CategoryRepository;
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
        private readonly ApplicationDbContext context;

        public ICategoryRepository Category { get; private set; }

        public IProductRepository Product { get; private set; }

        public IOfferRepository Offer { get; private set; }
        public IMailRepository Mail { get; private set; }

     

        public UnitOfWork(ApplicationDbContext context, ILoggerFactory loggerFactory, IConfiguration configuration, IMapper mapper)
        {
            this.context = context;
            _logger = loggerFactory.CreateLogger("Project");
            _mapper = mapper;

           Category = new CategoryRepository(context, mapper);
           Product = new ProductRepository(context, mapper);
            Offer = new OfferRepository(context, mapper);
           Mail = new MailRepository(context, mapper);
        }

        public int Complete()
        {
            return context.SaveChanges();
        }
        public void Dispose()
        {
            context.Dispose();
        }
    }
}
