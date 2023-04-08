using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Application.RequestResponse;

namespace UrunKatalogAPI.Core.Configuration
{
    public class AuthResult
    {
        public TokenResponse Token { get; set; }
        public bool Success { get; set; }
        public string Errors { get; set; }
    }
}
