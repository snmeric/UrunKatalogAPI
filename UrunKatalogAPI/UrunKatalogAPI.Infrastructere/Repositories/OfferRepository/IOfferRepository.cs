﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Infrastructere.DTO;

namespace UrunKatalogAPI.Infrastructere.Repositories.OfferRepository
{
    public interface IOfferRepository : IRepository<int, OfferDto, CreateOfferInput, UpdateOfferInput, ApplicationUser>
    {
    }
}
