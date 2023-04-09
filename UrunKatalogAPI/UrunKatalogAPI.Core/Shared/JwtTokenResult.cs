using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrunKatalogAPI.Core.Shared
{
    public class JwtTokenResult
    {
        public string? AccessToken { get; set; }
        public int ExpireInSeconds { get; set; }
        public string? UserId { get; set; }
    }
}
