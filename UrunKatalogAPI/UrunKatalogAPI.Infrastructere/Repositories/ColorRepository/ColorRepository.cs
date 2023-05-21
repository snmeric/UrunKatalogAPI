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

namespace UrunKatalogAPI.Infrastructere.Repositories.ColorRepository
{
    public class ColorRepository : IColorRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ColorRepository(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ApplicationResult<ColorDto>> Create(CreateColorInput input, ApplicationUser applicationUser)
        {
            try
            {
                Color mapCat = _mapper.Map<Color>(input);
                mapCat.CreatedById = applicationUser.Id;
                mapCat.CreatedBy = applicationUser.UserName;
                mapCat.ModifiedById = applicationUser.Id;
                mapCat.ModifiedBy = applicationUser.UserName;
                _context.Colors.Add(mapCat);
                await _context.SaveChangesAsync();
                ApplicationResult<ColorDto> result = new ApplicationResult<ColorDto>
                {
                    Result = _mapper.Map<ColorDto>(mapCat),
                    Succeeded = true
                };

                return result;
            }
            catch (Exception)
            {

                return new ApplicationResult<ColorDto>
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
                var willDelete = _context.Colors.Where(x => x.Id == id).FirstOrDefault();
                if (willDelete != null)
                {
                    _context.Colors.Remove(willDelete);
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

        public async Task<ApplicationResult<ColorDto>> Get(int id)
        {
            try
            {
                Color color = _context.Colors.Where(x => x.Id == id).FirstOrDefault();
                ColorDto dto = new()
                {
                    CreatedBy = color.CreatedBy,
                    CreatedById = color.CreatedById,
                    CreatedDate = color.CreatedDate,
                    Id = color.Id,
                    ModifiedBy = color.ModifiedBy,
                    ModifiedById = color.ModifiedById,
                    ModifiedDate = color.ModifiedDate,
                    Name = color.Name
                };
                return new ApplicationResult<ColorDto>
                {
                    Result = dto,
                    Succeeded = true
                };
            }
            catch (Exception)
            {
                return new ApplicationResult<ColorDto>
                {
                    Succeeded = false,
                    ErrorMessage = "Error Occured!"
                };
            }
        }

        public async Task<ApplicationResult<List<ColorDto>>> GetAll()
        {
            try
            {
                List<ColorDto> list = await _context.Colors.Select(color => new ColorDto
                {
                    CreatedBy = color.CreatedBy,
                    CreatedById = color.CreatedById,
                    CreatedDate = color.CreatedDate,
                    Id = color.Id,
                    ModifiedBy = color.ModifiedBy,
                    ModifiedById = color.ModifiedById,
                    ModifiedDate = color.ModifiedDate,
                    Name = color.Name
                }).ToListAsync();

                return new ApplicationResult<List<ColorDto>>
                {
                    Result = list,
                    Succeeded = true
                };

            }
            catch (Exception)
            {
                return new ApplicationResult<List<ColorDto>>
                {
                    Succeeded = false,
                    ErrorMessage = "Error Occured!"
                };
            }
        }

        public async Task<ApplicationResult<ColorDto>> Update(UpdateColorInput input, ApplicationUser applicationUser)
        {
            try
            {
                var getExistColor = await _context.Colors.FindAsync(input.Id);
                if (getExistColor == null)
                {
                    return new ApplicationResult<ColorDto>
                    {
                        Succeeded = false,
                        ErrorMessage = ErrorCodes.NoRecordFaund,
                        Result = new ColorDto()
                    };
                }
                if (!getExistColor.CreatedById.Equals(applicationUser.Id))
                {
                    return new ApplicationResult<ColorDto>
                    {
                        Succeeded = false,
                        ErrorMessage = ErrorCodes.NoRecordFaund,
                        Result = new ColorDto()
                    };
                }

                getExistColor.Name = input.Name;
                getExistColor.ModifiedBy = applicationUser.UserName;
                getExistColor.ModifiedById = applicationUser.Id;
                getExistColor.ModifiedDate = DateTime.UtcNow;
                _context.Update(getExistColor);
                await _context.SaveChangesAsync();

                return new ApplicationResult<ColorDto>
                {
                    Succeeded = true,
                    Result = new ColorDto
                    {
                        CreatedBy = getExistColor.CreatedBy,
                        CreatedById = getExistColor.CreatedById,
                        CreatedDate = getExistColor.CreatedDate,
                        Id = getExistColor.Id,
                        ModifiedBy = getExistColor.ModifiedBy,
                        ModifiedById = getExistColor.ModifiedById,
                        ModifiedDate = getExistColor.ModifiedDate,
                        Name = getExistColor.Name
                    }
                };
            }
            catch (Exception)
            {

                return new ApplicationResult<ColorDto>
                {
                    Succeeded = false,
                    ErrorMessage = "Error Occured!"
                };

            }
        }
    }
}
