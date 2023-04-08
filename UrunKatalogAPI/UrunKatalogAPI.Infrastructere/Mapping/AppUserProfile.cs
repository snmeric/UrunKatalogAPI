using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Domain.Entities;

namespace UrunKatalogAPI.Infrastructere.Mapping
{
    public class AppUserProfile : Profile
    {
        public AppUserProfile()
        {
            CreateMap<AppUser, UserResource>()
         .ForMember(x => x.Password, opt => opt.MapFrom(x => x.PasswordHash));
            CreateMap<SaveUserResource, AppUser>();

        }
    }
}
