using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.TeamFoundation.Work.WebApi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Infrastructere.Repositories.CategoryRepository;
using UrunKatalogAPI.Infrastructere.Repositories.MailRepository;
using UrunKatalogAPI.Infrastructere.Repositories.OfferRepository;
using UrunKatalogAPI.Infrastructere.Repositories.ProductRepository;

namespace UrunKatalogAPI.Infrastructere.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ILogger logger;
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
            this.logger = loggerFactory.CreateLogger("Project");
            _mapper = mapper;

            CategoryRepository.CategoryRepository Category = new CategoryRepository.CategoryRepository(context, mapper);
            ProductRepository.ProductRepository Product = new ProductRepository.ProductRepository(context, mapper);
           OfferRepository.OfferRepository Offer = new OfferRepository.OfferRepository(context, mapper);
            MailRepository.MailRepository Mail = new MailRepository.MailRepository(context, mapper);
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
