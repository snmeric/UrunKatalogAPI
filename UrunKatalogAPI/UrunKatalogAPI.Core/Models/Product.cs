using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Entities.Common;

namespace UrunKatalogAPI.Core.Models
{
    public class Product : BaseEntity
    {
            public string Name { get; set; }
            public string Description { get; set; }
            public string Color { get; set; }
            public string Brand { get; set; }
            public string ProductCondition { get; set; }
            public string Image { get; set; }
            public int Price { get; set; }
            public string UserName { get; set; }
            public bool IsOfferable { get; set; } = false;
            public bool IsSold { get; set; } = false;
            public int CategoryId { get; set; }
            public Category Category { get; set; }


    }
}
