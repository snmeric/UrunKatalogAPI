using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Domain.Entities;

namespace UrunKatalogAPI.Infrastructere.Mapping
{
    public class ProductProfile : Profile
    {
        public ProductProfile()
        {
            CreateMap<Product, ProductResource>()
              .ForMember(x => x.ColorName, opt => opt.MapFrom(x => x.Color.Name))
              .ForMember(x => x.ConditionStatus, opt => opt.MapFrom(x => x.Condition.Status))
              .ForMember(x => x.Owner, opt => opt.MapFrom(x => x.User.UserName))
              .ForMember(x => x.BrandName, opt => opt.MapFrom(x => x.Brand.Name))
              .ForMember(x => x.CategoryName, opt => opt.MapFrom(x => x.Category.Name))
              ;
            CreateMap<SaveProductResource, Product>();


            CreateMap<PaginatedResult<Product>, PaginatedResult<ProductResource>>();


        }
    }
}
