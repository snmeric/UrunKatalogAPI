using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Models;

namespace UrunKatalogAPI.Core.Interfaces
{
    public interface IProductRepository : IGenericRepository<Product>  
    {
    }
}
