using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Entities.Common;
using UrunKatalogAPI.Core.Enum;

namespace UrunKatalogAPI.Core.Models
{
    public class Offer : BaseEntity
    {
        public int ProductId { get; set; }
        public OfferStatuses OfferStatus { get; set; }
        public decimal OfferPrice { get; set; } 
        public decimal OfferPercent { get; set; } 

    }
}
