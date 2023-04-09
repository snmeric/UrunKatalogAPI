using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrunKatalogAPI.Core.Shared
{
    public class ApplicationResult<T> : CommonApplicationResult
    {
        public T Result { get; set; }
    }
    public class ApplicationResult : CommonApplicationResult
    {

    }
    public class CommonApplicationResult
    {
        public DateTime ResponseTime { get; set; } = DateTime.UtcNow;
        public bool Succeeded { get; set; }
        public string ErrorMessage { get; set; }

    }
}
