using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrunKatalogAPI.Core.Domain.Entities
{
    public class ErrorModel
    {
        public string Property { get; set; }
        public string Message { get; set; }
    }
}
