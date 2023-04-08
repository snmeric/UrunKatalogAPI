using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrunKatalogAPI.Infrastructere.Mapping
{
    public class ColorProfile : Profile
    {
        public ColorProfile()
        {
            CreateMap<Color, ColorResource>();
            CreateMap<SaveColorResource, Color>();
            CreateMap<PaginatedResult<Color>, PaginatedResult<ColorResource>>();
        }
    }
}
