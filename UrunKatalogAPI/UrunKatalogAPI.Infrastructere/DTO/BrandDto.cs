using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrunKatalogAPI.Infrastructere.DTO
{
    public class BrandDto : EntityDto
    {
        public string Name { get; set; }
    }
    public class CreateBrandInput
    {
        [Required]
        public string Name { get; set; }



    }
    public class UpdateBrandInput : CreateBrandInput
    {
        [Required]
        public int Id { get; set; }
       
    }
}
