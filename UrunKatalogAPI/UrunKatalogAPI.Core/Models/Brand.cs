using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Entities.Common;

namespace UrunKatalogAPI.Core.Models
{
    public class Brand : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
