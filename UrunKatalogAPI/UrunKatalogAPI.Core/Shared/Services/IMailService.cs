using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrunKatalogAPI.Core.Shared.Service
{
    public interface IMailService
    {
        Task<string> SendLogInEmailAsync(string recipientEmail);
        Task<string> SendRegisterEmailAsync(string recipientEmail);
    }
}
