using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Infrastructere.DTO;

namespace UrunKatalogAPI.Infrastructere.Repositories.MailRepository
{
    public interface IMailRepository : IRepository<int, MailDto, CreateMailInput, UpdateMailInput, ApplicationUser>

    {
    }
}
