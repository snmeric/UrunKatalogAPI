﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrunKatalogAPI.Core.DTO
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string CategoryName { get; set; }
    }
    public class DetailCategoryDto
    {
        public int Id { get; set; }
        public string CategoryName { get; set; }
        public ICollection<ProductDto> Products { get; set; }
    }
}
