using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrunKatalogAPI.Infrastructere.Repositories
{
    public interface ISendEmailJob
    {
        public void DoLogInJob(string recipientEmail, string recipientFirstName);
        public void DoRegisterJob(string recipientEmail, string recipientFirstName);
    }
}
