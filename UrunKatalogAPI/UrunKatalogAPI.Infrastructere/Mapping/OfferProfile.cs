using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Domain.Entities;

namespace UrunKatalogAPI.Infrastructere.Mapping
{
    public class OfferProfile : Profile
    {

        public OfferProfile()
        {
            CreateMap<Offer, OfferResource>()
                           .ForMember(x => x.UserName, opt => opt.MapFrom(x => x.User.UserName))
                           .ForMember(x => x.ProductName, opt => opt.MapFrom(x => x.Product.Name))
                           .ForMember(x => x.CurrentPrice, opt => opt.MapFrom(x => x.Product.BuyItNowPrice))
                           .ForMember(x => x.OwnerId, opt => opt.MapFrom(x => x.Product.UserId))
                           ;
            CreateMap<SaveOfferResource, Offer>();
            CreateMap<UpdateOfferResource, Offer>();
            CreateMap<PaginatedResult<Offer>, PaginatedResult<OfferResource>>();
        }
    }
}
