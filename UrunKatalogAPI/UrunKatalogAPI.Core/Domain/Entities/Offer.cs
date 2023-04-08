using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Domain.Enums;

namespace UrunKatalogAPI.Core.Domain.Entities
{
    public class Offer : BaseEntity
    {
        public AppUser User { get; set; }
        public string UserId { get; set; }
        public Product Product { get; set; }
        public int? ProductId { get; set; }
        public int OfferedPrice { get; set; }
        public OfferStatus OfferStatus { get; set; } = 0;

    }
}
