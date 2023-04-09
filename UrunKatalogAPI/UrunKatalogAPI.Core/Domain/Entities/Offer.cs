using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Shared;

namespace UrunKatalogAPI.Core.Domain.Entities
{
    public class Offer : Entity
    {
        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; }
        public virtual int ProductId { get; set; }
        public bool IsOfferPercentage { get; set; }
        public int OfferedPrice { get; set; }
    }
}
