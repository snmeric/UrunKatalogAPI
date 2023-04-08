using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrunKatalogAPI.Core.Domain.Entities
{
    public class PurchaseHistory : BaseEntity
    {
        public Product Product { get; set; }
        public int? ProductId { get; set; }
        public AppUser Seller { get; set; }
        public string SellerId { get; set; }
        public AppUser Buyer { get; set; }
        public string BuyerId { get; set; }
        public int SoldPrice { get; set; }
        public DateTime PurchasedDate { get; set; }


    }
}
