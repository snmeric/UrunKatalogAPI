using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrunKatalogAPI.Core.Models
{
    public class Filter
    {
        public string UserId { get; set; }
        public int? CategoryId { get; set; }
        public int? ProductId { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}
