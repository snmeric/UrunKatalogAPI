using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Domain.Entities;

namespace UrunKatalogAPI.Infrastructere.Mapping
{
    public class PurchaseProfile : Profile
    {
        public PurchaseProfile()
        {
            CreateMap<PurchaseHistory, PurchaseHistoryResource>()
                .ForMember(x => x.BuyerName, opt => opt.MapFrom(x => x.Buyer.UserName))
                .ForMember(x => x.SellerName, opt => opt.MapFrom(x => x.Seller.UserName))
               .ForMember(x => x.ProductName, opt => opt.MapFrom(x => x.Product.Name));
            CreateMap<SavePurchaseHistoryResource, PurchaseHistory>();
            CreateMap<PaginatedResult<PurchaseHistory>, PaginatedResult<PurchaseHistoryResource>>();
        }
    }
}
