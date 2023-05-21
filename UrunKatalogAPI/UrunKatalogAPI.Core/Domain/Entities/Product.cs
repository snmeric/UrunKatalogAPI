using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Shared;

namespace UrunKatalogAPI.Core.Domain.Entities
{
    public class Product : Entity
    {
        public string Name { get; set; }
        public string Description { get; set; }

        [ForeignKey("ColorId")]
        public virtual Color Color { get; set; }
        public virtual int? ColorId { get; set; }
        [ForeignKey("BrandId")]
        public virtual Brand Brand { get; set; }
        public virtual int? BrandId { get; set; }
        public string ProductCondition { get; set; }
        public string Image { get; set; }
        public int Price { get; set; }
        public string UserName { get; set; }
        public bool IsOfferable { get; set; } = false;
        public bool IsSold { get; set; } = false;
        [ForeignKey("CategoryId")]
        public virtual Category Category { get; set; }
        public virtual int? CategoryId { get; set; }
    }
}
