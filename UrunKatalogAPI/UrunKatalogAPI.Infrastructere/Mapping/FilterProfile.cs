using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Domain.Entities;

namespace UrunKatalogAPI.Infrastructere.Mapping
{
    public class FilterProfile : Profile
    {

        public FilterProfile()
        {
            CreateMap<FilterResource, Filter>();

        }
    }
}
