using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.Domain.Entities;
using UrunKatalogAPI.Core.Shared;
using UrunKatalogAPI.Infrastructere.DTO;
using UrunKatalogAPI.Infrastructere.Repositories.BrandRepository;

namespace UrunKatalogAPI.Infrastructere.Repositories.BrandRepository
{
    public class BrandRepository : IBrandRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public BrandRepository(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ApplicationResult<BrandDto>> Create(CreateBrandInput input, ApplicationUser applicationUser)
        {
            try
            {
                Brand mapCat = _mapper.Map<Brand>(input);
                mapCat.CreatedById = applicationUser.Id;
                mapCat.CreatedBy = applicationUser.UserName;
                mapCat.ModifiedById = applicationUser.Id;
                mapCat.ModifiedBy = applicationUser.UserName;
                _context.Brandies.Add(mapCat);
                await _context.SaveChangesAsync();
                ApplicationResult<BrandDto> result = new ApplicationResult<BrandDto>
                {
                    Result = _mapper.Map<BrandDto>(mapCat),
                    Succeeded = true
                };

                return result;
            }
            catch (Exception)
            {

                return new ApplicationResult<BrandDto>
                {
                    Succeeded = false,
                    ErrorMessage = "Error Occured!"
                };
            }
        }

        public async Task<ApplicationResult> Delete(int id)
        {
            try
            {
                var willDelete = _context.Brandies.Where(x => x.Id == id).FirstOrDefault();
                if (willDelete != null)
                {
                    _context.Brandies.Remove(willDelete);
                    await _context.SaveChangesAsync();
                    return new ApplicationResult { Succeeded = true };
                }
                else
                {
                    return new ApplicationResult { Succeeded = false, ErrorMessage = ErrorCodes.NoRecordFaund, };
                }
            }
            catch (Exception ex)
            {
                return new GenericException().GetError(ex);
            }
        }

        public async Task<ApplicationResult<BrandDto>> Get(int id)
        {
            try
            {
                Brand brand = _context.Brandies.Where(x => x.Id == id).FirstOrDefault();
                BrandDto dto = new()
                {
                    CreatedBy = brand.CreatedBy,
                    CreatedById = brand.CreatedById,
                    CreatedDate = brand.CreatedDate,
                    Id = brand.Id,
                    ModifiedBy = brand.ModifiedBy,
                    ModifiedById = brand.ModifiedById,
                    ModifiedDate = brand.ModifiedDate,
                    Name = brand.Name
                };
                return new ApplicationResult<BrandDto>
                {
                    Result = dto,
                    Succeeded = true
                };
            }
            catch (Exception)
            {
                return new ApplicationResult<BrandDto>
                {
                    Succeeded = false,
                    ErrorMessage = "Error Occured!"
                };
            }
        }

        public async Task<ApplicationResult<List<BrandDto>>> GetAll()
        {
            try
            {
                List<BrandDto> list = await _context.Brandies.Select(brand => new BrandDto
                {
                    CreatedBy = brand.CreatedBy,
                    CreatedById = brand.CreatedById,
                    CreatedDate = brand.CreatedDate,
                    Id = brand.Id,
                    ModifiedBy = brand.ModifiedBy,
                    ModifiedById = brand.ModifiedById,
                    ModifiedDate = brand.ModifiedDate,
                    Name = brand.Name
                }).ToListAsync();

                return new ApplicationResult<List<BrandDto>>
                {
                    Result = list,
                    Succeeded = true
                };

            }
            catch (Exception)
            {
                return new ApplicationResult<List<BrandDto>>
                {
                    Succeeded = false,
                    ErrorMessage = "Error Occured!"
                };
            }
        }

        public async Task<ApplicationResult<BrandDto>> Update(UpdateBrandInput input, ApplicationUser applicationUser)
        {
            try
            {
                var getExistBrand = await _context.Brandies.FindAsync(input.Id);
                if (getExistBrand == null)
                {
                    return new ApplicationResult<BrandDto>
                    {
                        Succeeded = false,
                        ErrorMessage = ErrorCodes.NoRecordFaund,
                        Result = new BrandDto()
                    };
                }
                if (!getExistBrand.CreatedById.Equals(applicationUser.Id))
                {
                    return new ApplicationResult<BrandDto>
                    {
                        Succeeded = false,
                        ErrorMessage = ErrorCodes.NoRecordFaund,
                        Result = new BrandDto()
                    };
                }

                getExistBrand.Name = input.Name;
                getExistBrand.ModifiedBy = applicationUser.UserName;
                getExistBrand.ModifiedById = applicationUser.Id;
                getExistBrand.ModifiedDate = DateTime.UtcNow;
                _context.Update(getExistBrand);
                await _context.SaveChangesAsync();

                return new ApplicationResult<BrandDto>
                {
                    Succeeded = true,
                    Result = new BrandDto
                    {
                        CreatedBy = getExistBrand.CreatedBy,
                        CreatedById = getExistBrand.CreatedById,
                        CreatedDate = getExistBrand.CreatedDate,
                        Id = getExistBrand.Id,
                        ModifiedBy = getExistBrand.ModifiedBy,
                        ModifiedById = getExistBrand.ModifiedById,
                        ModifiedDate = getExistBrand.ModifiedDate,
                        Name = getExistBrand.Name
                    }
                };
            }
            catch (Exception)
            {

                return new ApplicationResult<BrandDto>
                {
                    Succeeded = false,
                    ErrorMessage = "Error Occured!"
                };

            }
        }
    }
}
