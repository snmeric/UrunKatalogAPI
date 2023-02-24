using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Entities.Common;

namespace UrunKatalogAPI.Core.Models
{
    public class Offer : BaseEntity
    {
        public int ProductId { get; set; }
        public bool teklifYuzdesi { get; set; }
        public int teklifEdilenFiyatı { get; set; }

    }
}
