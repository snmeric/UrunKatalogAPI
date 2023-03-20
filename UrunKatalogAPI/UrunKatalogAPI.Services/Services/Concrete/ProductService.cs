using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.DTO;
using UrunKatalogAPI.Core.Models;
using UrunKatalogAPI.Services.Services.Abstract;

namespace UrunKatalogAPI.Services.Services.Concrete
{
    public class ProductService:BaseService<ProductDto,Product>,IProductService
    {
    }
}
