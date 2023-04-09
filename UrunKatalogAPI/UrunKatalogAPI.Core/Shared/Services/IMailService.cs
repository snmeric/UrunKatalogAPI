using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrunKatalogAPI.Core.Shared.Services
{
    public interface IMailService
    {
        Task<string> SendLogInEmailAsync(string recipientEmail, string recipientFirstName);
        Task<string> SendRegisterEmailAsync(string recipientEmail, string recipientFirstName);
    }
}
