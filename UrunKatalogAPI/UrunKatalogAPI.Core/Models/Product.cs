using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Entities.Common;
using UrunKatalogAPI.Core.Enum;

namespace UrunKatalogAPI.Core.Models
{
    public class Product : BaseEntity
    {
        public string ProductName { get; set; }
        public string Description { get; set; }
        public int CategoryId { get; set; }
        public string ImageLink { get; set; }
        public string Color { get; set; }
        public string Brand { get; set; }
        public ProductStatuses ProductStatus { get; set; }
        public decimal Price { get; set; }
        public bool isOfferable { get; set; } = false;
        public bool isSold { get; set; } = false;
        public string OwnerId { get; set; }
        public virtual Category CategoryParentNavigation { get; set; }
        public virtual AppUser UserParentNavigation { get; set; }
        public virtual ICollection<Offer> Offers { get; set; }


    }
}
