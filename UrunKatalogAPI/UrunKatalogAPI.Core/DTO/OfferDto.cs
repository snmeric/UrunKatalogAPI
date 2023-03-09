using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Enum;

namespace UrunKatalogAPI.Core.DTO
{
    public class OfferDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string OfferUserId { get; set; }
        public OfferStatuses OfferStatus { get; set; }
        public decimal OfferPrice { get; set; } 
        public decimal OfferPercent { get; set; } 
    }
    public class InsertOfferDto 
    {
        public int ProductId { get; set; }
        public decimal OfferPrice { get; set; } 
        public decimal OfferPercent { get; set; } 
    }
    public class BuyOfferDto 
    {
        public int ProductId { get; set; }
        public OfferStatuses OfferStatus { get; set; } = OfferStatuses.Accept;
    }
}
