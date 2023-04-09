﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Infrastructere.DTO;

namespace UrunKatalogAPI.Infrastructere.Repositories.ProductRepository
{
    public interface IProductRepository : IRepository<int, ProductDto, CreateProductInput, UpdateProductInput, ApplicationUser>
    {

    }
}
