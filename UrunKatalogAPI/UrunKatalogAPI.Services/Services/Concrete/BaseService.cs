using AutoMapper;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrunKatalogAPI.Core.DTO;
using UrunKatalogAPI.Core.Entities;
using UrunKatalogAPI.Core.Interfaces;
using UrunKatalogAPI.Services.Services.Abstract;

namespace UrunKatalogAPI.Services.Services.Concrete
{
    public class BaseService<Dto, TEntity> : IBaseService<Dto, TEntity> where TEntity : class
    {
        private readonly IGenericRepository<TEntity> _repository;
        private readonly IUnitOfWork _unitOfWork;
        protected readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public BaseService(IGenericRepository<TEntity> repository,IUnitOfWork unitOfWork, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _repository= repository;
            _unitOfWork= unitOfWork;
            _mapper= mapper;
            _httpContextAccessor= httpContextAccessor;
        }




        public virtual async Task<ResponseEntity> DeleteAsync(int id)
        {
           var all= await _repository.GetAllAsync();
            var mappedResult = _mapper.Map<IEnumerable<TEntity>, IEnumerable<Dto>>(all);
            return new ResponseEntity(mappedResult);
        }

        public Task<ResponseEntity> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<ResponseEntity> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<ResponseEntity> InsertAsync(Dto entity)
        {
            throw new NotImplementedException();
        }

        public Task<ResponseEntity> UpdateAsync(int id, Dto entity)
        {
            throw new NotImplementedException();
        }
    }
}
