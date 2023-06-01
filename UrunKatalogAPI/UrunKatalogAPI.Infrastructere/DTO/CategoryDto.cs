using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrunKatalogAPI.Infrastructere.DTO
{
    public class CategoryDto : EntityDto
    {
        public string Name { get; set; }
    }
    public class CreateCategoryInput
    {
        [Required]
        public string Name { get; set; }
      


    }
    public class UpdateCategoryInput : CreateCategoryInput
    {
        [Required]
        public int Id { get; set; }
       
    }
}
