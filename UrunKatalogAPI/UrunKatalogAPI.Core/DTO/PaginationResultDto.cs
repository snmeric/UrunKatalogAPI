using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrunKatalogAPI.Core.DTO
{
    public class PaginationResultDto<T> where T : class
    {
        public IEnumerable<T> Items { get;set; }
        public int TotalItems { get; set; }
        public int CurrentPage { get; set; }
    }
}
